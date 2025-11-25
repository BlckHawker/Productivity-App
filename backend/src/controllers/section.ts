/**
 * Section controller layer.
 *
 * Provides higher-level operations for managing sections,
 * wrapping service-layer calls with error handling and
 * additional business logic such as validation and limits.
 */

import * as projectService from "../services/project";
import * as sectionService from "../services/section";
import * as projectController from "./project"
import { PrismaClient, Section } from "../../generated/prisma";

const MAX_SECTIONS = 100;

/**
 * Creates a new section in a project.
 *
 * @param prisma - The PrismaClient instance used to access the database.
 * @returns An asynchronous function:
 *   - @param id - The unique ID of the project to create the section in.
 *   - @param name - The name of the section to create.
 *   - @returns A Promise resolving to the created `Section` on success,
 *     or an `Error` if the project does not exist, the name is duplicated,
 *     or the project already has the maximum number of sections.
 */
const createSection =
	(prisma: PrismaClient) =>
	async (id: number, name: string): Promise<Section | Error> => {
		try {
			//check to see if the project exists
			const project = await projectService.getProjectById(prisma)(id);

			if (!project) {
				return new Error(`A project with the id ${id} does not exist`);
			}

			if (project instanceof Error) {
				return project;
			}

			//verify a section with the same name doesn't exists within that project
			const exitingSection = await sectionService.getSectionByName(prisma)(
				id,
				name
			);

			if (exitingSection) {
				return new Error(
					`A section with the name "${name}" already exists within the project "${project.name}"`
				);
			}

			//verify this project does not have the threshold amount of sections
			const sectionCount =
				await sectionService.getNumberOfSectionInProject(prisma)(id);
			if (sectionCount >= MAX_SECTIONS) {
				return new Error(
					`Reached maximum amount of sections (${MAX_SECTIONS}) for the project "${project.name}"`
				);
			}

			const section = await sectionService.createSection(prisma)(id, name);

			return section;
		} catch (err) {
			return err as Error;
		}
	};

/**
 * Retrieves all sections within a given project.
 *
 * @param prisma - The PrismaClient instance used to access the database.
 * @returns An asynchronous function:
 *   - @param id - The unique ID of the project.
 *   - @returns A Promise resolving to an array of `Section` objects on success,
 *     or an `Error` if the project does not exist or retrieval fails.
 */
const getAllSectionsInProject =
	(prisma: PrismaClient) =>
	async (id: number): Promise<Section[] | Error> => {
		try {
			//check to see if the project exists
			const project = await projectService.getProjectById(prisma)(id);

			if (!project) {
				return new Error(`A project with the id ${id} does not exist`);
			}

			//get the sections within the project
			const sections = await sectionService.getAllSectionsInProject(prisma)(id);
			return sections;
		} catch (err) {
			return err as Error;
		}
	};

/**
 * Retrieves a section from the database by its unique ID.
 *
 * @param prisma - The PrismaClient instance used to access the database.
 * @returns An asynchronous function:
 *   - @param id - The unique ID of the section.
 *   - @returns A Promise resolving to the found `Section` on success,
 *     `null` if not found, or an `Error` if retrieval fails.
 */
const getSectionById =
	(prisma: PrismaClient) =>
	async (id: number): Promise<Section | Error | null> => {
		try {
			const section = await sectionService.getSectionById(prisma)(id);
			return section;
		} catch (err) {
			return err as Error;
		}
	};

/**
 * Retrieves all sections from the database.
 *
 * @param prisma - The PrismaClient instance used to access the database.
 * @returns A Promise resolving to an array of `Section` objects on success,
 *   or an `Error` if retrieval fails.
 */
const getAllSections = async (
	prisma: PrismaClient
): Promise<Section[] | Error> => {
	try {
		const sections = await sectionService.getAllSections(prisma);
		return sections;
	} catch (err) {
		return err as Error;
	}
};

