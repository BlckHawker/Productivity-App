import * as projectController from "../../../src/controllers/project.ts";
import * as testUtils from "../../utils.ts";
import * as utils from "../../../src/utils.ts";
import { Request, Response } from "express";
import {
	createProject,
	deleteProjectById,
	getAllProjects,
	getProjectById,
	getProjectByName,
	updateProject
} from "../../../src/requestHandlers/project.ts";
import { StatusCode } from "status-code-enum";

jest.mock("../../../src/controllers/project.ts");
jest.mock("../../../src/utils.ts");

describe("deleteProjectById", () => {
	beforeEach(() => {
		testUtils.resetRequestHandlerTests();
	});

	test("400s if id is not a number", async () => {
		(testUtils.req as Request).params = { id: "abc" };
		const obj = { success: false, message: "invalid" };
		(utils.assertArgumentsNumber as jest.Mock).mockReturnValue(obj);
		await deleteProjectById(testUtils.req as Request, testUtils.res);
		expect(testUtils.res.status).toHaveBeenCalledWith(
			StatusCode.ClientErrorBadRequest
		);
		expect(testUtils.res.json).toHaveBeenCalledWith(obj);
		expect(projectController.deleteProjectById).not.toHaveBeenCalled();
	});

	test("404s if a project with the given id is not found", async () => {
		const id = 1;
		(testUtils.req as Request).params = { id: String(id) };
		const obj = { success: true };
		(utils.assertArgumentsNumber as jest.Mock).mockReturnValue(obj);
		testUtils.mockCurried(
			projectController.deleteProjectById as jest.Mock,
			null
		);
		const notFoundMessage = `A project with the id "${id}" could not be found.`;
		testUtils.mockSanitizeResponseWithMessage(
			StatusCode.ClientErrorNotFound,
			(message: string) => ({ message })
		);
		await deleteProjectById(testUtils.req as Request, testUtils.res);
		expect(projectController.deleteProjectById).toHaveBeenCalled();
		expect(testUtils.res.status).toHaveBeenCalledWith(
			StatusCode.ClientErrorNotFound
		);
		expect(testUtils.res.json).toHaveBeenCalledWith({
			message: notFoundMessage
		});
	});

	test("200s and returns the deleted project", async () => {
		const id = 1;
		const project = { id };
		(testUtils.req as Request).params = { id: String(id) };
		const obj = { success: true };
		(utils.assertArgumentsNumber as jest.Mock).mockReturnValue(obj);
		testUtils.mockCurried(
			projectController.deleteProjectById as jest.Mock,
			project
		);
		testUtils.mockSanitizeResponseWithMessage(
			StatusCode.SuccessOK,
			() => project
		);
		await deleteProjectById(testUtils.req as Request, testUtils.res);
		expect(projectController.deleteProjectById).toHaveBeenCalled();
		expect(testUtils.res.status).toHaveBeenCalledWith(StatusCode.SuccessOK);
		expect(testUtils.res.json).toHaveBeenCalledWith(project);
	});
});

