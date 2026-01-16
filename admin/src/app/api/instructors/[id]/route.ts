import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit';

// GET /api/instructors/:id
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const instructor = await prisma.instructor.findUnique({
    where: { id: params.id },
    include: {
      currentPlan: true,
      documents: {
        orderBy: { uploadedAt: 'desc' },
      },
      subscriptions: {
        include: {
          plan: true,
        },
        orderBy: { startedAt: 'desc' },
      },
      payments: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });

  if (!instructor) {
    return NextResponse.json(
      { error: 'Instrutor não encontrado' },
      { status: 404 }
    );
  }

  return NextResponse.json({ instructor });
}

// PATCH /api/instructors/:id
const updateSchema = z.object({
  name: z.string().min(3).optional(),
  phone: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  currentPlanId: z.string().nullable().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = updateSchema.parse(body);

    const instructor = await prisma.instructor.update({
      where: { id: params.id },
      data,
      include: {
        currentPlan: true,
      },
    });

    await createAuditLog({
      actorAdminId: session.adminId,
      action: 'UPDATE_INSTRUCTOR',
      entityType: 'INSTRUCTOR',
      entityId: instructor.id,
      metadata: data,
    });

    return NextResponse.json({ instructor });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Update instructor error:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar instrutor' },
      { status: 500 }
    );
  }
}
