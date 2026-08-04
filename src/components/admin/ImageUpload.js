'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { compressImageFile } from '@/lib/compressImage';

export default function ImageUpload({
  value = '',
  onChange,
  folder = 'maple',
  label = 'Image',
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');

  const uploadFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setError('');
    setProgress('Compressing…');

    try {
      const compressed = await compressImageFile(file);
      setProgress('Uploading to Cloudinary…');
      const body = new FormData();
      body.append('file', compressed);
      body.append('folder', folder);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      onChange?.(data.url);
      setProgress('Uploaded');
      setTimeout(() => setProgress(''), 1500);
    } catch (err) {
      setError(err.message || 'Upload failed');
      setProgress('');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="ad-upload">
      <div className="ad-upload-preview">
        {value ? (
          <Image src={value} alt="Preview" fill sizes="160px" style={{ objectFit: 'cover' }} />
        ) : (
          <span>No image</span>
        )}
      </div>

      <div className="ad-upload-controls">
        <div className="ad-upload-actions">
          <button
            type="button"
            className="btn btn-outline btn-sm"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? 'Uploading…' : 'Upload to Cloudinary'}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            hidden
            onChange={(e) => uploadFile(e.target.files?.[0])}
          />
        </div>

        <label className="ad-upload-url">
          <span>{label} URL</span>
          <input
            required
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder="https://res.cloudinary.com/… or /images/…"
          />
        </label>

        {progress && <p className="ad-upload-meta">{progress}</p>}
        {error && <p className="dm-form-status err">{error}</p>}
      </div>
    </div>
  );
}
