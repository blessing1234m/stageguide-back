import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const adminEmail = (process.env.ADMIN_EMAIL ?? 'admin@stageguide.com').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'Admin1234';
  const adminPrenom = process.env.ADMIN_PRENOM ?? process.env.ADMIN_FIRST_NAME ?? 'Super';
  const adminNom = process.env.ADMIN_NOM ?? process.env.ADMIN_LAST_NAME ?? 'Admin';

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      prenom: adminPrenom,
      nom: adminNom,
      role: UserRole.ADMIN,
      isActive: true,
      consentGiven: true,
      consentDate: new Date(),
    },
    create: {
      email: adminEmail,
      passwordHash,
      prenom: adminPrenom,
      nom: adminNom,
      role: UserRole.ADMIN,
      isActive: true,
      consentGiven: true,
      consentDate: new Date(),
    },
  });

  console.log(`Admin seed complete for ${adminEmail}`);
}

main()
  .catch((error: unknown) => {
    console.error('Admin seed failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
