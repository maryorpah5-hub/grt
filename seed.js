import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const username = 'admin';
  const password = 'password123';
  const passwordHash = await bcrypt.hash(password, 10);

  const existingAdmin = await prisma.admin.findUnique({ where: { username } });
  
  if (!existingAdmin) {
    await prisma.admin.create({
      data: { username, passwordHash },
    });
    console.log('Admin user created:');
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
  } else {
    console.log('Admin user already exists.');
  }

  // Create a sample tracking record
  const existingTracking = await prisma.trackingRecord.findUnique({ where: { trackingNumber: 'SLD-2024-88421' } });
  if (!existingTracking) {
    await prisma.trackingRecord.create({
      data: {
        trackingNumber: 'SLD-2024-88421',
        status: 'In Transit',
        origin: 'Lagos, Nigeria',
        destination: 'London, UK',
        progress: 67,
        eta: '2 days'
      }
    });
    console.log('Sample tracking record created.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
