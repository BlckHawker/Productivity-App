import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function clearDatabase() {
  try {
    // Adjust order if foreign keys exist (delete children first)
    await prisma.task.deleteMany({});
    console.log("✅ Database cleared!");
  } catch (error) {
    console.error("❌ Error clearing database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase();
