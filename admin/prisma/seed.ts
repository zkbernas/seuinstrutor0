import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // 1. Criar Admin padrão
  const adminPassword = await bcrypt.hash('Admin#12345', 10);
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@local.dev' },
    update: {},
    create: {
      name: 'Admin Principal',
      email: 'admin@local.dev',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin criado:', admin.email);

  // 2. Criar Operator
  const operatorPassword = await bcrypt.hash('Operator#123', 10);
  const operator = await prisma.adminUser.upsert({
    where: { email: 'operator@local.dev' },
    update: {},
    create: {
      name: 'Operador Teste',
      email: 'operator@local.dev',
      passwordHash: operatorPassword,
      role: 'OPERATOR',
    },
  });
  console.log('✅ Operator criado:', operator.email);

  // 3. Criar Planos
  const planStarter = await prisma.plan.create({
    data: {
      name: 'Starter',
      priceCents: 19700, // R$ 197
      studentLimit: 50,
      featuresJson: {
        features: ['Até 50 alunos', 'Agenda básica', 'Relatórios mensais'],
      },
      isActive: true,
    },
  });

  const planPro = await prisma.plan.create({
    data: {
      name: 'Professional',
      priceCents: 49700, // R$ 497
      studentLimit: 200,
      featuresJson: {
        features: ['Até 200 alunos', 'Agenda avançada', 'Relatórios semanais', 'Suporte prioritário'],
      },
      isActive: true,
    },
  });

  const planScale = await prisma.plan.create({
    data: {
      name: 'Scale',
      priceCents: 99700, // R$ 997
      studentLimit: -1, // Ilimitado
      featuresJson: {
        features: ['Alunos ilimitados', 'API completa', 'White-label', 'Suporte dedicado'],
      },
      isActive: true,
    },
  });
  console.log('✅ Planos criados: Starter, Pro, Scale');

  // 4. Criar Instrutores fake
  const instructors = await Promise.all([
    prisma.instructor.create({
      data: {
        name: 'João Silva',
        email: 'joao@example.com',
        phone: '11987654321',
        documentNumber: '12345678901',
        city: 'São Paulo',
        state: 'SP',
        status: 'PENDING_REVIEW',
        currentPlanId: planStarter.id,
      },
    }),
    prisma.instructor.create({
      data: {
        name: 'Maria Santos',
        email: 'maria@example.com',
        phone: '21987654321',
        documentNumber: '98765432109',
        city: 'Rio de Janeiro',
        state: 'RJ',
        status: 'APPROVED',
        currentPlanId: planPro.id,
      },
    }),
    prisma.instructor.create({
      data: {
        name: 'Pedro Oliveira',
        email: 'pedro@example.com',
        phone: '85987654321',
        documentNumber: '11122233344',
        city: 'Fortaleza',
        state: 'CE',
        status: 'REJECTED',
      },
    }),
    prisma.instructor.create({
      data: {
        name: 'Ana Costa',
        email: 'ana@example.com',
        phone: '31987654321',
        documentNumber: '55566677788',
        city: 'Belo Horizonte',
        state: 'MG',
        status: 'APPROVED',
        currentPlanId: planScale.id,
      },
    }),
    prisma.instructor.create({
      data: {
        name: 'Carlos Mendes',
        email: 'carlos@example.com',
        phone: '47987654321',
        documentNumber: '99988877766',
        city: 'Florianópolis',
        state: 'SC',
        status: 'DRAFT',
      },
    }),
  ]);
  console.log(`✅ ${instructors.length} instrutores criados`);

  // 5. Criar Documentos pendentes
  await prisma.instructorDocument.create({
    data: {
      instructorId: instructors[0].id,
      type: 'CNH',
      fileName: 'cnh-joao.pdf',
      mimeType: 'application/pdf',
      size: 524288,
      storagePath: '/uploads/joao/cnh.pdf',
      reviewStatus: 'PENDING',
    },
  });

  await prisma.instructorDocument.create({
    data: {
      instructorId: instructors[0].id,
      type: 'CPF',
      fileName: 'cpf-joao.pdf',
      mimeType: 'application/pdf',
      size: 124288,
      storagePath: '/uploads/joao/cpf.pdf',
      reviewStatus: 'PENDING',
    },
  });
  console.log('✅ Documentos pendentes criados');

  // 6. Criar Assinaturas
  const subscriptions = await Promise.all([
    prisma.subscription.create({
      data: {
        instructorId: instructors[1].id,
        planId: planPro.id,
        status: 'ACTIVE',
        startedAt: new Date('2026-01-01'),
        nextBillingAt: new Date('2026-02-01'),
      },
    }),
    prisma.subscription.create({
      data: {
        instructorId: instructors[3].id,
        planId: planScale.id,
        status: 'ACTIVE',
        startedAt: new Date('2026-01-01'),
        nextBillingAt: new Date('2026-02-01'),
      },
    }),
  ]);
  console.log('✅ Assinaturas criadas');

  // 7. Criar Pagamentos
  await Promise.all([
    prisma.payment.create({
      data: {
        instructorId: instructors[1].id,
        subscriptionId: subscriptions[0].id,
        amountCents: planPro.priceCents,
        method: 'PIX',
        status: 'PAID',
        paidAt: new Date('2026-01-05'),
      },
    }),
    prisma.payment.create({
      data: {
        instructorId: instructors[3].id,
        subscriptionId: subscriptions[1].id,
        amountCents: planScale.priceCents,
        method: 'CARD',
        status: 'PAID',
        paidAt: new Date('2026-01-03'),
      },
    }),
    prisma.payment.create({
      data: {
        instructorId: instructors[1].id,
        amountCents: planPro.priceCents,
        method: 'PIX',
        status: 'PENDING',
      },
    }),
  ]);
  console.log('✅ Pagamentos criados');

  // 8. Criar Audit Logs
  await Promise.all([
    prisma.auditLog.create({
      data: {
        actorAdminId: admin.id,
        action: 'CREATE_INSTRUCTOR',
        entityType: 'INSTRUCTOR',
        entityId: instructors[0].id,
        metadataJson: { name: instructors[0].name },
      },
    }),
    prisma.auditLog.create({
      data: {
        actorAdminId: admin.id,
        action: 'APPROVE_INSTRUCTOR',
        entityType: 'INSTRUCTOR',
        entityId: instructors[1].id,
        metadataJson: { name: instructors[1].name },
      },
    }),
  ]);
  console.log('✅ Audit logs criados');

  console.log('\n🎉 Seed concluído com sucesso!');
  console.log('\n📝 Credenciais:');
  console.log('Admin: admin@local.dev / Admin#12345');
  console.log('Operator: operator@local.dev / Operator#123');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
