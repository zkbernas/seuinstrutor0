import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // 1. Criar ADMIN
  const adminPassword = await bcrypt.hash('Admin#12345', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@local.dev' },
    update: {},
    create: {
      email: 'admin@local.dev',
      name: 'Administrador Principal',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin criado:', admin.email);

  // 2. Criar 2 STUDENTS (sem solicitação de verificação)
  const student1Password = await bcrypt.hash('student123', 10);
  const student1 = await prisma.user.upsert({
    where: { email: 'student1@email.com' },
    update: {},
    create: {
      email: 'student1@email.com',
      name: 'João Silva',
      password: student1Password,
      role: 'STUDENT',
      studentProfile: {
        create: {
          cpf: '12345678901',
          phone: '(11) 98765-4321',
        },
      },
    },
  });
  console.log('✅ Student 1 criado:', student1.email);

  const student2Password = await bcrypt.hash('student123', 10);
  const student2 = await prisma.user.upsert({
    where: { email: 'student2@email.com' },
    update: {},
    create: {
      email: 'student2@email.com',
      name: 'Maria Santos',
      password: student2Password,
      role: 'STUDENT',
      studentProfile: {
        create: {
          cpf: '12345678902',
          phone: '(11) 98765-4322',
        },
      },
    },
  });
  console.log('✅ Student 2 criado:', student2.email);

  // 3. Criar 2 INSTRUCTOR APPROVED (role INSTRUCTOR + verificationStatus APPROVED)
  const instructor1Password = await bcrypt.hash('instructor123', 10);
  const instructor1User = await prisma.user.upsert({
    where: { email: 'instructor1@email.com' },
    update: {},
    create: {
      email: 'instructor1@email.com',
      name: 'Carlos Mendes',
      password: instructor1Password,
      role: 'INSTRUCTOR',
      instructorProfile: {
        create: {
          cpf: '98765432101',
          credentialNumber: 'CRED-001',
          phone: '(11) 91234-5678',
          pricePerHour: 80.00,
          categories: ['A', 'B'],
          bio: 'Instrutor experiente com mais de 10 anos de experiência',
          address: 'Rua das Flores, 123 - São Paulo, SP',
          latitude: -23.5505,
          longitude: -46.6333,
          verificationStatus: 'APPROVED',
        },
      },
    },
  });
  console.log('✅ Instructor 1 (APPROVED) criado:', instructor1User.email);

  const instructor2Password = await bcrypt.hash('instructor123', 10);
  const instructor2User = await prisma.user.upsert({
    where: { email: 'instructor2@email.com' },
    update: {},
    create: {
      email: 'instructor2@email.com',
      name: 'Ana Costa',
      password: instructor2Password,
      role: 'INSTRUCTOR',
      instructorProfile: {
        create: {
          cpf: '98765432102',
          credentialNumber: 'CRED-002',
          phone: '(11) 91234-5679',
          pricePerHour: 90.00,
          categories: ['A'],
          bio: 'Especialista em aulas práticas',
          address: 'Av. Paulista, 1000 - São Paulo, SP',
          latitude: -23.5614,
          longitude: -46.6565,
          verificationStatus: 'APPROVED',
        },
      },
    },
  });
  console.log('✅ Instructor 2 (APPROVED) criado:', instructor2User.email);

  // 4. Criar 2 PENDING (role STUDENT + instructorProfile PENDING)
  const pending1Password = await bcrypt.hash('pending123', 10);
  const pending1User = await prisma.user.upsert({
    where: { email: 'pending1@email.com' },
    update: {},
    create: {
      email: 'pending1@email.com',
      name: 'Pedro Oliveira',
      password: pending1Password,
      role: 'STUDENT',
      studentProfile: {
        create: {
          cpf: '11122233344',
          phone: '(11) 91111-1111',
        },
      },
      instructorProfile: {
        create: {
          cpf: '11122233344',
          credentialNumber: 'CRED-PENDING-001',
          phone: '(11) 91111-1111',
          pricePerHour: 75.00,
          categories: ['B'],
          bio: 'Aguardando aprovação',
          verificationStatus: 'PENDING',
        },
      },
    },
  });
  console.log('✅ Instructor PENDING 1 criado:', pending1User.email);

  const pending2Password = await bcrypt.hash('pending123', 10);
  const pending2User = await prisma.user.upsert({
    where: { email: 'pending2@email.com' },
    update: {},
    create: {
      email: 'pending2@email.com',
      name: 'Fernanda Lima',
      password: pending2Password,
      role: 'STUDENT',
      studentProfile: {
        create: {
          cpf: '22233344455',
          phone: '(11) 92222-2222',
        },
      },
      instructorProfile: {
        create: {
          cpf: '22233344455',
          credentialNumber: 'CRED-PENDING-002',
          phone: '(11) 92222-2222',
          pricePerHour: 85.00,
          categories: ['A', 'B'],
          bio: 'Aguardando análise',
          verificationStatus: 'PENDING',
        },
      },
    },
  });
  console.log('✅ Instructor PENDING 2 criado:', pending2User.email);

  // 5. Criar 1 REJECTED (role STUDENT + instructorProfile REJECTED + reason/notes)
  const rejectedPassword = await bcrypt.hash('rejected123', 10);
  const rejectedUser = await prisma.user.upsert({
    where: { email: 'rejected@email.com' },
    update: {},
    create: {
      email: 'rejected@email.com',
      name: 'Roberto Alves',
      password: rejectedPassword,
      role: 'STUDENT',
      studentProfile: {
        create: {
          cpf: '33344455566',
          phone: '(11) 93333-3333',
        },
      },
      instructorProfile: {
        create: {
          cpf: '33344455566',
          credentialNumber: 'CRED-REJECTED-001',
          phone: '(11) 93333-3333',
          pricePerHour: 70.00,
          categories: ['A'],
          bio: 'Documentos reprovados',
          verificationStatus: 'REJECTED',
          rejectionReason: 'Documentos ilegíveis',
          rejectionNotes: 'A CNH enviada está ilegível. Por favor, reenvie uma cópia de melhor qualidade.',
        },
      },
    },
  });
  console.log('✅ Instructor REJECTED criado:', rejectedUser.email);

  console.log('\n🎉 Seed concluído com sucesso!');
  console.log('\n📋 Credenciais de teste:');
  console.log('ADMIN: admin@local.dev / Admin#12345');
  console.log('STUDENT 1: student1@email.com / student123');
  console.log('STUDENT 2: student2@email.com / student123');
  console.log('INSTRUCTOR 1 (APPROVED): instructor1@email.com / instructor123');
  console.log('INSTRUCTOR 2 (APPROVED): instructor2@email.com / instructor123');
  console.log('PENDING 1: pending1@email.com / pending123');
  console.log('PENDING 2: pending2@email.com / pending123');
  console.log('REJECTED: rejected@email.com / rejected123');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
