'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { openWhatsApp, prepareWhatsAppTab } from '@/lib/whatsapp';

function ContactFormInner() {
  const searchParams = useSearchParams();
  const productSlug = searchParams.get('product');
  const finish = searchParams.get('finish');
  const sample = searchParams.get('sample');
  const isProductInquiry = !!productSlug;

  const [status, setStatus] = useState('idle');
  const [waUrl, setWaUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setWaUrl('');

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    let message = data.message;
    if (isProductInquiry) {
      message = [
        data.message,
        finish ? `Preferred finish: ${finish}` : '',
        sample ? `Sample size: ${sample}` : '',
      ]
        .filter(Boolean)
        .join('\n');
    }

    const waTab = isProductInquiry ? prepareWhatsAppTab() : null;

    try {
      const res = await fetch(isProductInquiry ? '/api/inquiries' : '/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          message,
          subject: isProductInquiry
            ? `Product — ${productSlug.replace(/-/g, ' ')}`
            : 'General inquiry',
          ...(isProductInquiry
            ? { productSlug, finish: finish || '', sample: sample || '' }
            : {}),
        }),
      });
      const payload = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus('success');
        e.target.reset();
        if (isProductInquiry && payload.whatsappUrl) {
          setWaUrl(payload.whatsappUrl);
          openWhatsApp(payload.whatsappUrl, waTab);
        } else {
          try { waTab?.close(); } catch { /* ignore */ }
        }
      } else {
        try { waTab?.close(); } catch { /* ignore */ }
        setStatus('error');
      }
    } catch {
      try { waTab?.close(); } catch { /* ignore */ }
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {isProductInquiry && (
        <div className="dm-note">
          <strong>Inquiring about:</strong> {productSlug.replace(/-/g, ' ')}
          {finish ? ` · ${finish}` : ''}
          {sample ? ` · ${sample}` : ''}
          <br />
          <span style={{ opacity: 0.85 }}>After submit we&apos;ll open WhatsApp with your enquiry.</span>
        </div>
      )}

      <div className="dm-form-group">
        <label>Name</label>
        <input type="text" name="name" required placeholder="Your name" autoComplete="name" />
      </div>
      <div className="dm-form-group">
        <label>Phone</label>
        <input
          type="tel"
          name="phone"
          required
          placeholder="+91 9XXXXXXXXX"
          autoComplete="tel"
        />
      </div>
      <div className="dm-form-group">
        <label>Message</label>
        <textarea
          name="message"
          required
          placeholder="How can we help?"
        />
      </div>

      <button type="submit" className="btn" disabled={status === 'submitting'} style={{ width: '100%' }}>
        {status === 'submitting'
          ? 'Sending...'
          : isProductInquiry
            ? 'Save & open WhatsApp ↗'
            : 'Send message'}
      </button>

      {status === 'success' && (
        <div>
          <p className="dm-form-status ok">
            {isProductInquiry
              ? 'Lead saved.'
              : 'Thank you. We will be in touch shortly.'}
          </p>
          {waUrl && (
            <a
              className="btn btn-outline"
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ width: '100%', textAlign: 'center', marginTop: '0.75rem' }}
            >
              Open WhatsApp now ↗
            </a>
          )}
        </div>
      )}
      {status === 'error' && (
        <p className="dm-form-status err">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}

export default function ContactForm() {
  return (
    <Suspense fallback={<p style={{ color: 'var(--text-muted)' }}>Loading form...</p>}>
      <ContactFormInner />
    </Suspense>
  );
}
