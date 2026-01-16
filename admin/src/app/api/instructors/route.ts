import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit';

// GET /api/instructors - List with filters
export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const planId = searchParams.get('planId');
  const q = searchParams.get('q');
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');

  const where: any = {};

  if (status) where.status = status;
  if (planId) where.currentPlanId = planId;
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
      { documentNumber: { contains: q } },
    ];
  }

  const [instructors, total] = await Promise.all([
    prisma.instructor.findMany({
      where,
      include: {
        currentPlan: true,
        _count: {
          select: { documents: true },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.instructor.count({ where }),
  ]);

  return NextResponse.json({
    instructors,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}

// POST /api/instructors - Create instructor
const createSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  phone: z.string(),
  documentNumber: z.string(),
  city: z.string().optional(),
  state: z.string().optional(),
  planId: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = createSchema.parse(body);

    const instructor = await prisma.instructor.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        documentNumber: data.documentNumber,
        city: data.city,
        state: data.state,
        currentPlanId: data.planId,
        status: 'DRAFT',
      },
      include: {
        currentPlan: true,
      },
    });

    await createAuditLog({
      actorAdminId: session.adminId,
      action: 'CREATE_INSTRUCTOR',
      entityType: 'INSTRUCTOR',
      entityId: instructor.id,
      metadata: { name: instructor.name, email: instructor.email },
    });

    return NextResponse.json({ instructor }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Create instructor error:', error);
    return NextResponse.json(
      { error: 'Erro ao criar instrutor' },
      { status: 500 }
    );
  }
}
