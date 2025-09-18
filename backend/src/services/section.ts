/**
 * Section service layer.
 * Provides database access methods for Section entities using Prisma.
 */

import { PrismaClient, Section } from "../../generated/prisma";

//todo add comment header
const createSection = (prisma: PrismaClient) => async (projectId: number, sectionName: string) => {
    const section = await prisma.section.create({
        data: {
            project_id: projectId,
            name: sectionName
        }
    })

    return section;
}

//todo add comment header
const getSectionByName = (prisma: PrismaClient) => async (projectId: number, sectionName: string) => {
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
}

//todo add comment header
const getSectionById = (prisma: PrismaClient) => async (sectionId: number) => {
    const section = await prisma.section.findFirst({
			where: {
				id: {
					equals: sectionId,
				}
			}
		});
		return section;
}

//todo add comment header
const getSectionsByName = (prisma: PrismaClient) => async (sectionName: string) => {
    const sections = await prisma.section.findMany({
			where: {
				name: {
					equals: sectionName,
					mode: "insensitive"
				},
			}
		});
		return sections;
}

//todo add comment header
//todo add controller
//todo add request handler
const getAllSections = async (prisma: PrismaClient): Promise<Section[]> => {
	const sections = await prisma.section.findMany({});
	return sections;
};


//todo add comment header
const getAllSectionsInProject = (prisma: PrismaClient) => async(projectId: number) => {
	const sections = await prisma.section.findMany({
		where: {
			project_id: {
				equals: projectId
			}
		}
	})

	return sections;
}

//todo add comment header
const getNumberOfSectionInProject = (prisma: PrismaClient) => async(projectId: number) => {
	const sections = await prisma.section.count({
		where: {
			project_id: {
				equals: projectId
			}
		}
	})

	return sections;
}

export {
	getSectionById,
    getSectionByName,
    getSectionsByName,
    createSection,
	getNumberOfSectionInProject,
	getAllSections,
	getAllSectionsInProject
};