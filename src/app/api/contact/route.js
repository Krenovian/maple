import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const data = await req.json();
    
    const message = await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email || '',
        phone: data.phone || null,
        subject: data.subject || 'General inquiry',
        message: data.message,
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Contact error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
