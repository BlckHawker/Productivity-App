import * as projectServices from "../services/project";
import * as sectionServices from "../services/section";
import { PrismaClient, Section } from "../../generated/prisma";

const MAX_SECTIONS = 100;


//todo add header comment
const createSection =
    (prisma: PrismaClient) =>
    async (
        id: number,
        name: string
    ): Promise<Section | Error> => {

        try {
            //check to see if the project exists
        const project = await projectServices.getProjectById(prisma)(id);

        if(!project) {
            return new Error(`A project with the id ${id} does not exist`)
        }

        if(project instanceof Error) {
            return project;
        }

        //verify a section with the same name doesn't exists within that project
        const exitingSection = await sectionServices.getSectionByName(prisma)(id, name);

        if(exitingSection) {
            return new Error(`A section with the name "${name}" already exists within the project "${project.name}"`)
        }

        //verify this project does not have the threshold amount of sections
        const sectionCount = await sectionServices.getNumberOfSectionInProject(prisma)(id);
        if(sectionCount >= MAX_SECTIONS) {
            return new Error(`Reached maximum amount of sections (${MAX_SECTIONS}) for the project "${project.name}"`)
        }

        const section = await sectionServices.createSection(prisma)(id, name);

        return section;
        }

        catch (err) {
            return err as Error;
        }
}


//todo add header comment
const getSectionById = (prisma: PrismaClient) => async (
        id: number
    ): Promise<Section | Error | null> => {
        try {
                    const section = await sectionServices.getSectionById(prisma)(id);
                    return section;
                } catch (err) {
                    return err as Error;
                }
}

export {
    MAX_SECTIONS,
    createSection,
    getSectionById
}