import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting automated platform database seeding...");

  await prisma.providerProfile.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("🧹 Existing database user registers cleared successfully.");

  const genericPassword = await bcrypt.hash("Password123", 12);

  const user1 = await prisma.user.create({
    data: {
      firstName: "Ramesh",
      lastName: "Shrestha",
      email: "ramesh@sewalink.com",
      phone: "9841111111",
      password: genericPassword,
      role: "PROVIDER",
    },
  });

  await prisma.providerProfile.create({
    data: {
      userId: user1.id,
      displayName: "Ramesh Plumbing & Maintenance",
      headline: "Master Plumber - 8+ Years Experience",
      bio: "Expert in repairing household water leaks, clearing pipeline blocks, and installing modern bathroom fixtures across Kathmandu valley.",
      city: "kathmandu",
      district: "Kathmandu",
      country: "Nepal",
      hourlyRate: 500,
      rating: 4.8,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      firstName: "Sita",
      lastName: "Thapa",
      email: "sita@sewalink.com",
      phone: "9842222222",
      password: genericPassword,
      role: "PROVIDER",
    },
  });

  await prisma.providerProfile.create({
    data: {
      userId: user2.id,
      displayName: "Sita Electrical Solutions",
      headline: "Professional Home Wiring & Appliance Expert",
      bio: "Specialized in structural house wiring, switchboard installations, short-circuit troubleshooting, and inverter backup setups.",
      city: "lalitpur",
      district: "Lalitpur",
      country: "Nepal",
      hourlyRate: 650,
      rating: 4.9,
    },
  });

  console.log("🏁 Database seeding completed. 2 professional profiles are live!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
