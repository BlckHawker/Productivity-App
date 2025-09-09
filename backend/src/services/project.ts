/**
 * Project service layer.
 * Provides database access methods for Project entities using Prisma.
 */

import { PrismaClient, Project } from "../../generated/prisma";

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
const createProject = (prisma: PrismaClient) => async (name: string, color: string): Promise<Project> => {
	const project = await prisma.project.create({
		data: {
			name,
			color
		},
	});
	return project;
};

/**
 * Counts the total number of projects in the database.
 *
 * @param prisma - The Prisma client instance.
 * @returns A promise resolving to the number of projects.
 */
const getProjectCount = async (prisma: PrismaClient): Promise<number> =>  {
	return await prisma.project.count();
};

/**
 * Finds the first project by name (case-insensitive).
 *
 * @param prisma - The Prisma client instance.
 * @returns A function that accepts a `name` string and resolves to a Project or null.
 */
const getProjectByName = (prisma: PrismaClient) => async(name: string): Promise<Project | null> => {
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
const getProjectById = (prisma: PrismaClient)  => async (id: number): Promise<Project | Error | null> => {
	const project = await prisma.project.findFirst({
		where: {
			id: {
				equals: id,
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
	getAllProjects
};