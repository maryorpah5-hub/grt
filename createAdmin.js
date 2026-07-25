import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

async function main() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const username = 'new_admin_user';
  const password = 'NewAdminPassword2026!';
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.admin.create({
    data: {
      username,
      passwordHash,
    },
  });

  console.log(`Admin created successfully.`);
  console.log(`Username: ${username}`);
  console.log(`Password: ${password}`);

  await prisma.$disconnect();
}

main().catch(console.error);
