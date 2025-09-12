import * as projectController from "../../../src/controllers/project.ts";
import * as projectService from "../../../src/services/project.ts";
import { PrismaClient, Project } from "../../../generated/prisma/index";

jest.mock("../../../src/services/project");

const project: Project = {
	id: 1,
	name: "Test Project",
	color: "#FFFFFF"
} as Project;

const prismaMock = (props: object = {}) =>
	({ ...props }) as jest.Mocked<PrismaClient>;
jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));

const mockCurried = <T>(fn: jest.Mock, returnValue: T) => {
	fn.mockReturnValueOnce(jest.fn().mockResolvedValueOnce(returnValue));
};

const mockCurriedError = (fn: jest.Mock, error: Error) => {
	fn.mockReturnValueOnce(jest.fn().mockRejectedValueOnce(error));
};

describe("getProjectById", () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	test("should return an error if the project doesn't exist", async () => {
		mockCurried(projectService.getProjectById as jest.Mock, null);
		const response = await projectController.deleteProjectById(prismaMock())(1);
		expect(response).toBeInstanceOf(Error);
	});

	test("should return an error if the service returns an error", async () => {
		mockCurried(projectService.getProjectById as jest.Mock, project);
		(projectService.getProjectById as jest.Mock).mockRejectedValueOnce(
			new Error()
		);
		const response = await projectController.deleteProjectById(prismaMock())(1);
		expect(response).toBeInstanceOf(Error);
	});

	test("should return whatever deleteProjectById services returns", async () => {
		mockCurried(projectService.getProjectById as jest.Mock, project);
		mockCurried(projectService.deleteProjectById as jest.Mock, project);
		const response = await projectController.deleteProjectById(prismaMock())(1);
		expect(response).toBe(project);
	});
});

describe("updateProject", () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	test("should return error if project does not exist", async () => {
		mockCurried(projectService.getProjectById as jest.Mock, null);

		const response = await projectController.updateProject(prismaMock())(1, {
			name: "New Name"
		});

		expect(response).toBeInstanceOf(Error);
		expect((response as Error).message).toMatch(/could not be found/);
	});

	test("should return error if getProjectById returns Error", async () => {
		const error = new Error("DB error");
		mockCurried(projectService.getProjectById as jest.Mock, error);

		const response = await projectController.updateProject(prismaMock())(1, {
			name: "New Name"
		});

		expect(response).toBe(error);
	});

	test("should return error if updating with same name and color", async () => {
		mockCurried(projectService.getProjectById as jest.Mock, project);
		const response = await projectController.updateProject(prismaMock())(1, {
			name: project.name,
			color: project.color
		});

		expect(response).toBeInstanceOf(Error);
		expect((response as Error).message).toMatch(/same values/);
	});

	test("should return error if updating with same name only", async () => {
		mockCurried(projectService.getProjectById as jest.Mock, project);
		const response = await projectController.updateProject(prismaMock())(1, {
			name: project.name
		});

		expect(response).toBeInstanceOf(Error);
	});

	test("should return error if getProjectByName returns an error", async () => {
		mockCurried(projectService.getProjectById as jest.Mock, project);
		const error = new Error("DB lookup error");
		mockCurried(projectService.getProjectByName as jest.Mock, error);
		const response = await projectController.updateProject(prismaMock())(1, {
			name: "New Name"
		});

		expect(response).toEqual(error);
	});

	test("should return error if updating with same color only", async () => {
		mockCurried(projectService.getProjectById as jest.Mock, project);
		const response = await projectController.updateProject(prismaMock())(1, {
			color: project.color
		});

		expect(response).toBeInstanceOf(Error);
		expect((response as Error).message).toMatch(
			/different from the current color/
		);
	});

	test("should return error if new name already exists", async () => {
		mockCurried(projectService.getProjectById as jest.Mock, project);
		const error = new Error("");
		mockCurried(projectService.getProjectById as jest.Mock, error);
		const response = await projectController.updateProject(prismaMock())(1, {
			name: "New Name"
		});

		expect(response).toBeInstanceOf(Error);
	});

	test("should return error if error occurs getting project by name", async () => {
		mockCurried(projectService.getProjectById as jest.Mock, project);
		mockCurried(projectService.getProjectByName as jest.Mock, {
			id: 2,
			name: "New Name",
			color: "#000000"
		});
		const response = await projectController.updateProject(prismaMock())(1, {
			name: "New Name"
		});

		expect(response).toBeInstanceOf(Error);
		expect((response as Error).message).toMatch(/already exists/);
	});

	test("should return updated project on success", async () => {
		const updated = { ...project, name: "Updated Name" };
		mockCurried(projectService.getProjectById as jest.Mock, project);
		mockCurried(projectService.getProjectByName as jest.Mock, null);
		mockCurried(projectService.updateProject as jest.Mock, updated);
		const response = await projectController.updateProject(prismaMock())(1, {
			name: "Updated Name"
		});

		expect(response).toEqual(updated);
	});
});

