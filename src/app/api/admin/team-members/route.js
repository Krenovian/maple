import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireStaff } from '@/lib/admin';
import { logActivity } from '@/lib/activity';
import {
  collectEntityImageUrls,
  collectRemovedUploadUrls,
  deleteUploadUrls,
} from '@/lib/uploadAssets';

function memberPayload(body) {
  return {
    name: body.name?.trim(),
    role: body.role?.trim(),
    bio: body.bio?.trim() || null,
    image: body.image || null,
    imageAlt: body.imageAlt?.trim() || null,
    sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
    featured: Boolean(body.featured),
  };
}

export async function GET() {
  const { error } = await requireStaff();
  if (error) return error;

  const members = await prisma.teamMember.findMany({
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  });
  return NextResponse.json(members);
}

export async function POST(req) {
  const { session, error } = await requireStaff();
  if (error) return error;

  try {
    const body = await req.json();
    const data = memberPayload(body);
    if (!data.name || !data.role) {
      return NextResponse.json({ error: 'Name and role are required' }, { status: 400 });
    }

    const member = await prisma.teamMember.create({ data });

    await logActivity({
      session,
      action: 'CREATE',
      entity: 'teamMember',
      entityId: member.id,
      summary: `Added team member “${member.name}”`,
    });

    return NextResponse.json(member, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 });
  }
}

export async function PUT(req) {
  const { session, error } = await requireStaff();
  if (error) return error;

  try {
    const body = await req.json();
    if (!body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const existing = await prisma.teamMember.findUnique({ where: { id: body.id } });
    if (!existing) return NextResponse.json({ error: 'Team member not found' }, { status: 404 });

    const data = memberPayload(body);
    const beforeUrls = collectEntityImageUrls(existing);
    const afterUrls = collectEntityImageUrls({ image: data.image });
    const removedUrls = collectRemovedUploadUrls(beforeUrls, afterUrls);

    const member = await prisma.teamMember.update({
      where: { id: body.id },
      data,
    });

    if (removedUrls.length) {
      await deleteUploadUrls(removedUrls);
    }

    await logActivity({
      session,
      action: 'UPDATE',
      entity: 'teamMember',
      entityId: member.id,
      summary: `Updated team member “${member.name}”`,
    });

    return NextResponse.json(member);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const { session, error } = await requireStaff();
  if (error) return error;

  try {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const existing = await prisma.teamMember.findUnique({ where: { id } });
    await prisma.teamMember.delete({ where: { id } });

    if (existing) {
      await deleteUploadUrls(collectEntityImageUrls(existing));
    }

    await logActivity({
      session,
      action: 'DELETE',
      entity: 'teamMember',
      entityId: id,
      summary: `Removed team member “${existing?.name || id}”`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete team member' }, { status: 500 });
  }
}
