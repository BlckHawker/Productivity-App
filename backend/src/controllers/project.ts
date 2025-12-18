/**
 * Project controller layer.
 *
 * Provides higher-level operations for managing projects,
 * wrapping service-layer calls with error handling and
 * additional business logic such as validation and limits.
 */

import * as projectServices from "../services/project";
import { PrismaClient, Project } from "../../generated/prisma";

const MAX_PROJECTS = 100;

/**
 * Deletes a project by its ID.
 * @param {PrismaClient} prisma - Prisma client instance used to access the database.
 * @returns {Function} A function that takes:
 *   @param {number} id - The unique ID of the project to delete.
 * @returns {Promise<Project | Error>} The deleted project on success, or an Error object if not found.
 */
const deleteProjectById =
	(prisma: PrismaClient) =>
	async (id: number): Promise<Project | Error> => {
		try {
			//check if the project of that id even exists
			const projectToDelete = await projectServices.getProjectById(prisma)(id);

			//if project doesn't exist, return error
			if (!projectToDelete) {
				return new Error(`A project with the id ${id} could not be found`);
			}

			const project = await projectServices.deleteProjectById(prisma)(id);
			return project;
		} catch (err) {
			return err as Error;
		}
	};

/**
 * Updates an existing project by ID with a new name and/or color.
 * @param {PrismaClient} prisma - Prisma client instance used to access the database.
 * @returns {Function} A function that takes:
 *   @param {number} id - The unique ID of the project to update.
 *   @param {{ name?: string; color?: string }} data - Fields to update. `name` and/or `color` may be provided.
 * @returns {Promise<Project | Error>} The updated project on success, or an Error object if validation fails.
 */
const updateProject =
	(prisma: PrismaClient) =>
	async (
		id: number,
		data: { name: string | null; color: string | null }
	): Promise<Project | Error> => {
		try {
			//verify the project to update exists
			const projectToUpdate = await projectServices.getProjectById(prisma)(id);

			if (projectToUpdate === null) {
				return new Error(`A project with the id "${id}" could not be found.`);
			}

			if (projectToUpdate instanceof Error) {
				return projectToUpdate;
			}

			//if the user is changing both the name and color, verify both are different
			if (
				data.name !== null &&
				projectToUpdate.name.toUpperCase() === data.name.toUpperCase() &&
				data.color !== null &&
				projectToUpdate.color.toUpperCase() === data.color.toUpperCase()
			) {
				return new Error(
					"Cannot update a project with the same values it currently has."
				);
			}

			//if the user is changing just the name, verify the new one is different
			if (
				data.name !== null &&
				projectToUpdate.name.toUpperCase() === data.name.toUpperCase()
			) {
				return new Error(
					"Updated project name must be different from the current name."
				);
			}

			//if the user is changing just the color, verify the new one is different
			if (
				data.color !== null &&
				projectToUpdate.color.toUpperCase() === data.color.toUpperCase()
			) {
				return new Error(
					"Updated project color must be different from the current color."
				);
			}

			//if the name is being changed, verify there is not an existing project with the new name
			if (data.name !== null) {
				const existingProject = await projectServices.getProjectByName(prisma)(
					data.name
				);

				if (existingProject instanceof Error) {
					return existingProject;
				}

				if (existingProject != null) {
					return new Error(
						`A project with the name "${data.name}" already exists`
					);
				}
			}

			//update the project based on what is being changed
			let updatedProject = null;

			if(data.name !== null) {
				updatedProject = projectServices.updateProjectName(prisma)(id,data.name);
			}


			if(data.color !== null) {
				updatedProject = projectServices.updateProjectColor(prisma)(id,data.color);
			}

			//if for some reason the updatedProject is null at this point, throw an error
			if(updatedProject == null) {
				return new Error(`An error occurred updating the project with the id ${id}. Please contact the developers.`)
			}

			return updatedProject;
		} catch (err) {
			return err as Error;
		}
	};

/**
 * Get all projects
 *
 * @param prisma - The PrismaClient instance used to access the database.
 * @returns All projects within the database or an error if there was a problem getting them
 */
const getAllProjects = async (
	prisma: PrismaClient
): Promise<Project[] | Error> => {
	try {
		const projects = await projectServices.getAllProjects(prisma);
		return projects;
	} catch (err) {
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
const getProjectById =
	(prisma: PrismaClient) =>
	async (id: number): Promise<Project | Error | null> => {
		try {
			const project = await projectServices.getProjectById(prisma)(id);
			return project;
		} catch (err) {
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
const getProjectByName =
	(prisma: PrismaClient) =>
	async (name: string): Promise<Project | Error | null> => {
		try {
			const project = await projectServices.getProjectByName(prisma)(name);
			return project;
		} catch (err) {
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
const createProject =
	(prisma: PrismaClient) =>
	async (name: string, color: string): Promise<Project | Error> => {
		try {
			//verify the is room for more projects
			const size = await projectServices.getProjectCount(prisma);

			if (size >= MAX_PROJECTS) {
				return new Error(
					`Reached maximum amount of projects (${MAX_PROJECTS}). Please delete some before creating more.`
				);
			}

			//check all the project within the db, throw an error if any of the names match this one (case-insensitive)
			const existingProject =
				await projectServices.getProjectByName(prisma)(name);

			if (existingProject !== null) {
				return new Error("Unique constraint failed on the fields: (`name`)");
			}

			return await projectServices.createProject(prisma)(name, color);
		} catch (err) {
			return err as Error;
		}
	};

export {
	updateProject,
	createProject,
	getProjectById,
	getProjectByName,
	getAllProjects,
	deleteProjectById,
	MAX_PROJECTS
};
