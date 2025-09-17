import { PrismaClient } from "../generated/prisma";
import { MAX_SECTIONS } from "../src/controllers/section"

const prisma = new PrismaClient();

async function seedDatabase() {
    interface SectionData {
        project_id: number,
        name: string
    }

  try {
    const sectionData: SectionData[] = [];

    const project = await prisma.project.create({
			data: { color: "#444", name: "Other" },
		});

    console.log("✅ Projects seeded successfully!");


    for(let i = 0; i < MAX_SECTIONS; i++) {
        sectionData.push({project_id: project.id, name: String(i)} as SectionData)
    }
    await prisma.section.createMany({ data: sectionData });
		console.log("✅ Sections seeded successfully!");

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();