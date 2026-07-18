const path = require('path');
const fs = require('fs');
const os = require('os');
const { exec } = require('child_process');
const { promisify } = require('util');
const { ZipArchive } = require('archiver');
const unzipper = require('unzipper');
const crypto = require('crypto');

const execAsync = promisify(exec);

// Override via env vars for machines/deployments where the layout differs;
// default to this repo's own py/ and frontend/ folders so it works out of the box.
const PYTHON_SCRIPT = process.env.PYTHON_BMS2REACT_SCRIPT
  || path.resolve(__dirname, '..', '..', '..', 'py', 'convertTo_CICS_MainFrame', 'bms2react.py');

// Source of the full CICS2React frontend template
const FRONTEND_TEMPLATE = process.env.FRONTEND_TEMPLATE_DIR
  || path.resolve(__dirname, '..', '..', '..', 'frontend');

// Folders/files to skip when copying the template
const COPY_EXCLUDE = new Set(['node_modules', 'dist', '.git', 'build', '.env', '.env.local']);

const README_CONTENT = `# BMS to React — Dự án React hoàn chỉnh

Dự án React đã được tự động sinh ra từ các file BMS của bạn bằng công cụ **CICS2React** của ALSM.

---

## Hướng dẫn chạy nhanh

\`\`\`bash
# 1. Cài thư viện
npm install

# 2. Khởi động ứng dụng
npm run dev
\`\`\`

Sau đó mở trình duyệt tại: **http://localhost:5173** — trang chủ sẽ tự chuyển thẳng đến màn hình BMS đầu tiên đã convert.

---

## Điều hướng đến màn hình BMS

Dùng menu bên trái (Sidebar) để chuyển qua các màn hình BMS khác đã được convert,
hoặc truy cập trực tiếp qua URL theo tên màn hình, ví dụ \`http://localhost:5173/BNK1MAI\`.

---

## Cấu trúc dự án

\`\`\`
src/
├── pages/
│   └── BMSPage/          ← Các màn hình BMS đã được convert
│       ├── SCREEN1.tsx
│       ├── SCREEN2.tsx
│       └── bmsRoutes.tsx ← Routes tự động sinh
├── components/           ← GridItem, Input, Button, Menu, v.v.
├── layouts/              ← DefaultLayout (Header, Footer, Sidebar)
└── features/             ← Redux store, theme slices
\`\`\`

---

## Đổi giao diện (Theme)

Nhấn nút bánh răng ⚙ góc phải giữa màn hình để đổi theme:
- **Default** — nền tối, chữ xám
- **Mainframe Green** — nền đen, chữ xanh lá
- **Mainframe Yellow** — nền đen, chữ vàng cam
- **Mainframe White** — nền đen, chữ trắng

---

## Ghi chú

- Các màn hình BMS có form input có thể submit (Enter) để gọi API.
  Nếu chưa có backend Spring Boot, API sẽ trả lỗi — đây là bình thường, UI vẫn hiển thị đúng.
- Backend mặc định kết nối tới \`http://localhost:8080\`.
  Sửa trong \`src/config/httpConfig.tsx\` nếu cần.

---

Được tạo bởi **ALSM · CICS2React Converter**
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
function generateMainEntry(screenNames) {
  const firstScreen = screenNames[0];
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
            <Route
              path="/"
              element={${firstScreen ? `<Navigate to="/${firstScreen}" replace />` : '<DefaultLayout><p>No BMS screens were generated.</p></DefaultLayout>'}}
            />
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>
);
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

  try {
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
      return res.status(400).json({ success: false, message: 'Không có file nào được tải lên.' });
    }

    // ── 2. Locate BMS files ───────────────────────────────────────────────
    const bmsDir = findBmsDirectory(inputDir);
    if (!bmsDir) {
      return res.status(400).json({
        success: false,
        message: 'Không tìm thấy file .bms nào. Hãy đảm bảo file ZIP chứa các file .bms.',
      });
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
      return res.status(500).json({
        success: false,
        message: 'Quá trình chuyển đổi không sinh ra file nào. Kiểm tra lại định dạng file BMS.',
      });
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

    // ── 8. Write README at project root ───────────────────────────────────
    fs.writeFileSync(path.join(projectDir, 'README.md'), README_CONTENT, 'utf8');

    // ── 9. Stream ZIP response ────────────────────────────────────────────
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="bms-react-project.zip"');

    const archive = new ZipArchive({ zlib: { level: 6 } });
    archive.on('error', (err) => {
      if (!res.headersSent) {
        res.status(500).json({ success: false, message: 'Lỗi khi tạo zip: ' + err.message });
      }
    });
    archive.pipe(res);
    // Put everything inside a folder named "bms-react-project" in the zip
    archive.directory(projectDir, 'bms-react-project');
    await archive.finalize();

  } catch (err) {
    console.error('BMS conversion error:', err);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Lỗi chuyển đổi: ' + (err.message || 'Unknown error'),
      });
    }
  } finally {
    try { fs.rmSync(jobDir, { recursive: true, force: true }); } catch {}
    for (const p of uploadedPaths) {
      try { fs.rmSync(p, { force: true }); } catch {}
    }
  }
};