describe("Get all projects", () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	test("If the service returns an error, it should return the error", async () => {
		(projectService.getAllProjects as jest.Mock).mockRejectedValue(
			new Error("Error message")
		);
		const response = await projectController.getAllProjects(prismaMock());
		expect(response).toBeInstanceOf(Error);
	});

	test("If service returns, then controller should return service value", async () => {
		const projectData = ["a", "b"];
		(projectService.getAllProjects as jest.Mock).mockResolvedValueOnce(
			projectData
		);
		const response = await projectController.getAllProjects(prismaMock());
		expect(response).toEqual(projectData);
	});
});

describe("Create Project Controller", () => {
	const projectData = { name: "name", color: "#f00" };
	const createProject = (name = projectData.name, color = projectData.color) =>
		projectController.createProject(prismaMock())(name, color);

	beforeEach(() => {
		jest.resetAllMocks();
	});

	test("returns an error if the project is created when the max amount of projects is registered in the database", async () => {
		(projectService.getProjectCount as jest.Mock).mockResolvedValueOnce(
			projectController.MAX_PROJECTS
		);
		const response = await createProject();
		expect(response).toBeInstanceOf(Error);
	});

	test("returns an error if a project is created with the same name of an existing project within the database", async () => {
		mockCurried(projectService.getProjectByName as jest.Mock, projectData);
		const response = await createProject();
		expect(response).toBeInstanceOf(Error);
	});

	test("If the service returns an error, it should return the error", async () => {
		mockCurriedError(
			projectService.createProject as jest.Mock,
			new Error("Error message")
		);
		const response = await createProject();
		expect(response).toBeInstanceOf(Error);
	});

	test("If service returns, then controller should return service value", async () => {
		(projectService.getProjectCount as jest.Mock).mockResolvedValueOnce(0);
		mockCurried(projectService.getProjectByName as jest.Mock, null);
		mockCurried(projectService.createProject as jest.Mock, projectData);
		const response = await createProject();
		expect(response).toEqual(projectData);
	});
});

describe("Get project by id", () => {
	test("If the service returns an error, it should return the error", async () => {
		mockCurriedError(
			projectService.getProjectById as jest.Mock,
			new Error("Error message")
		);
		const response = await projectController.getProjectById(prismaMock())(1);
		expect(response).toBeInstanceOf(Error);
	});

	test("If service returns, then controller should return service value", async () => {
		const projectData = { name: "a" };
		mockCurried(projectService.getProjectById as jest.Mock, projectData);
		const response = await projectController.getProjectById(prismaMock())(1);
		expect(response).toEqual(projectData);
	});
});

describe("Get project by name", () => {
	test("If the service returns an error, it should return the error", async () => {
		mockCurriedError(
			projectService.getProjectByName as jest.Mock,
			new Error("Error message")
		);
		const response = await projectController.getProjectByName(prismaMock())("");
		expect(response).toBeInstanceOf(Error);
	});

	test("If service returns, then controller should return service value", async () => {
		const projectData = { name: "a" };
		mockCurried(projectService.getProjectByName as jest.Mock, projectData);
		const response = await projectController.getProjectByName(prismaMock())("");
		expect(response).toEqual(projectData);
	});
});
