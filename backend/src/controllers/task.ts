import * as taskServices from "../services/task";
import { PrismaClient, Task } from "../../generated/prisma";

const getAllTasksController = async(prisma: PrismaClient): Promise<Task[] | Error> => {
    try {
        return await taskServices.getAllTasks(prisma);
    }
    catch (err) {
        return err as Error;
    }
};

const createTaskController = (prisma: PrismaClient)  => async (name: string, complete?: boolean): Promise<Task | Error> => {
    try {
        return await taskServices.createTask(prisma)(name, complete);
    }
    catch (err) {
        return err as Error;
    }
};

export {
    getAllTasksController,
    createTaskController
};