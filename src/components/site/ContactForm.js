'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { openWhatsApp, prepareWhatsAppTab } from '@/lib/whatsapp';

const INTENTS = [
  { id: 'project', label: 'New Project' },
  { id: 'materials', label: 'Materials Quote' },
  { id: 'visit', label: 'Office Visit' },
];

function ContactFormInner() {
  const searchParams = useSearchParams();
  const productSlug = searchParams.get('product');
  const finish = searchParams.get('finish');
  const sample = searchParams.get('sample');
  const isProductInquiry = !!productSlug;

  const [intent, setIntent] = useState(isProductInquiry ? 'materials' : 'project');
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [status, setStatus] = useState('idle');
  const [waUrl, setWaUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setWaUrl('');

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.intent = intent;
    data.budget = budget;
    data.timeline = timeline;
    if (isProductInquiry) {
      data.productSlug = productSlug;
      data.finish = finish || '';
      data.sample = sample || '';
      data.message = [
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
          ...data,
          subject: data.subject || `${intent} — ${data.name}`,
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
      <div className="dm-intent">
        {INTENTS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={intent === item.id ? 'is-active' : ''}
            onClick={() => setIntent(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

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
        <input type="text" name="name" required placeholder="Your full name" />
      </div>
      <div className="dm-form-group">
        <label>Email</label>
        <input type="email" name="email" required placeholder="email@example.com" />
      </div>
      <div className="dm-form-group">
        <label>Phone {isProductInquiry ? '/ WhatsApp' : '(Optional)'}</label>
        <input
          type="tel"
          name="phone"
          required={isProductInquiry}
          placeholder="+91 9XXXXXXXXX"
        />
      </div>

      {!isProductInquiry && (
        <div className="dm-form-group">
          <label>Subject</label>
          <input type="text" name="subject" required placeholder="How can we help?" />
        </div>
      )}

      {intent === 'project' && (
        <>
          <div className="dm-form-group">
            <label>Approx. budget</label>
            <select value={budget} onChange={(e) => setBudget(e.target.value)} required>
              <option value="">Select a range</option>
              <option>Under ₹1 Cr</option>
              <option>₹1–3 Cr</option>
              <option>₹3–7 Cr</option>
              <option>₹7 Cr+</option>
              <option>Not sure yet</option>
            </select>
          </div>
          <div className="dm-form-group">
            <label>Desired timeline</label>
            <select value={timeline} onChange={(e) => setTimeline(e.target.value)} required>
              <option value="">Select timing</option>
              <option>Ready to start</option>
              <option>Within 3 months</option>
              <option>3–6 months</option>
              <option>Exploring / research</option>
            </select>
          </div>
        </>
      )}

      <div className="dm-form-group">
        <label>Message</label>
        <textarea
          name="message"
          required
          placeholder={
            intent === 'visit'
              ? 'Tell us when you’d like to visit the studio…'
              : 'Tell us about your site, brief, or material needs…'
          }
        />
      </div>

      <button type="submit" className="btn" disabled={status === 'submitting'} style={{ width: '100%' }}>
        {status === 'submitting'
          ? 'Sending...'
          : isProductInquiry
            ? 'Save & open WhatsApp ↗'
            : 'Send Message'}
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