describe("updateProject", () => {
	beforeEach(() => {
		testUtils.resetRequestHandlerTests();
	});

	describe("400s", () => {
		test("400s if id is not valid", async () => {
			const obj = { success: false, message: "invalid" };
			(utils.assertArgumentsNumber as jest.Mock).mockReturnValueOnce(obj);
			(utils.assertArgumentsString as jest.Mock).mockReturnValue(obj);
			await updateProject(testUtils.req as Request, testUtils.res);
			expect(projectController.updateProject).not.toHaveBeenCalled();
			expect(testUtils.res.status).toHaveBeenCalledWith(
				StatusCode.ClientErrorBadRequest
			);
			expect(testUtils.res.json).toHaveBeenCalledWith(obj);
		});

		test("400s if both the name and the color is not valid", async () => {
			const message = "invalid";
			const obj = { success: false, message };
			(utils.assertArgumentsNumber as jest.Mock).mockReturnValueOnce({
				success: true
			});
			(utils.assertArgumentsString as jest.Mock).mockReturnValue(obj);
			await updateProject(testUtils.req as Request, testUtils.res);
			expect(testUtils.res.status).toHaveBeenCalledWith(
				StatusCode.ClientErrorBadRequest
			);
			expect(testUtils.res.json).toHaveBeenCalledWith({
				message: `${message}\n${message}`
			});
		});
		const errors = [
			"A project with the id",
			"Cannot update a project with the same values it currently has.",
			"Updated project name must be different from the current name.",
			"Updated project color must be different from the current color.",
			"Updated project color must be different from the current color.",
			"A project with the name"
		];

		test.each(errors)(
			"returns 400 when conflict error occurs: %s",
			async (error) => {
				const id = 1;
				const name = "name";
				const color = "color";
				testUtils.req.body.id = id;
				testUtils.req.body.name = name;
				testUtils.req.body.color = color;
				const project = { id, name, color };

				(testUtils.req as Request).body = project;
				const obj = { success: true };
				(utils.assertArgumentsNumber as jest.Mock).mockReturnValue(obj);
				(utils.assertArgumentsString as jest.Mock).mockReturnValue(obj);
				testUtils.mockCurried(
					projectController.updateProject as jest.Mock,
					new Error(error)
				);
				await updateProject(testUtils.req as Request, testUtils.res);
				expect(projectController.updateProject).toHaveBeenCalled();
				expect(testUtils.res.status).toHaveBeenCalledWith(
					StatusCode.ClientErrorBadRequest
				);
				expect(testUtils.res.json).toHaveBeenCalledWith({ message: error });
			}
		);
	});

	test("200s if both a valid name a color are given", async () => {
		(testUtils.req as Request).body = testUtils.mockedProject;
		const obj = { success: true };
		(utils.assertArgumentsNumber as jest.Mock).mockReturnValue(obj);
		(utils.assertArgumentsString as jest.Mock).mockReturnValue(obj);
		testUtils.mockCurried(
			projectController.updateProject as jest.Mock,
			testUtils.mockedProject
		);
		testUtils.mockSanitizeResponseNoMessage(
			StatusCode.SuccessOK,
			() => testUtils.mockedProject
		);
		await updateProject(testUtils.req as Request, testUtils.res);
		expect(projectController.updateProject).toHaveBeenCalled();
		expect(testUtils.res.status).toHaveBeenCalledWith(StatusCode.SuccessOK);
		expect(testUtils.res.json).toHaveBeenCalledWith(testUtils.mockedProject);
	});

	test("200s when name is invalid but color is valid", async () => {
		testUtils.req.body.id = testUtils.mockedProject.id;
		testUtils.req.body.name = testUtils.mockedProject.name;
		testUtils.req.body.color = testUtils.mockedProject.color;
		(utils.assertArgumentsNumber as jest.Mock).mockReturnValueOnce({
			success: true
		});
		(utils.assertArgumentsString as jest.Mock).mockReturnValueOnce({
			success: false
		});
		(utils.assertArgumentsString as jest.Mock).mockReturnValueOnce({
			success: true
		});
		testUtils.mockCurried(
			projectController.updateProject as jest.Mock,
			testUtils.mockedProject
		);
		testUtils.mockSanitizeResponseNoMessage(
			StatusCode.SuccessOK,
			() => testUtils.mockedProject
		);
		await updateProject(testUtils.req as Request, testUtils.res);
		expect(projectController.updateProject).toHaveBeenCalled();
		expect(testUtils.res.status).toHaveBeenCalledWith(StatusCode.SuccessOK);
		expect(testUtils.res.json).toHaveBeenCalledWith(testUtils.mockedProject);
	});

	test("200s when color is invalid but name is valid", async () => {
		(utils.assertArgumentsNumber as jest.Mock).mockReturnValueOnce({
			success: true
		});
		(utils.assertArgumentsString as jest.Mock).mockReturnValueOnce({
			success: true
		});
		(utils.assertArgumentsString as jest.Mock).mockReturnValueOnce({
			success: false
		});
		testUtils.mockCurried(
			projectController.updateProject as jest.Mock,
			testUtils.mockedProject
		);

		testUtils.mockCurried(
			projectController.updateProject as jest.Mock,
			testUtils.mockedProject
		);
		testUtils.mockSanitizeResponseNoMessage(
			StatusCode.SuccessOK,
			() => testUtils.mockedProject
		);
		await updateProject(testUtils.req as Request, testUtils.res);
		expect(projectController.updateProject).toHaveBeenCalled();
		expect(testUtils.res.status).toHaveBeenCalledWith(StatusCode.SuccessOK);
		expect(testUtils.res.json).toHaveBeenCalledWith(testUtils.mockedProject);
	});
});

