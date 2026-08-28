'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { compressImageFile } from '@/lib/compressImage';
import { deleteRemoteImage, isUploadedImageUrl } from '@/lib/deleteRemoteImage';

export default function ImageUpload({
  value = '',
  onChange,
  folder = 'maple',
  label = 'Image',
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');

  const uploadFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setError('');
    setProgress('Compressing…');

    try {
      const compressed = await compressImageFile(file);
      setProgress('Uploading…');
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

  const removeImage = async () => {
    if (!value) return;
    setRemoving(true);
    setError('');

    try {
      if (isUploadedImageUrl(value)) {
        setProgress('Removing file…');
        await deleteRemoteImage(value);
      }
      onChange?.('');
      setProgress('');
    } catch (err) {
      setError(err.message || 'Failed to remove image');
    } finally {
      setRemoving(false);
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
            disabled={uploading || removing}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? 'Uploading…' : 'Upload image'}
          </button>
          {value ? (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              disabled={uploading || removing}
              onClick={removeImage}
            >
              {removing ? 'Removing…' : 'Remove image'}
            </button>
          ) : null}
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
            placeholder="/uploads/… or /images/…"
          />
        </label>

        {progress && <p className="ad-upload-meta">{progress}</p>}
        {error && <p className="dm-form-status err">{error}</p>}
      </div>
    </div>
  );
}
