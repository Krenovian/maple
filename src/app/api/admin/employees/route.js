import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const employees = await prisma.user.findMany({
    where: { role: 'EMPLOYEE' },
    include: { _count: { select: { tasks: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(
    employees.map(({ password, ...rest }) => rest)
  );
}

export async function POST(req) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await req.json();
    if (!body.name || !body.email || !body.password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const exists = await prisma.user.findUnique({ where: { email: body.email } });
    if (exists) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    const password = await bcrypt.hash(body.password, 10);
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password,
        role: 'EMPLOYEE',
      },
    });

    const { password: _, ...safe } = user;
    return NextResponse.json(safe, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    await prisma.task.updateMany({ where: { assigneeId: id }, data: { assigneeId: null } });
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to remove employee' }, { status: 500 });
  }
}