describe("Get all projects", () => {
	beforeEach(() => {
		testUtils.resetRequestHandlerTests();
	});

	test("404s if no projects found", async () => {
		testUtils.mockCurried(projectController.getAllProjects as jest.Mock, []);
		const message = "No projects were found";
		testUtils.mockSanitizeResponseWithMessage(
			StatusCode.ClientErrorNotFound,
			(message: string) => ({ message })
		);
		await getAllProjects(testUtils.req as Request, testUtils.res);
		expect(projectController.getAllProjects).toHaveBeenCalled();
		expect(testUtils.res.status).toHaveBeenCalledWith(
			StatusCode.ClientErrorNotFound
		);
		expect(testUtils.res.json).toHaveBeenCalledWith({ message });
	});

	test("200s and returns the found projects", async () => {
		const projects = [testUtils.mockedProject, testUtils.mockedProject];
		testUtils.mockCurried(
			projectController.getAllProjects as jest.Mock,
			projects
		);
		testUtils.mockSanitizeResponseNoMessage(
			StatusCode.SuccessOK,
			() => projects
		);
		await getAllProjects(testUtils.req as Request, testUtils.res);
		expect(projectController.getAllProjects).toHaveBeenCalled();
		expect(testUtils.res.status).toHaveBeenCalledWith(StatusCode.SuccessOK);
		expect(testUtils.res.json).toHaveBeenCalledWith(projects);
	});
});

describe("Get project by id", () => {
	beforeEach(() => {
		testUtils.resetRequestHandlerTests();
	});

	test("400s if id is not a number", async () => {
		(testUtils.req as Request).params = { id: "abc" };
		const obj = { success: false, message: "invalid" };
		(utils.assertArgumentsNumber as jest.Mock).mockReturnValue(obj);
		await getProjectById(testUtils.req as Request, testUtils.res);
		expect(testUtils.res.status).toHaveBeenCalledWith(
			StatusCode.ClientErrorBadRequest
		);
		expect(testUtils.res.json).toHaveBeenCalledWith(obj);
		expect(projectController.getProjectById).not.toHaveBeenCalled();
	});

	test("404s if a project with the given id is not found", async () => {
		const id = 1;
		(testUtils.req as Request).params = { id: String(id) };
		(utils.assertArgumentsNumber as jest.Mock).mockReturnValue({
			success: true
		});
		testUtils.mockCurried(projectController.getProjectById as jest.Mock, null);
		const notFoundMessage = `A project with the id "${id}" could not be found.`;
		testUtils.mockSanitizeResponseWithMessage(
			StatusCode.ClientErrorNotFound,
			(message: string) => ({ message })
		);
		await getProjectById(testUtils.req as Request, testUtils.res);
		expect(projectController.getProjectById).toHaveBeenCalled();
		expect(testUtils.res.status).toHaveBeenCalledWith(
			StatusCode.ClientErrorNotFound
		);
		expect(testUtils.res.json).toHaveBeenCalledWith({
			message: notFoundMessage
		});
	});

	test("200s and returns the found project", async () => {
		(testUtils.req as Request).params = {
			id: String(testUtils.mockedProject.id)
		};
		const obj = { success: true };
		(utils.assertArgumentsNumber as jest.Mock).mockReturnValue(obj);
		testUtils.mockCurried(
			projectController.getProjectById as jest.Mock,
			testUtils.mockedProject
		);
		testUtils.mockSanitizeResponseNoMessage(
			StatusCode.SuccessOK,
			() => testUtils.mockedProject
		);
		await getProjectById(testUtils.req as Request, testUtils.res);
		expect(projectController.getProjectById).toHaveBeenCalled();
		expect(testUtils.res.status).toHaveBeenCalledWith(StatusCode.SuccessOK);
		expect(testUtils.res.json).toHaveBeenCalledWith(testUtils.mockedProject);
	});
});

