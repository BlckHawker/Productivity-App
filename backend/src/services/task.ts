import { PrismaClient, Task } from "../../generated/prisma";
const getAllTasks = async (prisma: PrismaClient): Promise<Task[]>  => {
    const tasks = await prisma.task.findMany();
    return tasks as Task[];
}


const createTask = (prisma: PrismaClient) => async (name: string, complete?: boolean): Promise<Task> => {
    const task = await prisma.task.create({
    data: {
      name: name,
      complete: complete ?? false,
    },
  });
  return task
}

export {
    getAllTasks,
    createTask
};