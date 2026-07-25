const path = require('path');
const fs = require('fs');
const os = require('os');
const { exec } = require('child_process');
const { promisify } = require('util');
const { ZipArchive } = require('archiver');
const unzipper = require('unzipper');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ConversionLog = require('../models/ConversionLog');

const execAsync = promisify(exec);

// This endpoint is intentionally public (no `protect` middleware) so the
// converter keeps working for anonymous visitors. We still want to
// attribute a conversion to a user when they're logged in (for
// convertCount / admin history), so this verifies the Bearer token if one
// is present but never rejects the request when it's missing or invalid.
async function getOptionalUser(req) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
    return await User.findById(decoded.id);
  } catch {
    return null;
  }
}

// Best-effort logging: a DB hiccup here must never break the actual
// conversion the user is waiting on.
async function logConversion({ user, fileType, screenCount, success, errorMessage }) {
  try {
    await ConversionLog.create({
      user: user ? user._id : null,
      fileType,
      screenCount,
      success,
      errorMessage: errorMessage || '',
    });
    if (user && success) {
      await User.updateOne({ _id: user._id }, { $inc: { convertCount: 1 } });
    }
  } catch (e) {
    console.warn('Failed to write ConversionLog:', e.message);
  }
}

function buildConversionError(code, message, rawDetails = '') {
  const details = String(rawDetails || message || '');
  const lineMatch = details.match(/(?:line|dòng)\s*[:#]?\s*(\d+)/i);
  let suggestion = 'Check the format and content of the BMS file, fix any errors, and try again.';
  if (/timed?\s*out|timeout/i.test(details)) suggestion = 'Reduce the bundle size or split the ZIP file and try again.';
  else if (/python.*(?:not recognized|not found)|ENOENT/i.test(details)) suggestion = 'Verify that Python is installed and the python command is in the PATH of the backend.';
  else if (/zip|archive|invalid signature/i.test(details)) suggestion = 'Check that the ZIP file is not corrupted and contains at least one .bms file.';
  return { code, message: message || 'Unable to complete the conversion process.', line: lineMatch ? `Line ${lineMatch[1]}` : 'Unknown', suggestion };
}

function sendConversionError(res, status, code, message, rawDetails) {
  return res.status(status).json({ success: false, message, error: buildConversionError(code, message, rawDetails) });
}

// Override via env vars for machines/deployments where the layout differs;
// default to this repo's own py/ and frontend/ folders so it works out of the box.
const PYTHON_SCRIPT = process.env.PYTHON_BMS2REACT_SCRIPT
  || path.resolve(__dirname, '..', '..', '..', 'py', 'convertTo_CICS_MainFrame', 'bms2react.py');

// Source of the full CICS2React frontend template
const FRONTEND_TEMPLATE = process.env.FRONTEND_TEMPLATE_DIR
  || path.resolve(__dirname, '..', '..', '..', 'frontend');

// Folders/files to skip when copying the template
const COPY_EXCLUDE = new Set(['node_modules', 'dist', '.git', 'build', '.env', '.env.local']);

const README_CONTENT = `# BMS to React — Complete React Project

The React project has been automatically generated from your BMS files using the ALSM **CICS2React** tool.

---

## Quick Start Guide

\`\`\`bash
# 1. Install dependencies
npm install

# 2. Start the application
npm run dev
\`\`\`

Then open your browser at: **http://localhost:5173** — the home page will automatically redirect to the first converted BMS screen.

---

## Navigating BMS Screens

Use the left menu (Sidebar) to switch between the other converted BMS screens,
or access them directly via URL by screen name, e.g., \`http://localhost:5173/BNK1MAI\`.

---

## Project Structure

\`\`\`
src/
├── pages/
│   └── BMSPage/          ← Converted BMS screens
│       ├── SCREEN1.tsx
│       ├── SCREEN2.tsx
│       └── bmsRoutes.tsx ← Automatically generated routes
├── components/           ← GridItem, Input, Button, Menu, etc.
├── layouts/              ← DefaultLayout (Header, Footer, Sidebar)
└── features/             ← Redux store, theme slices
\`\`\`

---

## Change Theme

Click the gear icon ⚙ in the right middle of the screen to change the theme:
- **Default** — dark background, grey text
- **Mainframe Green** — black background, green text
- **Mainframe Yellow** — black background, orange/yellow text
- **Mainframe White** — black background, white text

---

## Notes

- Converted BMS screens with input forms can be submitted (Enter) to call APIs.
  If the backend Spring Boot app is not running, APIs will return errors — this is normal, the UI will still display correctly.
- The backend defaults to \`http://localhost:8080\`.
  Modify this in \`src/config/httpConfig.tsx\` if needed.

---

Created by **ALSM · CICS2React Converter**
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function extractZip(zipPath, destDir) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: destDir }))
      .on('close', resolve)
      .on('error', reject);
  });
}

function findBmsDirectory(dir) {
  const entries = fs.readdirSync(dir);
  if (entries.some((f) => f.toLowerCase().endsWith('.bms'))) return dir;
  for (const entry of entries) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) {
      const found = findBmsDirectory(full);
      if (found) return found;
    }
  }
  return null;
}

function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src)) {
    if (COPY_EXCLUDE.has(entry)) continue;
    const srcPath = path.join(src, entry);
    const destPath = path.join(dest, entry);
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function generateBmsRoutes(screenNames) {
  const imports = screenNames
    .map((name) => `import ${name} from "./${name}";`)
    .join('\n');

  const routes = screenNames
    .map((name) => `  { name: "${name}", component: ${name} }`)
    .join(',\n');

  return `import { type ElementType } from 'react';

${imports}

type BMSRoutes = {
  name: string;
  component: ElementType;
}[];

const bmsRoutes: BMSRoutes = [
${routes}
];

export default bmsRoutes;
`;
}

// Entry point for the generated project: land directly on the converted
// screens (wrapped in the Sidebar/DefaultLayout) instead of the ALSM
// marketing site that the template folder is cloned from.
//
// Only BMS screen routes are registered here. Everything else copied from
// the template (the marketing pages, the DSPF demo screens, /convert,
// /login, ...) has no matching <Route>, so a "*" fallback is required -
// without it, any stray link or manual URL renders nothing (blank page).
function generateMainEntry(screenNames) {
  const firstScreen = screenNames[0];
  const fallbackElement = firstScreen
    ? `<Navigate to="/${firstScreen}" replace />`
    : '<DefaultLayout><p>No BMS screens were generated.</p></DefaultLayout>';
  return `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './features/store';
import DefaultLayout from './layouts/DefaultLayout';
import bmsRoutes from './pages/BMSPage/bmsRoutes';
import './index.css';
import './components/GlobalStyles/GlobalStyles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Routes>
            {bmsRoutes.map((route) => {
              const Screen = route.component;
              return (
                <Route
                  key={route.name}
                  path={\`/\${route.name}\`}
                  element={
                    <DefaultLayout>
                      <Screen />
                    </DefaultLayout>
                  }
                />
              );
            })}
            <Route path="/" element={${fallbackElement}} />
            {/* Catch-all: any URL not among the converted BMS screens
                (stray links, typos, leftover template pages) redirects here
                instead of rendering a blank page. */}
            <Route path="*" element={${fallbackElement}} />
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>
);
`;
}

// The full template's Sidebar lists links to the marketing site and the
// DSPF demo screens (via sidebarMenuItems.tsx). None of those routes exist
// in the cut-down router above, so those links would be dead ends (blank
// page). Regenerate the menu to only list the screens actually converted.
function generateSidebarMenuItems(screenNames) {
  const items = screenNames
    .map((name) => `  { text: '${name}', to: '/${name}', isPrivate: false },`)
    .join('\n');
  return `import { type SidebarItemProps } from './SidebarItem';

const menuItems: SidebarItemProps[] = [
${items}
];

export default menuItems;
`;
}

// ─── Main handler ─────────────────────────────────────────────────────────────

exports.convertBmsFiles = async (req, res) => {
  const jobId = crypto.randomUUID();
  const jobDir = path.join(os.tmpdir(), 'alsm', jobId);
  const inputDir = path.join(jobDir, 'input');
  const convertedDir = path.join(jobDir, 'converted');  // Python output
  const projectDir = path.join(jobDir, 'project');       // Full React project

  const uploadedPaths = [];
  let user = null;

  try {
    user = await getOptionalUser(req);
    fs.mkdirSync(inputDir, { recursive: true });
    fs.mkdirSync(convertedDir, { recursive: true });

    // ── 1. Save & extract uploaded files ─────────────────────────────────
    if (req.file) {
      uploadedPaths.push(req.file.path);
      const safeName = path.basename(req.file.originalname);
      const ext = path.extname(safeName).toLowerCase();
      if (ext === '.zip') {
        await extractZip(req.file.path, inputDir);
      } else {
        fs.copyFileSync(req.file.path, path.join(inputDir, safeName));
      }
    } else if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        uploadedPaths.push(file.path);
        const safeName = path.basename(file.originalname);
        const ext = path.extname(safeName).toLowerCase();
        if (ext === '.zip') {
          await extractZip(file.path, inputDir);
        } else {
          fs.copyFileSync(file.path, path.join(inputDir, safeName));
        }
      }
    } else {
      return sendConversionError(res, 400, 'BMS_FILE_REQUIRED', 'No file was uploaded.');
    }

    // ── 2. Locate BMS files ───────────────────────────────────────────────
    const bmsDir = findBmsDirectory(inputDir);
    if (!bmsDir) {
      return sendConversionError(res, 400, 'BMS_FILE_NOT_FOUND', 'No .bms files found. Make sure the ZIP file contains .bms files.');
    }

    // ── 3. Run Python conversion ──────────────────────────────────────────
    const cmd = `python "${PYTHON_SCRIPT}" -bms "${bmsDir}" -react "${convertedDir}"`;
    const { stdout, stderr } = await execAsync(cmd, { timeout: 120000 });
    if (stdout) console.log('[Python stdout]', stdout);
    if (stderr) console.warn('[Python stderr]', stderr);

    // Collect generated .tsx screen files (exclude bmsRoutes.tsx generated by Python)
    const generatedScreens = fs
      .readdirSync(convertedDir)
      .filter((f) => f.endsWith('.tsx') && f !== 'bmsRoutes.tsx')
      .map((f) => path.basename(f, '.tsx'));

    if (generatedScreens.length === 0) {
      return sendConversionError(res, 500, 'BMS_OUTPUT_EMPTY', 'The conversion process produced no files. Please check the BMS file format.', stderr || stdout);
    }

    // ── 4. Copy full CICS2React frontend template ─────────────────────────
    copyDirSync(FRONTEND_TEMPLATE, projectDir);

    // ── 5. Replace BMSPage files with newly generated screens ─────────────
    const bmsPageDir = path.join(projectDir, 'src', 'pages', 'BMSPage');
    fs.mkdirSync(bmsPageDir, { recursive: true });

    // Remove all existing .tsx files in BMSPage
    for (const f of fs.readdirSync(bmsPageDir)) {
      if (f.endsWith('.tsx')) {
        fs.rmSync(path.join(bmsPageDir, f));
      }
    }

    // Copy new generated screens
    for (const f of fs.readdirSync(convertedDir)) {
      if (f.endsWith('.tsx')) {
        fs.copyFileSync(path.join(convertedDir, f), path.join(bmsPageDir, f));
      }
    }

    // ── 6. Generate bmsRoutes.tsx ─────────────────────────────────────────
    fs.writeFileSync(
      path.join(bmsPageDir, 'bmsRoutes.tsx'),
      generateBmsRoutes(generatedScreens),
      'utf8'
    );

    // ── 7. Point the entry point at the converted screens, not the marketing site
    fs.writeFileSync(
      path.join(projectDir, 'src', 'main.tsx'),
      generateMainEntry(generatedScreens),
      'utf8'
    );

    // ── 7b. Regenerate the Sidebar menu so it only links to screens that
    // actually exist in the router above (no dead links to /convert, the
    // DSPF demo screens, etc.)
    fs.writeFileSync(
      path.join(projectDir, 'src', 'layouts', 'components', 'Sidebar', 'sidebarMenuItems.tsx'),
      generateSidebarMenuItems(generatedScreens),
      'utf8'
    );

    // ── 8. Write README at project root ───────────────────────────────────
    fs.writeFileSync(path.join(projectDir, 'README.md'), README_CONTENT, 'utf8');

    await logConversion({
      user,
      fileType: 'bms',
      screenCount: generatedScreens.length,
      success: true,
    });

    // ── 9. Stream ZIP response ────────────────────────────────────────────
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="bms-react-project.zip"');

    const archive = new ZipArchive({ zlib: { level: 6 } });
    archive.on('error', (err) => {
      if (!res.headersSent) {
         res.status(500).json({ success: false, message: 'Error generating ZIP: ' + err.message });
      }
    });
    archive.pipe(res);
    // Put everything inside a folder named "bms-react-project" in the zip
    archive.directory(projectDir, 'bms-react-project');
    await archive.finalize();

  } catch (err) {
    console.error('BMS conversion error:', err);
    await logConversion({
      user,
      fileType: 'bms',
      screenCount: 0,
      success: false,
      errorMessage: err.message || 'Unknown error',
    });
    if (!res.headersSent) {
      const rawDetails = [err.stderr, err.stdout, err.stack].filter(Boolean).join('\n');
      sendConversionError(res, 500, err.killed ? 'BMS_CONVERSION_TIMEOUT' : 'BMS_CONVERSION_FAILED', 'Conversion error: ' + (err.message || 'Unknown error'), rawDetails);
    }
  } finally {
    try { fs.rmSync(jobDir, { recursive: true, force: true }); } catch {}
    for (const p of uploadedPaths) {
      try { fs.rmSync(p, { force: true }); } catch {}
    }
  }
};
