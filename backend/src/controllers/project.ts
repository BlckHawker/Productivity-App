// todo add file header comment
import { PrismaClient, Project } from "../../generated/prisma";
import * as projectServices from "../services/project"

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
        //todo check all the project within the db, throw an error if any of the names match this one (case-insensitive)

        return await projectServices.createProject(prisma)(name, color)
    }
    catch (err) {
        return err as Error;
    }
}

export {
    createProject
}