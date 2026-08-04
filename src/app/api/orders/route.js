import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { buildWhatsAppUrl, formatOrderWhatsAppMessage } from '@/lib/whatsapp';

export async function POST(req) {
  try {
    const body = await req.json();
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim();
    const phone = String(body.phone || '').trim();
    const note = String(body.note || '').trim();
    const source = body.source === 'enquire' ? 'enquire' : 'cart';
    const items = Array.isArray(body.items) ? body.items : [];

    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'Name, email and phone are required' }, { status: 400 });
    }
    if (!items.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const normalized = items.map((item) => ({
      productId: item.productId || null,
      slug: item.slug || '',
      name: item.name || 'Item',
      price: item.price || '',
      image: item.image || '',
      finish: item.finish || '',
      sample: item.sample || '',
      qty: Math.max(1, Number(item.qty) || 1),
    }));

    const totalHint = normalized
      .map((i) => i.price)
      .filter(Boolean)
      .join(' + ') || null;

    const lead = await prisma.orderLead.create({
      data: {
        name,
        email,
        phone,
        note: note || null,
        items: JSON.stringify(normalized),
        totalHint,
        source,
        status: 'NEW',
      },
    });

    const message = formatOrderWhatsAppMessage({
      name,
      email,
      phone,
      note,
      items: normalized,
      source,
    });
    const whatsappUrl = buildWhatsAppUrl(message);

    return NextResponse.json({ id: lead.id, whatsappUrl }, { status: 201 });
  } catch (error) {
    console.error('Order lead error:', error);
    return NextResponse.json({ error: 'Failed to save order lead' }, { status: 500 });
  }
}
