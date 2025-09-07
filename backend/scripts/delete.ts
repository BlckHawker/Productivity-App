import { PrismaClient } from "../generated/prisma";
import { MAX_PROJECTS } from "../src/controllers/project"

const prisma = new PrismaClient();

async function seedDatabase() {

    interface ProjectData {
        color: string,
        name: string
    }
    
  try {
    const projectData: ProjectData[] = [];

    for(let i = 0; i < MAX_PROJECTS; i++) {
        projectData.push({color: "#f00", name: String(i)} as ProjectData)
    }

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

