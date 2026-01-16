const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAuth() {
  try {
    console.log('=== VERIFICAÇÃO DE AUTENTICAÇÃO ===\n');

    // 1. Verificar usuários
    console.log('1. Usuários no banco:');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    if (users.length === 0) {
      console.log('❌ Nenhum usuário encontrado!');
      console.log('💡 Execute: node create-admin.js');
      return;
    }

    users.forEach(user => {
      console.log(`✅ ${user.email} - ${user.role}`);
    });

    // 2. Verificar se há admin
    const admin = users.find(u => u.role === 'ADMIN');
    if (!admin) {
      console.log('\n❌ Nenhum usuário ADMIN encontrado!');
      console.log('💡 Execute: node create-admin.js');
      return;
    }

    console.log(`\n✅ Admin encontrado: ${admin.email}`);
    console.log('💡 Teste o login com essas credenciais no frontend');
    console.log('💡 Email: admin@seuinstrutor.com');
    console.log('💡 Senha: admin123');

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkAuth();