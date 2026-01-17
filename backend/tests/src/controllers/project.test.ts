import * as projectController from "../../../src/controllers/project.ts";
import * as projectService from "../../../src/services/project.ts";
import { Project } from "../../../generated/prisma/index";
import * as utils from "../../utils.ts"

jest.mock("../../../src/services/project");

describe("deleteProjectById", () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	test("should return an error if the project doesn't exist", async () => {
		utils.mockCurried(projectService.getProjectById as jest.Mock, null);
		const response = await projectController.deleteProjectById(utils.prismaMock())(1);
		expect(response).toBeInstanceOf(Error);
	});

	test("should return an error if the service returns an error", async () => {
		utils.mockCurried(projectService.getProjectById as jest.Mock, utils.mockedProject);
		(projectService.getProjectById as jest.Mock).mockRejectedValueOnce(
			new Error()
		);
		const response = await projectController.deleteProjectById(utils.prismaMock())(1);
		expect(response).toBeInstanceOf(Error);
	});

	test("should return whatever deleteProjectById services returns", async () => {
		utils.mockCurried(projectService.getProjectById as jest.Mock, utils.mockedProject);
		utils.mockCurried(projectService.deleteProjectById as jest.Mock, utils.mockedProject);
		const response = await projectController.deleteProjectById(utils.prismaMock())(1);
		expect(response).toBe(utils.mockedProject);
	});
});

describe("updateProject", () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	test("should return error if project does not exist", async () => {
		utils.mockCurried(projectService.getProjectById as jest.Mock, null);

		const response = await projectController.updateProject(utils.prismaMock())(1, {
			name: "new name", color: "new color" 
		});

		expect(response).toBeInstanceOf(Error);
		expect((response as Error).message).toMatch(/could not be found/);
	});

	test("should return error if getProjectById returns Error", async () => {
		const error = new Error("DB error");
		utils.mockCurried(projectService.getProjectById as jest.Mock, error);

		const response = await projectController.updateProject(utils.prismaMock())(1, {
			name: "new name", color: "new color" 
		});

		expect(response).toBe(error);
	});

	test("should return error if updating with same name and color", async () => {
		utils.mockCurried(projectService.getProjectById as jest.Mock, utils.mockedProject);
		const response = await projectController.updateProject(utils.prismaMock())(1, {
			name: utils.mockedProject.name,
			color: utils.mockedProject.color
		});

		expect(response).toBeInstanceOf(Error);
		expect((response as Error).message).toMatch(/same values/);
	});

	test("should return error if updating with same name", async () => {
		utils.mockCurried(projectService.getProjectById as jest.Mock, utils.mockedProject);
		const response = await projectController.updateProject(utils.prismaMock())(1, {
			name: utils.mockedProject.name, color: null
		});

		expect(response).toBeInstanceOf(Error);
	});

	test("should return error if getProjectByName returns an error", async () => {
		utils.mockCurried(projectService.getProjectById as jest.Mock, utils.mockedProject);
		const error = new Error("DB lookup error");
		utils.mockCurried(projectService.getProjectByName as jest.Mock, error);
		const response = await projectController.updateProject(utils.prismaMock())(1, {
			name: "New Name", color: "New Color"
		});

		expect(response).toEqual(error);
	});

	test("should return error if updating with same color", async () => {
		utils.mockCurried(projectService.getProjectById as jest.Mock, utils.mockedProject);
		const response = await projectController.updateProject(utils.prismaMock())(1, {
			name: "New Name", color: utils.mockedProject.color
		});

		expect(response).toBeInstanceOf(Error);
		expect((response as Error).message).toMatch(
			/different from the current color/
		);
	});

	test("should return error if a project of the new name already exists", async () => {
		const existingProject: Project = {
			id: 1,
			name: "New Name",
			color: "#FFFFFF"
		} as Project;
		utils.mockCurried(projectService.getProjectById as jest.Mock, utils.mockedProject);
		utils.mockCurried(projectService.getProjectByName as jest.Mock, existingProject);
		const response = await projectController.updateProject(utils.prismaMock())(1, {
			name: "New Name", color: "New Color"
		});

		expect(response).toBeInstanceOf(Error);
		expect((response as Error).message).toMatch(
			/A project with the name ".+" already exists/
		);
	});

	test("should return error if checking for an existing project name fails", async () => {
		utils.mockCurried(projectService.getProjectById as jest.Mock, utils.mockedProject);
		utils.mockCurried(projectService.getProjectByName as jest.Mock, new Error());

		const response = await projectController.updateProject(utils.prismaMock())(1, {
			name: "New Name", color: "New Color"
		});
		expect(response).toBeInstanceOf(Error);
	});

	test("should return updated project on success", async () => {
		const updatedNameProject = { ...utils.mockedProject, name: "New Name"  };
		const updatedColorProject = { ...updatedNameProject, color: "New Color"  };

		utils.mockCurried(projectService.getProjectById as jest.Mock, utils.mockedProject);
		utils.mockCurried(projectService.getProjectByName as jest.Mock, null);
		utils.mockCurried(projectService.updateProjectName as jest.Mock, updatedNameProject);
		utils.mockCurried(projectService.updateProjectColor as jest.Mock, updatedColorProject);

		const response = await projectController.updateProject(utils.prismaMock())(1, {
			name: "New Name", color: "New Color"
		});

		expect(response).toEqual(updatedColorProject);
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
		const response = await projectController.getAllProjects(utils.prismaMock());
		expect(response).toBeInstanceOf(Error);
	});

	test("If service returns, then controller should return service value", async () => {
		const projectData = ["a", "b"];
		(projectService.getAllProjects as jest.Mock).mockResolvedValueOnce(
			projectData
		);
		const response = await projectController.getAllProjects(utils.prismaMock());
		expect(response).toEqual(projectData);
	});
});

