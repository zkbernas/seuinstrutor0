/**
 * Script para criar um usuário ADMIN
 * 
 * Uso:
 *   node scripts/create-admin.js
 * 
 * Ou diretamente com prompt:
 *   node scripts/create-admin.js admin@exemplo.com "Admin" "senha123"
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const readline = require('readline');

const prisma = new PrismaClient();

// Interface para input do usuário
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createAdmin(email, name, password) {
  try {
    // Verificar se já existe
    const existing = await prisma.user.findUnique({
      where: { email }
    });

    if (existing) {
      console.log(`\n⚠️  Usuário com email "${email}" já existe!`);
      
      const update = await question('Deseja atualizar para ADMIN? (s/n): ');
      
      if (update.toLowerCase() === 's' || update.toLowerCase() === 'sim') {
        const updated = await prisma.user.update({
          where: { email },
          data: { role: 'ADMIN' }
        });
        
        console.log('\n✅ Usuário atualizado para ADMIN com sucesso!');
        console.log(`   Email: ${updated.email}`);
        console.log(`   Nome: ${updated.name}`);
        console.log(`   Role: ${updated.role}`);
        return updated;
      } else {
        console.log('\n❌ Operação cancelada.');
        return null;
      }
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(password, 10);

    // Criar novo usuário ADMIN
    const admin = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: 'ADMIN'
      }
    });

    console.log('\n✅ Usuário ADMIN criado com sucesso!');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Nome: ${admin.name}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   ID: ${admin.id}`);
    
    return admin;

  } catch (error) {
    console.error('\n❌ Erro ao criar usuário ADMIN:', error.message);
    throw error;
  }
}

async function main() {
  console.log('🔐 Criar Usuário ADMIN\n');

  // Pegar argumentos da linha de comando
  const args = process.argv.slice(2);
  
  let email, name, password;

  if (args.length >= 3) {
    [email, name, password] = args;
  } else {
    // Pedir input do usuário
    email = await question('Email: ');
    name = await question('Nome: ');
    password = await question('Senha: ');
  }

  // Validar inputs
  if (!email || !name || !password) {
    console.error('\n❌ Todos os campos são obrigatórios!');
    process.exit(1);
  }

  if (password.length < 6) {
    console.error('\n❌ A senha deve ter no mínimo 6 caracteres!');
    process.exit(1);
  }

  await createAdmin(email, name, password);
}

// Executar
main()
  .catch(console.error)
  .finally(async () => {
    rl.close();
    await prisma.$disconnect();
    process.exit(0);
  });
