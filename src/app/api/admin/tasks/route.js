import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin, requireStaff } from '@/lib/admin';
import { logActivity } from '@/lib/activity';

const STATUSES = new Set(['PENDING', 'IN_PROGRESS', 'COMPLETED']);
const PRIORITIES = new Set(['LOW', 'MEDIUM', 'HIGH']);

async function resolveProject(body) {
  const projectId = body.projectId || null;
  if (!projectId) {
    return { projectId: null, projectName: body.projectName?.trim() || null };
  }
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return { error: 'Project not found' };
  return { projectId: project.id, projectName: project.title };
}

export async function GET() {
  const { session, error } = await requireStaff();
  if (error) return error;

  const where =
    session.user.role === 'EMPLOYEE' ? { assigneeId: session.user.id } : {};

  const tasks = await prisma.task.findMany({
    where,
    include: {
      assignee: { select: { id: true, name: true, email: true } },
      project: { select: { id: true, title: true, slug: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(tasks);
}

export async function POST(req) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await req.json();
    const title = body.title?.trim();
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const priority = PRIORITIES.has(body.priority) ? body.priority : 'MEDIUM';
    const status = STATUSES.has(body.status) ? body.status : 'PENDING';
    const assigneeId = body.assigneeId || null;

    if (assigneeId) {
      const user = await prisma.user.findFirst({
        where: { id: assigneeId, role: 'EMPLOYEE' },
      });
      if (!user) {
        return NextResponse.json({ error: 'Assignee not found' }, { status: 400 });
      }
    }

    const linked = await resolveProject(body);
    if (linked.error) {
      return NextResponse.json({ error: linked.error }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: body.description?.trim() || null,
        priority,
        status,
        assigneeId,
        projectId: linked.projectId,
        projectName: linked.projectName,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
      },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        project: { select: { id: true, title: true, slug: true } },
      },
    });

    await logActivity({
      session,
      action: 'CREATE',
      entity: 'task',
      entityId: task.id,
      summary: `Assigned task “${task.title}”`,
    });

    return NextResponse.json(task, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Failed to create task' }, { status: 500 });
  }
}

export async function PATCH(req) {
  const { session, error } = await requireStaff();
  if (error) return error;

  try {
    const body = await req.json();
    const id = body.id;
    if (!id) {
      return NextResponse.json({ error: 'Task id is required' }, { status: 400 });
    }

    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const isAdmin = session.user.role === 'ADMIN';
    const isOwner = existing.assigneeId === session.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!isAdmin) {
      if (!STATUSES.has(body.status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      const task = await prisma.task.update({
        where: { id },
        data: { status: body.status },
        include: {
          assignee: { select: { id: true, name: true, email: true } },
          project: { select: { id: true, title: true, slug: true } },
        },
      });
      await logActivity({
        session,
        action: 'STATUS',
        entity: 'task',
        entityId: task.id,
        summary: `Marked task “${task.title}” as ${task.status}`,
      });
      return NextResponse.json(task);
    }

    const data = {};
    if (body.title !== undefined) {
      const title = String(body.title).trim();
      if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
      data.title = title;
    }
    if (body.description !== undefined) data.description = body.description?.trim() || null;
    if (body.priority !== undefined) {
      if (!PRIORITIES.has(body.priority)) {
        return NextResponse.json({ error: 'Invalid priority' }, { status: 400 });
      }
      data.priority = body.priority;
    }
    if (body.status !== undefined) {
      if (!STATUSES.has(body.status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      data.status = body.status;
    }
    if (body.dueDate !== undefined) {
      data.dueDate = body.dueDate ? new Date(body.dueDate) : null;
    }
    if (body.assigneeId !== undefined) {
      const assigneeId = body.assigneeId || null;
      if (assigneeId) {
        const user = await prisma.user.findFirst({
          where: { id: assigneeId, role: 'EMPLOYEE' },
        });
        if (!user) {
          return NextResponse.json({ error: 'Assignee not found' }, { status: 400 });
        }
      }
      data.assigneeId = assigneeId;
    }
    if (body.projectId !== undefined || body.projectName !== undefined) {
      const linked = await resolveProject(body);
      if (linked.error) {
        return NextResponse.json({ error: linked.error }, { status: 400 });
      }
      data.projectId = linked.projectId;
      data.projectName = linked.projectName;
    }

    const task = await prisma.task.update({
      where: { id },
      data,
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        project: { select: { id: true, title: true, slug: true } },
      },
    });

    await logActivity({
      session,
      action: 'UPDATE',
      entity: 'task',
      entityId: task.id,
      summary: `Updated task “${task.title}”`,
    });

    return NextResponse.json(task);
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const id = new URL(req.url).searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Task id is required' }, { status: 400 });
  }

  try {
    const existing = await prisma.task.findUnique({ where: { id } });
    await prisma.task.delete({ where: { id } });
    await logActivity({
      session,
      action: 'DELETE',
      entity: 'task',
      entityId: id,
      summary: `Deleted task “${existing?.title || id}”`,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }
}
