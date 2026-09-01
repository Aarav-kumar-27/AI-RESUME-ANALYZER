import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertTriangle, X, File } from 'lucide-react';

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export default function FileUploader({ file, setFile, error, setError }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;

    setError(null);
    const filename = selectedFile.name.toLowerCase();

    // 1. Extension check using JavaScript endsWith
    if (!filename.endsWith('.pdf') && !filename.endsWith('.docx')) {
      setError('Please upload a PDF (.pdf) or Word document (.docx) file.');
      return;
    }

    // 2. Size check
    if (selectedFile.size > MAX_SIZE_BYTES) {
      setError(`Your resume (${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB) exceeds the 5 MB file size limit.`);
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-slate-900 dark:text-white">
        Upload Resume <span className="text-rose-500">*</span>
      </label>

      {!file ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 shadow-lg scale-[1.01]'
              : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-slate-100/50 dark:hover:bg-slate-900/80'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <div className="mx-auto h-12 w-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
            <UploadCloud className="h-6 w-6" />
          </div>

          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
            <span className="text-indigo-600 dark:text-indigo-400 underline decoration-indigo-400 underline-offset-2">
              Click to browse
            </span>{' '}
            or drag & drop your resume
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Supports PDF or DOCX (Max size: 5 MB)
          </p>
        </div>
      ) : (
        /* Selected File Preview Card */
        <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 font-bold text-xs uppercase">
              {file.name.endsWith('.pdf') ? 'PDF' : 'DOCX'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {file.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <span>{formatFileSize(file.size)}</span>
                <span>&bull;</span>
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                  <CheckCircle className="h-3 w-3" /> Ready
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setFile(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
            title="Remove file"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Validation Error Message */}
      {error && (
        <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
