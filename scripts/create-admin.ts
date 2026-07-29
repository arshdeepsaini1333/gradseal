// One-off bootstrap script for creating/updating an Admin account, since the
// admin panel has no self-service signup. Run with:
//   npx tsx scripts/create-admin.ts "Full Name" admin@example.com "password"
import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

async function main() {
  const [fullName, email, password] = process.argv.slice(2);
  if (!fullName || !email || !password) {
    console.error('Usage: npx tsx scripts/create-admin.ts "Full Name" admin@example.com "password"');
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.admin.upsert({
    where: { email: email.toLowerCase() },
    update: { fullName, password: hashedPassword, isActive: true },
    create: { fullName, email: email.toLowerCase(), password: hashedPassword },
    select: { id: true, email: true },
  });

  console.log(`Admin account ready: ${admin.email} (${admin.id})`);
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
