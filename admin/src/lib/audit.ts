import { prisma } from './prisma';

export async function createAuditLog(params: {
  actorAdminId: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, any>;
}) {
  return prisma.auditLog.create({
    data: {
      actorAdminId: params.actorAdminId,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      metadataJson: params.metadata || {},
    },
  });
}
