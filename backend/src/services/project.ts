/**
 * Project service layer.
 * Provides database access methods for Project entities using Prisma.
 */

import { PrismaClient, Project, Section } from "../../generated/prisma";

const deleteProjectById =
	(prisma: PrismaClient) =>
	async (id: number): Promise<Project> => {
		return prisma.project.delete({
			where: {
				id
			}
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
 * Creates a new project and automatically creates an "Other" section for it.
 *
 * @param prisma - The Prisma client instance.
 * @returns A function that accepts project `name` and `color` and returns a tuple of the created Project and Section.
 */
const createProject =
	(prisma: PrismaClient) =>
	async (name: string, color: string): Promise<[Project, Section]> => {
		return await prisma.$transaction(async (transaction) => {
			//create the Project
			const project = await transaction.project.create({
				data: {
					name,
					color,
				},
			});

			//crate the Other Section corresponding to the Project
			const section = await transaction.section.create({
				data: {
					name: "Other",
					is_other: true,
					project_id: project.id,
				},
			});

			return [project, section];
		});
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
