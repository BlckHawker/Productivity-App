import { PrismaClient, Task } from "../../generated/prisma";
import * as taskServices from "../services/task"

/**
 * Gets all the tasks in the database
 *
 * @param prisma - The PrismaClient instance used to access the database.
 * @returns An asynchronous function:
 *    - @returns A Promise resolving an array of tasks within the database on success, or an `Error` if getting fails.
 */
const getAllTasksController = async(prisma: PrismaClient): Promise<Task[] | Error> => {
    try {
        return await taskServices.getAllTasks(prisma)
    }
    catch (err) {
        return err as Error;
    }
}

/**
 * Creates a new task in the database
 *
 * @param prisma - The PrismaClient instance used to access the database.
 * @returns An asynchronous function:
 *    - @param name - The name of the task.
 *    - @param complete - (Optional) The completion status of the task. Defaults to `false` if not provided.
 *    - @returns A Promise resolving to the created `Task` on success, or an `Error` if creation fails.
 */
const createTaskController = (prisma: PrismaClient)  => async (name: string, complete?: boolean): Promise<Task | Error> => {
    try {
        return await taskServices.createTask(prisma)(name, complete)
    }
    catch (err) {
        return err as Error;
    }
}

export {
    getAllTasksController,
    createTaskController
}