describe("Create Project Controller", () => {
	const projectData = { name: "name", color: "#f00" };
	const createProject = (name = projectData.name, color = projectData.color) =>
		projectController.createProject(utils.prismaMock())(name, color);

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
		utils.mockCurried(projectService.getProjectByName as jest.Mock, projectData);
		const response = await createProject();
		expect(response).toBeInstanceOf(Error);
	});

	test("If the service returns an error, it should return the error", async () => {
		utils.mockCurriedError(
			projectService.createProject as jest.Mock);
		const response = await createProject();
		expect(response).toBeInstanceOf(Error);
	});

	test("If service returns, then controller should return service value", async () => {
		(projectService.getProjectCount as jest.Mock).mockResolvedValueOnce(0);
		utils.mockCurried(projectService.getProjectByName as jest.Mock, null);
		utils.mockCurried(projectService.createProject as jest.Mock, projectData);
		const response = await createProject();
		expect(response).toEqual(projectData);
	});
});

describe("Get project by id", () => {
	test("If the service returns an error, it should return the error", async () => {
		utils.mockCurriedError(
			projectService.getProjectById as jest.Mock);
		const response = await projectController.getProjectById(utils.prismaMock())(1);
		expect(response).toBeInstanceOf(Error);
	});

	test("If service returns, then controller should return service value", async () => {
		const projectData = { name: "a" };
		utils.mockCurried(projectService.getProjectById as jest.Mock, projectData);
		const response = await projectController.getProjectById(utils.prismaMock())(1);
		expect(response).toEqual(projectData);
	});
});

describe("Get project by name", () => {
	test("If the service returns an error, it should return the error", async () => {
		utils.mockCurriedError(
			projectService.getProjectByName as jest.Mock
		);
		const response = await projectController.getProjectByName(utils.prismaMock())("");
		expect(response).toBeInstanceOf(Error);
	});

	test("If service returns, then controller should return service value", async () => {
		const projectData = { name: "a" };
		utils.mockCurried(projectService.getProjectByName as jest.Mock, projectData);
		const response = await projectController.getProjectByName(utils.prismaMock())("");
		expect(response).toEqual(projectData);
	});
});
