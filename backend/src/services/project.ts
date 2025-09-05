// todo add file header comment

import { PrismaClient, Project } from "../../generated/prisma";


//todo put header comment
const createProject = (prisma: PrismaClient) => async (name: string, color: string): Promise<Project> => {
    const project = await prisma.project.create({
    data: {
      name,
      color
    },
  });
  return project
}

export {
    createProject
}