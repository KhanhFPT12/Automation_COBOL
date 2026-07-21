import { useState, useRef, type ChangeEvent, type DragEvent } from 'react';
import axios from 'axios';
import styles from './ConvertPage.module.css';
import httpConfig from '../../config/httpConfig';

type FileType = 'bms' | 'dspf';
type Status = 'idle' | 'converting' | 'success' | 'error';

export default function ConvertPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [fileType, setFileType] = useState<FileType>('bms');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptedExt = fileType === 'bms' ? '.bms' : '.dspf';

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const filtered = Array.from(incoming).filter((f) =>
      f.name.toLowerCase().endsWith(acceptedExt)
    );
    const invalid = Array.from(incoming).filter(
      (f) => !f.name.toLowerCase().endsWith(acceptedExt)
    );
    if (invalid.length > 0) {
      setErrorMsg(
        `Bỏ qua ${invalid.length} file không hợp lệ (chỉ chấp nhận ${acceptedExt})`
      );
    } else {
      setErrorMsg('');
    }
    setFiles((prev) => {
      const names = new Set(prev.map((f) => f.name));
      return [...prev, ...filtered.filter((f) => !names.has(f.name))];
    });
    setStatus('idle');
    setDownloadUrl('');
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files);
    e.target.value = '';
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const removeFile = (name: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
    setStatus('idle');
    setDownloadUrl('');
  };

  const clearAll = () => {
    setFiles([]);
    setStatus('idle');
    setErrorMsg('');
    setDownloadUrl('');
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    setStatus('converting');
    setErrorMsg('');
    setDownloadUrl('');

    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));
    formData.append('type', fileType);

    try {
      const response = await axios.post(
        httpConfig.domain + httpConfig.resources.convert,
        formData,
        { responseType: 'blob' }
      );

      const url = URL.createObjectURL(
        new Blob([response.data], { type: 'application/zip' })
      );
      setDownloadUrl(url);
      setStatus('success');
    } catch (err: any) {
      const msg =
        err?.response?.data instanceof Blob
          ? await err.response.data.text()
          : 'Chuyển đổi thất bại. Kiểm tra lại file đầu vào.';
      setErrorMsg(msg);
      setStatus('error');
    }
  };

  const handleTypeChange = (t: FileType) => {
    setFileType(t);
    setFiles([]);
    setStatus('idle');
    setErrorMsg('');
    setDownloadUrl('');
  };

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Chuyển đổi Mainframe → React</h2>
      <p className={styles.subtitle}>
        Upload file <strong>.bms</strong> hoặc <strong>.dspf</strong> — nhận về
        React TypeScript components dạng ZIP.
      </p>

      {/* Type selector */}
      <div className={styles.typeRow}>
        <span className={styles.label}>Loại file:</span>
        {(['bms', 'dspf'] as FileType[]).map((t) => (
          <button
            key={t}
            className={`${styles.typeBtn} ${fileType === t ? styles.typeBtnActive : ''}`}
            onClick={() => handleTypeChange(t)}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Drop zone */}
      <div
        className={`${styles.dropzone} ${isDragging ? styles.dropzoneDragging : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={acceptedExt}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <p className={styles.dropzoneText}>
          {isDragging
            ? `Thả file ${acceptedExt} vào đây`
            : `Kéo thả hoặc click để chọn file ${acceptedExt}`}
        </p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className={styles.fileList}>
          <div className={styles.fileListHeader}>
            <span>{files.length} file đã chọn</span>
            <button className={styles.clearBtn} onClick={clearAll}>
              Xoá tất cả
            </button>
          </div>
          {files.map((f) => (
            <div key={f.name} className={styles.fileItem}>
              <span className={styles.fileName}>{f.name}</span>
              <span className={styles.fileSize}>
                {(f.size / 1024).toFixed(1)} KB
              </span>
              <button
                className={styles.removeBtn}
                onClick={() => removeFile(f.name)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {errorMsg && <p className={styles.error}>{errorMsg}</p>}

      {/* Action buttons */}
      <div className={styles.actions}>
        <button
          className={styles.convertBtn}
          onClick={handleConvert}
          disabled={files.length === 0 || status === 'converting'}
        >
          {status === 'converting' ? 'Đang chuyển đổi...' : 'Chuyển đổi'}
        </button>

        {status === 'success' && downloadUrl && (
          <a
            href={downloadUrl}
            download="converted_react.zip"
            className={styles.downloadBtn}
          >
            Tải xuống ZIP
          </a>
        )}
      </div>

      {status === 'success' && (
        <p className={styles.successMsg}>
          Chuyển đổi thành công! Giải nén ZIP vào{' '}
          <code>frontend/src/pages/BMSPage</code> hoặc{' '}
          <code>frontend/src/pages/DSPFPage</code>.
        </p>
      )}
    </div>
  );
}
