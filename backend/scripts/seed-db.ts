import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    const projectData = [
      { color: "#444", name: "Other" }
    ];

    await prisma.project.createMany({ data: projectData });
    console.log("✅ Projects seeded successfully!");

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();

