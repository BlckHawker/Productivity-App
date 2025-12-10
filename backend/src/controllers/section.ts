import * as projectService from "../services/project";
import * as sectionService from "../services/section";
import { PrismaClient, Section } from "../../generated/prisma";

const MAX_SECTIONS = 100;

//todo add comment header
const deleteSectionById =
	(prisma: PrismaClient) =>
	async (id: number): Promise<Section | Error> => {
		try {
			//todo check if the section of that id even exists
			const sectionToDelete = await sectionService.getSectionById(prisma)(id);

			//todo if section doesn't exist, return error
			if (!sectionToDelete) {
				return new Error(`A section with the id ${id} could not be found`);
			}

			//todo if the section to delete is an "Other" one, prohibit it
			if(sectionToDelete.is_other) {
				return new Error(`Section with the id ${id} is named "Other". This cannot be deleted its corresponding project is deleted.`)
			}

			const section = await sectionService.deleteSectionById(prisma)(id);
			return section;
		} catch (err) {
			return err as Error;
		}
	};

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

export {
	MAX_SECTIONS,
	createSection,
	getSectionById,
	getAllSectionsInProject,
	getAllSections,
	deleteSectionById
};
