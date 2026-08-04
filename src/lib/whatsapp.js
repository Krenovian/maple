/** Studio WhatsApp number — digits only, country code included (e.g. 919876543210). */
export function getWhatsAppNumber() {
  return (
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    process.env.WHATSAPP_NUMBER ||
    '919876543210'
  ).replace(/\D/g, '');
}

export function buildWhatsAppUrl(message, phone = getWhatsAppNumber()) {
  const text = encodeURIComponent(String(message || '').trim());
  return `https://wa.me/${phone}?text=${text}`;
}

export function formatOrderWhatsAppMessage({ name, email, phone, note, items, source }) {
  const lines = [
    source === 'enquire' ? '*MAPLE — Product Enquiry*' : '*MAPLE — Order Lead*',
    '',
    `*Name:* ${name}`,
    `*Email:* ${email}`,
    `*Phone:* ${phone}`,
    '',
    '*Items:*',
  ];

  (items || []).forEach((item, i) => {
    const qty = item.qty || 1;
    const bits = [
      item.name,
      item.finish ? `Finish: ${item.finish}` : null,
      item.sample ? `Sample: ${item.sample}` : null,
      item.price || null,
      `Qty: ${qty}`,
    ].filter(Boolean);
    lines.push(`${i + 1}. ${bits.join(' · ')}`);
  });

  if (note?.trim()) {
    lines.push('', `*Note:* ${note.trim()}`);
  }

  lines.push('', '_Sent from mapleinfra website_');
  return lines.join('\n');
}

export function formatInquiryWhatsAppMessage({ name, email, phone, message, productName, finish, sample }) {
  const lines = [
    '*MAPLE — Product Enquiry*',
    '',
    `*Name:* ${name}`,
    `*Email:* ${email}`,
    phone ? `*Phone:* ${phone}` : null,
    productName ? `*Product:* ${productName}` : null,
    finish ? `*Finish:* ${finish}` : null,
    sample ? `*Sample:* ${sample}` : null,
    '',
    '*Message:*',
    message || '—',
    '',
    '_Sent from mapleinfra website_',
  ].filter((line) => line !== null);
  return lines.join('\n');
}

/** Open a blank tab synchronously (must run inside the click handler before await). */
export function prepareWhatsAppTab() {
  if (typeof window === 'undefined') return null;
  try {
    return window.open('', '_blank');
  } catch {
    return null;
  }
}

/** Navigate a prepared tab, or fall back to a direct navigation. */
export function openWhatsApp(url, preparedTab = null) {
  if (typeof window === 'undefined' || !url) return false;

  if (preparedTab && !preparedTab.closed) {
    try {
      preparedTab.location.href = url;
      preparedTab.focus();
      return true;
    } catch {
      /* fall through */
    }
  }

  // Anchor click is less often blocked than window.open after await
  try {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove();
    return true;
  } catch {
    window.location.assign(url);
    return true;
  }
}
