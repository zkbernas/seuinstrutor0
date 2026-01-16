// Script Node.js para criar usuário ADMIN
// Execute: node backend/create-admin.js

const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('🔐 Criando usuário ADMIN...\n');

    // Gerar hash da senha
    const password = 'Admin@123';
    const passwordHash = await bcrypt.hash(password, 10);

    // Criar usuário ADMIN
    const admin = await prisma.user.upsert({
      where: { email: 'admin@seuinstrutor.com' },
      update: {},
      create: {
        email: 'admin@seuinstrutor.com',
        password: passwordHash,
        name: 'Administrador do Sistema',
        role: 'ADMIN',
      },
    });

    console.log('✅ Usuário ADMIN criado com sucesso!');
    console.log('\n📧 Email: admin@seuinstrutor.com');
    console.log('🔑 Senha: Admin@123');
    console.log('\n⚠️  IMPORTANTE: Altere a senha após o primeiro login!\n');
    console.log('Dados do usuário:');
    console.log(admin);

  } catch (error) {
    console.error('❌ Erro ao criar admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
