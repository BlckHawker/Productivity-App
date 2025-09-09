// todo add file header comment

import { PrismaClient, Project } from "../../generated/prisma";

//todo put header comment
const getAllProjects = async (prisma: PrismaClient): Promise<Project[]> => {
	const projects = await prisma.project.findMany({});
	return projects;
};

//todo put header comment
const createProject = (prisma: PrismaClient) => async (name: string, color: string): Promise<Project> => {
	const project = await prisma.project.create({
		data: {
			name,
			color
		},
	});
	return project;
};

//todo put header comment
const getProjectCount = async (prisma: PrismaClient): Promise<number> =>  {
	return await prisma.project.count();
};

//todo put header comment
const getProjectByName = (prisma: PrismaClient) => async(name: string): Promise<Project | null> => {
	const project = await prisma.project.findFirst({
		where: {
			name: {
				equals: name,
				mode: "insensitive"
			}
		}
	});
	return project;
};

//todo put header comment
const getProjectById = (prisma: PrismaClient)  => async (id: number): Promise<Project | Error | null> => {
	const project = await prisma.project.findFirst({
		where: {
			id: {
				equals: id,
			}
		}
	});

	return project;
};

export {
	createProject,
	getProjectByName,
	getProjectCount,
	getProjectById,
	getAllProjects
};