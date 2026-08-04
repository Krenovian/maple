import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';

export async function GET(req) {
  const { error } = await requireAdmin();
  if (error) return error;

  const limit = Math.min(100, Number(new URL(req.url).searchParams.get('limit')) || 50);
  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
  return NextResponse.json(logs);
}
