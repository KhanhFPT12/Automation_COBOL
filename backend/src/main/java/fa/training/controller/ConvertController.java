package fa.training.controller;

import java.io.*;
import java.nio.file.*;
import java.util.zip.*;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * REST controller that accepts BMS/DSPF file uploads,
 * runs the Python conversion script, and returns a ZIP of generated React components.
 */
@RestController
@RequestMapping("/api/v1/convert")
public class ConvertController {

    @Value("${app.python.scripts.path:../py/convertTo_CICS_MainFrame}")
    private String pythonScriptsPath;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<byte[]> convert(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam("type") String type) throws IOException, InterruptedException {

        Path tempDir = Files.createTempDirectory("cics2react_");
        Path inputDir = tempDir.resolve("input");
        Path outputDir = tempDir.resolve("output");
        Files.createDirectories(inputDir);
        Files.createDirectories(outputDir);

        try {
            for (MultipartFile file : files) {
                String filename = file.getOriginalFilename();
                if (filename == null || filename.isBlank()) continue;
                Path dest = inputDir.resolve(filename);
                file.transferTo(dest.toFile());
            }

            String scriptName = type.equalsIgnoreCase("bms") ? "bms2react.py" : "dspf2react.py";
            String typeFlag = type.equalsIgnoreCase("bms") ? "-bms" : "-dspf";

            Path scriptPath = Paths.get(pythonScriptsPath).toAbsolutePath().resolve(scriptName);

            ProcessBuilder pb = new ProcessBuilder(
                "python",
                scriptPath.toString(),
                typeFlag, inputDir.toAbsolutePath().toString(),
                "-react", outputDir.toAbsolutePath().toString()
            );
            pb.redirectErrorStream(true);
            Process process = pb.start();

            StringBuilder log = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    log.append(line).append("\n");
                }
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(("Conversion failed:\n" + log).getBytes());
            }

            byte[] zipBytes = zipDirectory(outputDir);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDisposition(
                ContentDisposition.attachment().filename("converted_react.zip").build()
            );
            return ResponseEntity.ok().headers(headers).body(zipBytes);

        } finally {
            deleteDirectory(tempDir.toFile());
        }
    }

    private byte[] zipDirectory(Path dir) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (ZipOutputStream zos = new ZipOutputStream(baos)) {
            Files.walk(dir).filter(Files::isRegularFile).forEach(file -> {
                String entry = dir.relativize(file).toString().replace("\\", "/");
                try {
                    zos.putNextEntry(new ZipEntry(entry));
                    Files.copy(file, zos);
                    zos.closeEntry();
                } catch (IOException e) {
                    throw new UncheckedIOException(e);
                }
            });
        }
        return baos.toByteArray();
    }

    private void deleteDirectory(File dir) {
        if (dir.isDirectory()) {
            File[] children = dir.listFiles();
            if (children != null) {
                for (File child : children) deleteDirectory(child);
            }
        }
        dir.delete();
    }
}
