import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    const data = [
      { name: "Buy groceries", complete: false },
      { name: "Finish project report", complete: false },
      { name: "Read 30 pages of a book", complete: false },
      { name: "Exercise for 30 minutes", complete: false },
    ];

    await prisma.task.createMany({ data });

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}


seedDatabase();

