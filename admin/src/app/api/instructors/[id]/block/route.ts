import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const instructor = await prisma.instructor.update({
    where: { id: params.id },
    data: { status: 'BLOCKED' },
  });

  await createAuditLog({
    actorAdminId: session.adminId,
    action: 'BLOCK_INSTRUCTOR',
    entityType: 'INSTRUCTOR',
    entityId: instructor.id,
    metadata: { name: instructor.name },
  });

  return NextResponse.json({ instructor });
}
