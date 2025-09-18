import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function seedDatabase() {
	try {
		const project = await prisma.project.create({
			data: { color: "#444", name: "Other" },
		});
		console.log("✅ Projects seeded successfully!");

		const section = await prisma.section.create({
			data: {
				project_id: project.id,
				name: "Other",
			},
		});

		console.log("✅ Sections seeded successfully!");

		console.log("✅ Database seeded successfully!");
	} catch (error) {
		console.error("❌ Error seeding database:", error);
	} finally {
		await prisma.$disconnect();
	}
}

seedDatabase();
