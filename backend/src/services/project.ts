/**
 * Project service layer.
 * Provides database access methods for Project entities using Prisma.
 */

import { PrismaClient, Project } from "../../generated/prisma";

/**
 * Deletes a project by its unique ID, along with all sections belonging to it.
 *
 * This operation is executed within a transaction:
 * - All sections associated with the project are deleted first.
 * - The project is deleted afterward.
 * - If any step fails, the entire transaction is rolled back.
 *
 * @param prisma - The Prisma client instance.
 * @returns A function that accepts a `projectId` and resolves to the deleted `Project`.
 *   Throws an error if the project does not exist or if deletion fails.
 */

const deleteProjectById =
	(prisma: PrismaClient) =>
	async (id: number): Promise<Project> => {
		return prisma.$transaction(async (transaction) => {
			//delete all section in the project
			await transaction.section.deleteMany({
				where: { project_id: id }
			});

			//delete the project
			return transaction.project.delete({
				where: {
					id
				}
			});
		});
	};


/**
 * Updates a project's name based on its ID.
 *
 * @param prisma - The Prisma client instance.
 * @param id - The unique ID of the project to update.
 * @param name - The new name of the project
 * @returns A promise resolving to the updated Project object.
 */
const updateProjectName =
	(prisma: PrismaClient) =>
	async (
		id: number,
		name: string
	): Promise<Project> => {
		return prisma.project.update({
			where: { id },
			data: {
				name
			}
		});
	};

/**
 * Updates a project's color based on its ID.
 *
 * @param prisma - The Prisma client instance.
 * @param id - The unique ID of the project to update.
 * @param color - The new color of the project
 * @returns A promise resolving to the updated Project object.
 */
	const updateProjectColor =
	(prisma: PrismaClient) =>
	async (
		id: number,
		color: string
	): Promise<Project> => {
		return prisma.project.update({
			where: { id },
			data: {
				color
			}
		});
	};

/**
 * Retrieves all projects from the database.
 *
 * @param prisma - The Prisma client instance.
 * @returns A promise resolving to an array of Project objects.
 */
const getAllProjects = async (prisma: PrismaClient): Promise<Project[]> => {
	const projects = await prisma.project.findMany({});
	return projects;
};

/**
 * Creates a new project with the given name and color.
 *
 * @param prisma - The Prisma client instance.
 * @returns A function that accepts project `name` and `color` and returns the created Project.
 */
const createProject =
	(prisma: PrismaClient) =>
	async (name: string, color: string): Promise<Project> => {
		const project = await prisma.project.create({
			data: {
				name,
				color
			}
		});
		return project;
	};

/**
 * Counts the total number of projects in the database.
 *
 * @param prisma - The Prisma client instance.
 * @returns A promise resolving to the number of projects.
 */
const getProjectCount = async (prisma: PrismaClient): Promise<number> => {
	return await prisma.project.count();
};

/**
 * Finds the first project by name (case-insensitive).
 *
 * @param prisma - The Prisma client instance.
 * @returns A function that accepts a `name` string and resolves to a Project or null.
 */
const getProjectByName =
	(prisma: PrismaClient) =>
	async (name: string): Promise<Project | null> => {
		const project = await prisma.project.findFirst({
			where: {
				name: {
					equals: name,
					mode: "insensitive"
				}
			}
		});
		return project;
	};

/**
 * Finds the first project by its unique ID.
 *
 * @param prisma - The Prisma client instance.
 * @returns A function that accepts a numeric project `id` and resolves to a Project, null, or Error.
 */
const getProjectById =
	(prisma: PrismaClient) =>
	async (id: number): Promise<Project | Error | null> => {
		const project = await prisma.project.findFirst({
			where: {
				id: {
					equals: id
				}
			}
		});

		return project;
	};

export {
	createProject,
	getProjectByName,
	getProjectCount,
	getProjectById,
	getAllProjects,
	updateProjectName,
	updateProjectColor,
	deleteProjectById
};
