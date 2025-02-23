import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Créer l'admin
  await prisma.user.upsert({
    where: { email: 'benjamin.benoit21@hotmail.fr' },
    update: {},
    create: {
      email: 'benjamin.benoit21@hotmail.fr',
      password: await bcrypt.hash('votre_mdp', 10),
      role: 'ADMIN',
      name: 'Benjamin'
    },
  });

  // Créer un utilisateur test
  await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'USER',
      name: 'Test User'
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });