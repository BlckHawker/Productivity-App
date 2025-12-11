/**
 * Section service layer.
 * Provides database access methods for Section entities using Prisma.
 */

import { PrismaClient, Section } from "../../generated/prisma";

/**
 * Creates a new section within a given project.
 *
 * @param prisma - The Prisma client instance.
 * @returns A function that accepts a `projectId` and `sectionName`, returning the created Section.
 */
const createSection =
	(prisma: PrismaClient) => async (projectId: number, sectionName: string) => {
		const section = await prisma.section.create({
			data: {
				project_id: projectId,
				name: sectionName
			}
		});

		return section;
	};

/**
 * Finds the first section in a project by its name (case-insensitive).
 *
 * @param prisma - The Prisma client instance.
 * @returns A function that accepts a `projectId` and `sectionName`, resolving to a Section or null.
 */
const getSectionByName =
	(prisma: PrismaClient) => async (projectId: number, sectionName: string) => {
		const section = await prisma.section.findFirst({
			where: {
				name: {
					equals: sectionName,
					mode: "insensitive"
				},

				project_id: {
					equals: projectId
				}
			}
		});
		return section;
	};

/**
 * Finds a section by its unique ID.
 *
 * @param prisma - The Prisma client instance.
 * @returns A function that accepts a `sectionId` and resolves to a Section or null.
 */
const getSectionById = (prisma: PrismaClient) => async (sectionId: number) => {
	const section = await prisma.section.findFirst({
		where: {
			id: {
				equals: sectionId
			}
		}
	});
	return section;
};

/**
 * Deletes a section by its unique ID.
 *
 * @param prisma - The Prisma client instance.
 * @returns A function that accepts an `id` and resolves to the deleted `Section`.
 *   Throws an error if the section does not exist.
 */

const deleteSectionById = (prisma: PrismaClient) => async (id: number) => {
	const section = await prisma.section.delete({
		where: {
			id
		}
	});
	return section;
};

/**
 * Retrieves all sections by name (case-insensitive).
 *
 * @param prisma - The Prisma client instance.
 * @returns A function that accepts a `sectionName` string and resolves to an array of Sections.
 */
const getSectionsByName =
	(prisma: PrismaClient) => async (sectionName: string) => {
		const sections = await prisma.section.findMany({
			where: {
				name: {
					equals: sectionName,
					mode: "insensitive"
				}
			}
		});
		return sections;
	};

/**
 * Retrieves all sections in the database.
 *
 * @param prisma - The Prisma client instance.
 * @returns A promise resolving to an array of Sections.
 */
const getAllSections = async (prisma: PrismaClient): Promise<Section[]> => {
	const sections = await prisma.section.findMany({});
	return sections;
};

/**
 * Retrieves all sections belonging to a specific project.
 *
 * @param prisma - The Prisma client instance.
 * @returns A function that accepts a `projectId` and resolves to an array of Sections.
 */
const getAllSectionsInProject =
	(prisma: PrismaClient) => async (projectId: number) => {
		const sections = await prisma.section.findMany({
			where: {
				project_id: {
					equals: projectId
				}
			}
		});

		return sections;
	};

/**
 * Counts the total number of sections within a given project.
 *
 * @param prisma - The Prisma client instance.
 * @returns A function that accepts a `projectId` and resolves to the number of sections.
 */
const getNumberOfSectionInProject =
	(prisma: PrismaClient) => async (projectId: number) => {
		const sections = await prisma.section.count({
			where: {
				project_id: {
					equals: projectId
				}
			}
		});

		return sections;
	};

export {
	getSectionById,
	getSectionByName,
	getSectionsByName,
	createSection,
	getNumberOfSectionInProject,
	getAllSections,
	getAllSectionsInProject,
	deleteSectionById
};