describe("Get project by name", () => {
	beforeEach(() => {
		testUtils.resetRequestHandlerTests();
	});

	test("400s if name is not a string", async () => {
		(testUtils.req as Request).query = { name: "1" };
		const obj = { success: false, message: "invalid" };
		(utils.assertArgumentsString as jest.Mock).mockReturnValue(obj);
		await getProjectByName(testUtils.req as Request, testUtils.res);
		expect(testUtils.res.status).toHaveBeenCalledWith(
			StatusCode.ClientErrorBadRequest
		);
		expect(testUtils.res.json).toHaveBeenCalledWith(obj);
		expect(projectController.getProjectByName).not.toHaveBeenCalled();
	});

	test("404s if a project with the given name is not found", async () => {
		const name = "name";
		(testUtils.req as Request).query = { name };
		const obj = { success: true };
		(utils.assertArgumentsString as jest.Mock).mockReturnValue(obj);
		testUtils.mockCurried(
			projectController.getProjectByName as jest.Mock,
			null
		);
		const notFoundMessage = `A project with the name "${name}" could not be found.`;
		testUtils.mockSanitizeResponseWithMessage(
			StatusCode.ClientErrorNotFound,
			(message: string) => ({ message })
		);
		await getProjectByName(testUtils.req as Request, testUtils.res);
		expect(projectController.getProjectByName).toHaveBeenCalled();
		expect(testUtils.res.status).toHaveBeenCalledWith(
			StatusCode.ClientErrorNotFound
		);
		expect(testUtils.res.json).toHaveBeenCalledWith({
			message: notFoundMessage
		});
	});

	test("200s and returns the found project", async () => {
		const project = { name: "name" };
		(testUtils.req as Request).query = project;
		const obj = { success: true };
		(utils.assertArgumentsString as jest.Mock).mockReturnValue(obj);
		testUtils.mockCurried(
			projectController.getProjectByName as jest.Mock,
			project
		);
		testUtils.mockSanitizeResponseNoMessage(
			StatusCode.SuccessOK,
			() => project
		);
		await getProjectByName(testUtils.req as Request, testUtils.res);
		expect(projectController.getProjectByName).toHaveBeenCalled();
		expect(testUtils.res.status).toHaveBeenCalledWith(StatusCode.SuccessOK);
		expect(testUtils.res.json).toHaveBeenCalledWith(project);
	});
});

describe("create project", () => {
	beforeEach(() => {
		testUtils.resetRequestHandlerTests();
	});

	test("200s and returns the project on success", async () => {
		const id = 1;
		const color = "#ffffff "; // padded to test trim
		const project = { id };
		(testUtils.req as Request).params = { id: String(id) };
		(testUtils.req as Request).body = { name: "My Project", color };
		(utils.mergeResults as jest.Mock).mockReturnValue({ success: true });
		testUtils.mockCurried(
			projectController.createProject as jest.Mock,
			project
		);
		testUtils.mockSanitizeResponseNoMessage(
			StatusCode.SuccessOK,
			() => project
		);
		await createProject(testUtils.req as Request, testUtils.res as Response);
		expect(projectController.createProject).toHaveBeenCalled();
		expect(testUtils.res.status).toHaveBeenCalledWith(StatusCode.SuccessOK);
		expect(testUtils.res.json).toHaveBeenCalledWith(project);
	});

	test("400s when given an invalid data", async () => {
		(utils.mergeResults as jest.Mock).mockReturnValue({ success: false });
		await createProject(testUtils.req as Request, testUtils.res as Response);
		expect(projectController.createProject).not.toHaveBeenCalled();
		expect(testUtils.res.status).toHaveBeenCalledWith(
			StatusCode.ClientErrorBadRequest
		);
	});

	describe("409s", () => {
		test(" when a project with an existing name is created", async () => {
			const name = "name";
			testUtils.req.body.name = name;
			(utils.mergeResults as jest.Mock).mockReturnValue({ success: true });
			testUtils.mockCurried(
				projectController.createProject as jest.Mock,
				new Error("Unique constraint failed on the fields: (`name`)")
			);
			await createProject(testUtils.req as Request, testUtils.res as Response);
			expect(projectController.createProject).toHaveBeenCalled();
			expect(testUtils.res.status).toHaveBeenCalledWith(
				StatusCode.ClientErrorConflict
			);
			expect(testUtils.res.json).toHaveBeenCalledWith({
				message: `A project named "${name}" already exists.`
			});
		});

		test(" when a project is created when max amount is created", async () => {
			const message = "Reached maximum amount of projects";
			(utils.mergeResults as jest.Mock).mockReturnValue({ success: true });
			testUtils.mockCurried(
				projectController.createProject as jest.Mock,
				new Error(message)
			);
			await createProject(testUtils.req as Request, testUtils.res as Response);
			expect(projectController.createProject).toHaveBeenCalled();
			expect(testUtils.res.status).toHaveBeenCalledWith(
				StatusCode.ClientErrorConflict
			);
			expect(testUtils.res.json).toHaveBeenCalledWith({ message });
		});
	});
});
