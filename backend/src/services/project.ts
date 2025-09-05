// todo add file header comment

import { PrismaClient, Project } from "../../generated/prisma";
import prisma from "../prisma";


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

//todo put header comment
const getProjectByName = (prisma: PrismaClient) => async(name: string): Promise<Project | null> => {
  const project = await prisma.project.findFirst({
  where: {
    name: {
      equals: name,
      mode: 'insensitive'
    }
  }
});
return project
}

export {
    createProject,
    getProjectByName
}