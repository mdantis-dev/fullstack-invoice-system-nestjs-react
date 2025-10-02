import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86_400_000);

async function main() {
  const password = await bcrypt.hash("Passw0rd!", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@altametrics.test" },
    update: {},
    create: { email: "demo@altametrics.test", name: "Demo User", password },
  });

  const now = new Date();
  const data = [
    {
      vendor_name: "ACM Supplies",
      amount: new Prisma.Decimal("199.99"),
      due_date: now,
      description: "Office chairs",
      paid: false,
      user_id: user.id,
    },
    {
      vendor_name: "Globex",
      amount: new Prisma.Decimal("1250"),
      due_date: addDays(now, 7),
      description: "Monitors",
      paid: true,
      user_id: user.id,
    },
    {
      vendor_name: "Stark Industries",
      amount: new Prisma.Decimal("3499.50"),
      due_date: addDays(now, 8),
      description: "Dev workstations",
      paid: false,
      user_id: user.id,
    },
    {
      vendor_name: "Wayne Logistics",
      amount: new Prisma.Decimal("799.00"),
      due_date: addDays(now, 20),
      description: "Express shipping",
      paid: false,
      user_id: user.id,
    },
    {
      vendor_name: "Initech",
      amount: new Prisma.Decimal("420.75"),
      due_date: addDays(now, 30),
      description: "Printer toner & paper",
      paid: true,
      user_id: user.id,
    },
    {
      vendor_name: "Umbrella Corp",
      amount: new Prisma.Decimal("128.00"),
      due_date: addDays(now, 36),
      description: "Office cleaning",
      paid: false,
      user_id: user.id,
    },
    {
      vendor_name: "Wonka Industries",
      amount: new Prisma.Decimal("560.40"),
      due_date: addDays(now, 36),
      description: "Snack bar refill",
      paid: false,
      user_id: user.id,
    },
    {
      vendor_name: "Cyberdyne Systems",
      amount: new Prisma.Decimal("22000"),
      due_date: addDays(now, 43),
      description: "Server rack upgrade",
      paid: false,
      user_id: user.id,
    },
    {
      vendor_name: "Soylent Foods",
      amount: new Prisma.Decimal("310.25"),
      due_date: addDays(now, 52),
      description: "Team lunch (overdue)",
      paid: false,
      user_id: user.id,
    },
    {
      vendor_name: "Tyrell Corp",
      amount: new Prisma.Decimal("9999.99"),
      due_date: addDays(now, 56),
      description: "Workstation GPUs",
      paid: true,
      user_id: user.id,
    },
    {
      vendor_name: "ACME Cloud",
      amount: new Prisma.Decimal("89.00"),
      due_date: addDays(now, 58),
      description: "SaaS monthly",
      paid: true,
      user_id: user.id,
    },
    {
      vendor_name: "Hooli",
      amount: new Prisma.Decimal("1530.00"),
      due_date: addDays(now, 63),
      description: "Conference tickets",
      paid: false,
      user_id: user.id,
    },
  ];

  const res = await prisma.invoice.createMany({ data, skipDuplicates: true });
  console.log(`Seeded user ${user.email} and ${res.count} invoices`);
}

// Proper promise handling – no floating promises, no misused promises
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
