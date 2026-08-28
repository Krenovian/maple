'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { compressImageFile } from '@/lib/compressImage';
import { deleteRemoteImage, isUploadedImageUrl } from '@/lib/deleteRemoteImage';

export default function GalleryUpload({
  values = [],
  onChange,
  folder = 'maple/projects',
  max = 12,
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');

  const list = Array.isArray(values) ? values.filter(Boolean) : [];

  const setList = (next) => onChange?.(next);

  const uploadFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;

    const room = Math.max(0, max - list.length);
    if (room === 0) {
      setError(`You can add up to ${max} gallery images`);
      return;
    }

    const batch = files.slice(0, room);
    setUploading(true);
    setError('');
    setProgress(`Preparing 0/${batch.length}…`);

    const uploaded = [];
    try {
      for (let i = 0; i < batch.length; i += 1) {
        setProgress(`Compressing ${i + 1}/${batch.length}…`);
        const compressed = await compressImageFile(batch[i]);
        setProgress(`Uploading ${i + 1}/${batch.length}…`);
        const body = new FormData();
        body.append('file', compressed);
        body.append('folder', folder);
        const res = await fetch('/api/admin/upload', { method: 'POST', body });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Upload failed');
        uploaded.push(data.url);
      }
      setList([...list, ...uploaded]);
      setProgress(`Added ${uploaded.length} image${uploaded.length === 1 ? '' : 's'}`);
      setTimeout(() => setProgress(''), 1600);
    } catch (err) {
      if (uploaded.length) setList([...list, ...uploaded]);
      setError(err.message || 'Upload failed');
      setProgress('');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const removeAt = async (index) => {
    const url = list[index];
    if (!url) return;

    setError('');
    if (isUploadedImageUrl(url)) setProgress('Removing file…');

    try {
      if (isUploadedImageUrl(url)) {
        await deleteRemoteImage(url);
      }
      setList(list.filter((_, i) => i !== index));
      setProgress('');
    } catch (err) {
      setError(err.message || 'Failed to remove image');
      setProgress('');
    }
  };

  const move = (index, dir) => {
    const next = [...list];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setList(next);
  };

  return (
    <div className="ad-gallery">
      <div className="ad-gallery-top">
        <p>
          Gallery images ({list.length}/{max}). Use ↑↓ to reorder — first is primary in the gallery.
        </p>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          disabled={uploading || list.length >= max}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? 'Uploading…' : 'Add images'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          multiple
          hidden
          onChange={(e) => uploadFiles(e.target.files)}
        />
      </div>

      {list.length === 0 ? (
        <p className="ad-gallery-empty">No gallery images yet. Cover image still shows on the hero.</p>
      ) : (
        <ul className="ad-gallery-grid">
          {list.map((url, i) => (
            <li key={`${url}-${i}`} className="ad-gallery-item">
              <div className="ad-gallery-thumb">
                <Image src={url} alt={`Gallery ${i + 1}`} fill sizes="120px" style={{ objectFit: 'cover' }} />
                {i === 0 && <span className="ad-gallery-badge">1st</span>}
              </div>
              <div className="ad-gallery-item-actions">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move earlier">↑</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === list.length - 1} aria-label="Move later">↓</button>
                <button type="button" className="danger" onClick={() => removeAt(i)} aria-label="Remove">×</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {progress && <p className="ad-upload-meta">{progress}</p>}
      {error && <p className="dm-form-status err">{error}</p>}
    </div>
  );
}
