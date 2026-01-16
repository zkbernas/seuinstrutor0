-- Script para criar usuário ADMIN no banco de dados existente
-- Execute este script no banco: SeuInstrutor_db

-- 1. Inserir usuário ADMIN
-- Senha: Admin@123 (hash bcrypt: $2b$10$YourHashHere)
-- IMPORTANTE: Você precisa gerar o hash da senha com bcrypt

INSERT INTO users (id, email, password, name, role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@seuinstrutor.com',
  '$2b$10$YQmXHLz6rXn5qK8YZ9mLkO.rvZqH3gCKXVXQJ6mBH8QQJ0zqV0kFu', -- Senha: Admin@123
  'Administrador do Sistema',
  'ADMIN',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Verifique se foi criado:
SELECT id, name, email, role FROM users WHERE role = 'ADMIN';
