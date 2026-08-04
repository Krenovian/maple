import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { buildWhatsAppUrl, formatInquiryWhatsAppMessage } from '@/lib/whatsapp';

export async function POST(req) {
  try {
    const data = await req.json();
    const name = String(data.name || '').trim();
    const email = String(data.email || '').trim();
    const phone = String(data.phone || '').trim();
    const message = String(data.message || '').trim();
    const finish = data.finish ? String(data.finish) : '';
    const sample = data.sample ? String(data.sample) : '';

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 });
    }

    const product = data.productSlug
      ? await prisma.product.findUnique({ where: { slug: data.productSlug } })
      : null;

    if (data.productSlug && !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        phone: phone || null,
        message,
        productId: product?.id || null,
      },
    });

    // Also store as order lead when it's a product enquiry with phone
    let orderLeadId = null;
    if (product && phone) {
      const lead = await prisma.orderLead.create({
        data: {
          name,
          email,
          phone,
          note: message,
          items: JSON.stringify([
            {
              productId: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price || '',
              image: product.image,
              finish,
              sample,
              qty: 1,
            },
          ]),
          totalHint: product.price || null,
          source: 'enquire',
          status: 'NEW',
        },
      });
      orderLeadId = lead.id;
    }

    const whatsappUrl = buildWhatsAppUrl(
      formatInquiryWhatsAppMessage({
        name,
        email,
        phone,
        message,
        productName: product?.name,
        finish,
        sample,
      })
    );

    return NextResponse.json({ ...inquiry, orderLeadId, whatsappUrl });
  } catch (error) {
    console.error('Inquiry error:', error);
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
  }
}
