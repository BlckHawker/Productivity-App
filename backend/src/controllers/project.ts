// todo add file header comment
import { PrismaClient, Project } from "../../generated/prisma";
import * as projectServices from "../services/project";

const MAX_PROJECTS = 100;

/**
 * Get all projects
 *
 * @param prisma - The PrismaClient instance used to access the database.
 * @returns All projects within the database or an error if there was a problem getting them
 */
const getAllProjects = async (prisma: PrismaClient): Promise<Project[] | Error> => {
	try {
		const projects = await projectServices.getAllProjects(prisma);
		return projects;
	}

	catch (err) {
		return err as Error;
	}
};


/**
 * Get a project in the database by its id
 *
 * @param prisma - The PrismaClient instance used to access the database.
 * @returns An asynchronous function:
 *    - @param id - The id of the project.
 *    - @returns A Promise resolving to the found `Project` on success, an `Error` if retrieving fails, or null if the project of that id doesn't exist.
 */
const getProjectById = (prisma: PrismaClient) => async (id: number): Promise<Project | Error | null> => {
	try {
		const project = await projectServices.getProjectById(prisma)(id);
		return project;
	}

	catch (err) {
		return err as Error;
	}
};

/**
 * Get a project in the database by its id
 *
 * @param prisma - The PrismaClient instance used to access the database.
 * @returns An asynchronous function:
 *    - @param id - The id of the project.
 *    - @returns A Promise resolving to the found `Project` on success, an `Error` if retrieving fails, or null if the project of that id doesn't exist.
 */
const getProjectByName = (prisma: PrismaClient)  => async (name: string): Promise<Project | Error | null> => {
	try {
		const project = await projectServices.getProjectByName(prisma)(name);
		return project;
	}

	catch (err) {
		return err as Error;
	}
};


/**
 * Creates a new project in the database
 *
 * @param prisma - The PrismaClient instance used to access the database.
 * @returns An asynchronous function:
 *    - @param name - The name of the project.
 *    - @param color - The hex code of the color assigned to this project
 *    - @returns A Promise resolving to the created `Project` on success, or an `Error` if creation fails.
 */
const createProject = (prisma: PrismaClient)  => async (name: string, color: string): Promise<Project | Error> => {
	try {

		//verify the is room for more projects
		const size = await projectServices.getProjectCount(prisma);

		if(size >= MAX_PROJECTS) {
			return new Error(`Reached maximum amount of projects (${MAX_PROJECTS}). Please delete some before creating more.`);
		}

		//check all the project within the db, throw an error if any of the names match this one (case-insensitive)
		const existingProject = await projectServices.getProjectByName(prisma)(name);

		if(existingProject !== null) {
			return new Error("Unique constraint failed on the fields: (`name`)");
		}

		return await projectServices.createProject(prisma)(name, color);
	}
	catch (err) {
		return err as Error;
	}
};

export {
	createProject,
	getProjectById,
	getProjectByName,
	getAllProjects,
	MAX_PROJECTS
};