/**
 * Changes the name of an existing section.
 *
 * @param prisma - The PrismaClient instance used to access the database.
 * @returns An asynchronous function:
 *   - @param id - The unique ID of the section to rename.
 *   - @param newName - The new name for the section.
 *   - @returns A Promise resolving to the updated `Section` on success,
 *     or an `Error` if the section does not exist, the parent project does not exist,
 *     or another section in the same project already uses `newName`.
 */
const changeSectionName = (prisma: PrismaClient) =>
	async (id: number, newName: string): Promise<Section | Error> => {
	try {
		//check to see if the section exists
		const section = await getSectionById(prisma)(id);

		if (section instanceof Error) {
			return section as Error;
		}

		if (section === null) {
			return new Error(`A section with the id ${id} does not exist`);
		}

		//verify the new name does not exist for an existing section within this project
		const project = await projectController.getProjectById(prisma)(section.project_id);

		if(project instanceof Error) {
			return project as Error;
		}

		if(project === null) {
			return new Error(`Could not find a project connected to the section with an id of ${id}`);
		}

		const existingSection = await sectionService.getSectionByName(prisma)(section.project_id, newName);

		if (existingSection !== null) {
			return new Error(`A section within the project named "${project.name}" (id: ${project.id}) already has a section named "${newName}". Cannot change the section named "${section.name}" (id: ${id}) to "${newName}"`)
		} 

		//change the name of the section
		const updatedSection = await sectionService.changeSectionName(prisma)(id, newName);
		return updatedSection;
	}

	catch(err) {
		return err as Error;
	}
}

/**
 * Moves a section to a different project.
 *
 * @param prisma - The PrismaClient instance used to access the database.
 * @returns An asynchronous function:
 *   - @param sectionId - The unique ID of the section to move.
 *   - @param newProjectId - The ID of the project to move the section into.
 *   - @returns A Promise resolving to the updated `Section` on success,
 *     or an `Error` if the section or project does not exist, if attempting to move
 *     the section to its current project, if the new project already contains a section
 *     with the same name, or if the project has reached the maximum number of sections.
 */
const moveSectionToProject = (prisma: PrismaClient) => async (sectionId: number, newProjectId: number): Promise<Section | Error>  => {
	try {
		//verify the section exists
		const section = await getSectionById(prisma)(sectionId);

		if(section instanceof Error) {
			return section as Error;
		}

		if (section === null) {
			return new Error(`A section with the id ${sectionId} does not exist`);
		}

		//verify the project exists
		const project = await projectController.getProjectById(prisma)(newProjectId);
		if(project instanceof Error) {
			return project as Error;
		}

		if (project === null) {
			return new Error(`A project with the id ${newProjectId} does not exist`);
		}

		const errorMsg = `Cannot move section "${section.name}" (id: ${section.id}) to project "${project.name}" (id: ${project.id}).`

		//verify the new project is not the same as the one section is currently is
		if(project.id == section.project_id) {
			return new Error (`${errorMsg} Section already exists in that project`)
		}

		//verify the project doesn't currently have the max amount of projects
		const sectionSize = await sectionService.getNumberOfSectionInProject(prisma)(project.id)
		if(sectionSize >= MAX_SECTIONS) {
			return new Error(`${errorMsg} Project already has max amount of sections (${sectionSize})`)
		}

		//verify a section with the name of the current section doesn't already exist within that project
		const existingSection = await sectionService.getSectionByName(prisma)(project.id, section.name);

		if (existingSection !== null) {
			return new Error(`${errorMsg} A section within that project already has that name.`)
		} 

		//update the section so its project id is the new one
		const updatedSection = await sectionService.changeSectionProject(prisma)(section.id, project.id);
		return updatedSection;
	}

	catch(err) {
		return err as Error;
	}
}

export {
	MAX_SECTIONS,
	createSection,
	getSectionById,
	getAllSectionsInProject,
	getAllSections,
	changeSectionName,
	moveSectionToProject
};
