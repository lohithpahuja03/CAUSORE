'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, File, Trash2, CheckCircle2, AlertTriangle, FileText, Image as ImageIcon } from 'lucide-react';

export interface UploadedEvidenceItem {
  id: string;
  name: string;
  sizeBytes: number;
  type: string;
  lastModified?: number;
  previewUrl?: string;
  sourceType: 'log' | 'report' | 'screenshot' | 'deployment' | 'data';
}

interface Props {
  files: UploadedEvidenceItem[];
  onFilesChange: (files: UploadedEvidenceItem[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const SUPPORTED_EXTENSIONS = ['.txt', '.log', '.json', '.jsonl', '.csv', '.pdf', '.png', '.jpg', '.jpeg'];
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

export default function EvidenceUploadDropzone({
  files,
  onFilesChange,
  onNext,
  onBack,
}: Props) {
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getSourceType = (name: string, mime: string): UploadedEvidenceItem['sourceType'] => {
    const ext = name.toLowerCase().split('.').pop() || '';
    if (['png', 'jpg', 'jpeg'].includes(ext)) return 'screenshot';
    if (ext === 'pdf') return 'report';
    if (['log', 'txt'].includes(ext)) return 'log';
    if (['json', 'jsonl', 'csv'].includes(ext)) return 'data';
    return 'log';
  };

  const handleAddFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setErrorMessage(null);

    const newItems: UploadedEvidenceItem[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const lowerName = file.name.toLowerCase();
      const isSupported = SUPPORTED_EXTENSIONS.some((ext) => lowerName.endsWith(ext));

      if (!isSupported) {
        setErrorMessage(`File "${file.name}" has an unsupported format. Supported: ${SUPPORTED_EXTENSIONS.join(', ')}`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        setErrorMessage(`File "${file.name}" exceeds the maximum 50MB size limit.`);
        continue;
      }

      newItems.push({
        id: `upload-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: file.name,
        sizeBytes: file.size,
        type: file.type || 'application/octet-stream',
        lastModified: file.lastModified,
        sourceType: getSourceType(file.name, file.type),
      });
    }

    onFilesChange([...files, ...newItems]);
  };

  const handleRemove = (id: string) => {
    onFilesChange(files.filter((f) => f.id !== id));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleAddFiles(e.dataTransfer.files);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Dropzone Box */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragActive ? 'var(--brand-primary)' : 'var(--border-strong)'}`,
          backgroundColor: dragActive ? 'rgba(59, 130, 246, 0.05)' : 'var(--bg-surface)',
          borderRadius: '10px',
          padding: '3rem 1.5rem',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
        id="dropzone-area"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={SUPPORTED_EXTENSIONS.join(',')}
          onChange={(e) => handleAddFiles(e.target.files)}
          style={{ display: 'none' }}
        />

        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'rgba(59, 130, 246, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem',
          color: '#60a5fa'
        }}>
          <UploadCloud size={28} />
        </div>

        <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.4rem' }}>
          Drag & Drop Incident Evidence Files
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Click to browse or drop log streams, telemetry JSONs, PDF runbooks, or dashboard captures
        </p>

        <div style={{
          display: 'inline-flex',
          gap: '0.4rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: '560px'
        }}>
          {SUPPORTED_EXTENSIONS.map((ext) => (
            <span key={ext} className="mono" style={{
              fontSize: '0.7rem',
              padding: '0.15rem 0.45rem',
              borderRadius: '3px',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-subtle)'
            }}>
              {ext}
            </span>
          ))}
        </div>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div style={{
          padding: '0.75rem 1rem',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '6px',
          color: '#f87171',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <AlertTriangle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Ingested File List */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Uploaded Evidence Items ({files.length})
          </span>
          {files.length > 0 && (
            <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Total Size: {formatBytes(files.reduce((acc, f) => acc + f.sizeBytes, 0))}
            </span>
          )}
        </div>

        {files.length === 0 ? (
          <div style={{
            padding: '1.5rem',
            textAlign: 'center',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-muted)',
            fontSize: '0.85rem'
          }}>
            No evidence files attached yet. Upload at least one file or use the Sample Dataset.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {files.map((file) => (
              <div
                key={file.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.95rem',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  fontSize: '0.85rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {file.sourceType === 'screenshot' ? (
                    <ImageIcon size={18} color="#06b6d4" />
                  ) : file.sourceType === 'report' ? (
                    <FileText size={18} color="#a855f7" />
                  ) : (
                    <File size={18} color="#38bdf8" />
                  )}
                  <div>
                    <span className="mono" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {file.name}
                    </span>
                    <span style={{ marginLeft: '0.65rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {formatBytes(file.sizeBytes)} • {file.sourceType.toUpperCase()}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemove(file.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '0.3rem',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title="Remove file"
                  aria-label="Remove file"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
        <button
          type="button"
          onClick={onBack}
          className="btn btn-secondary"
        >
          ← Back to Metadata
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={files.length === 0}
          className="btn btn-primary"
          id="btn-next-step-2"
          style={{ opacity: files.length > 0 ? 1 : 0.5, cursor: files.length > 0 ? 'pointer' : 'not-allowed' }}
        >
          Proceed to Optional Context →
        </button>
      </div>
    </div>
  );
}
