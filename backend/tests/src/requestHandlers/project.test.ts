import { Request, Response } from "express";
import * as projectController from "../../../src/controllers/project.ts";
import * as utils from "../../../src/utils.ts";
import { createProject, getAllProjects, getProjectById, getProjectByName } from "../../../src/requestHandlers/project.ts";
import { StatusCode } from "status-code-enum";

jest.mock("../../../src/controllers/project.ts");
jest.mock("../../../src/utils.ts");

let req: Partial<Request> & { prisma?: any };
let res: jest.Mocked<Response>;

const resetTests = () => {
	req = { prisma: {}, body: {}, query: {} };
	const resPartial: Partial<jest.Mocked<Response>> = {
		status: jest.fn().mockReturnThis(),
		json: jest.fn().mockReturnThis(),
	};

	res = resPartial as jest.Mocked<Response>;

	jest.clearAllMocks();
};

const mockCurried = <T>(fn: jest.Mock, returnValue: T) => {
	fn.mockReturnValueOnce(jest.fn().mockResolvedValueOnce(returnValue));
};

const mockCurriedError = (fn: jest.Mock, error: Error) => {
	fn.mockReturnValueOnce(jest.fn().mockRejectedValueOnce(error));
};

describe("Get all projects", () => {
	beforeEach(() => {
		resetTests();
	});

	test("404s if no projects found", async () => {
		const id = 1;
		mockCurried(projectController.getAllProjects as jest.Mock, []);
		const message = "No projects were found";
		jest.spyOn(utils, "sanitizeResponse").mockImplementation(
			(_response, res, message) => {
				res.status(StatusCode.ClientErrorNotFound).json({ message });
				return res;
			});
		await getAllProjects(req as Request, res);
		expect(projectController.getAllProjects).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(StatusCode.ClientErrorNotFound);
		expect(res.json).toHaveBeenCalledWith({ message });
	});

	test("200s and returns the found projects", async () => {
		const projects = [{a: 1}, {a: 2}];
		mockCurried(projectController.getAllProjects as jest.Mock, projects);
		jest.spyOn(utils, "sanitizeResponse").mockImplementation(
			(_response, res) => {
				res.status(StatusCode.SuccessOK).json(projects);
				return res;
			});
		await getAllProjects(req as Request, res);
		expect(projectController.getAllProjects).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(StatusCode.SuccessOK);
		expect(res.json).toHaveBeenCalledWith(projects);
	});
});

describe("Get project by id", () => {
	beforeEach(() => {
		resetTests();
	});

	test("400s if id is not a number", async () => {
		(req as any).params = { id: "abc" };
		const obj = { success: false, message: "invalid" };
		(utils.assertArgumentsNumber as jest.Mock).mockReturnValue(obj);
		await getProjectById(req as Request, res);
		expect(res.status).toHaveBeenCalledWith(StatusCode.ClientErrorBadRequest);
		expect(res.json).toHaveBeenCalledWith(obj);
		expect(projectController.getProjectById).not.toHaveBeenCalled();
	});

	test("404s if a project with the given id is not found", async () => {
		const id = 1;
		(req as any).params = { id };
		const obj = { success: true };
		(utils.assertArgumentsNumber as jest.Mock).mockReturnValue(obj);
		mockCurried(projectController.getProjectById as jest.Mock, null);
		const notFoundMessage = `A project with the id "${id}" could not be found.`;
		jest.spyOn(utils, "sanitizeResponse").mockImplementation(
			(_response, res, message) => {
				res.status(StatusCode.ClientErrorNotFound).json({ message });
				return res;
			});
		await getProjectById(req as Request, res);
		expect(projectController.getProjectById).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(StatusCode.ClientErrorNotFound);
		expect(res.json).toHaveBeenCalledWith({ message: notFoundMessage });
	});

	test("200s and returns the found project", async () => {
		const id = 1;
		const project = { id };
		(req as any).params = { id };
		const obj = { success: true };
		(utils.assertArgumentsNumber as jest.Mock).mockReturnValue(obj);
		mockCurried(projectController.getProjectById as jest.Mock, project);
		jest.spyOn(utils, "sanitizeResponse").mockImplementation(
			(_response, res) => {
				res.status(StatusCode.SuccessOK).json(project);
				return res;
			});
		await getProjectById(req as Request, res);
		expect(projectController.getProjectById).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(StatusCode.SuccessOK);
		expect(res.json).toHaveBeenCalledWith(project);
	});
});

describe("Get project by name", () => {
	beforeEach(() => {
		resetTests();
	});

	test("400s if name is not a string", async () => {
		(req as any).query = { name: 1 };
		const obj = { success: false, message: "invalid" };
		(utils.assertArgumentsString as jest.Mock).mockReturnValue(obj);
		await getProjectByName(req as Request, res);
		expect(res.status).toHaveBeenCalledWith(StatusCode.ClientErrorBadRequest);
		expect(res.json).toHaveBeenCalledWith(obj);
		expect(projectController.getProjectByName).not.toHaveBeenCalled();
	});

	test("404s if a project with the given name is not found", async () => {
		const name = "name";
		(req as any).query = { name };
		const obj = { success: true };
		(utils.assertArgumentsString as jest.Mock).mockReturnValue(obj);
		mockCurried(projectController.getProjectByName as jest.Mock, null);
		const notFoundMessage = `A project with the name "${name}" could not be found.`;
		jest.spyOn(utils, "sanitizeResponse").mockImplementation(
			(_response, res, message) => {
				res.status(StatusCode.ClientErrorNotFound).json({ message });
				return res;
			});
		await getProjectByName(req as Request, res);
		expect(projectController.getProjectByName).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(StatusCode.ClientErrorNotFound);
		expect(res.json).toHaveBeenCalledWith({ message: notFoundMessage });
	});

	test("200s and returns the found project", async () => {
		const project = { name: "name" };
		(req as any).query = project;
		const obj = { success: true };
		(utils.assertArgumentsString as jest.Mock).mockReturnValue(obj);
		mockCurried(projectController.getProjectByName as jest.Mock, project);
		jest.spyOn(utils, "sanitizeResponse").mockImplementation(
			(_response, res) => {
				res.status(StatusCode.SuccessOK).json(project);
				return res;
			});
		await getProjectByName(req as Request, res);
		expect(projectController.getProjectByName).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(StatusCode.SuccessOK);
		expect(res.json).toHaveBeenCalledWith(project);
	});
});

describe("create project", () => {
	beforeEach(() => {
		resetTests();
	});

	test("200s and returns the project on success", async () => {
		const id = 1;
		const project = { id };
		(req as any).params = { id };
		(utils.mergeResults as jest.Mock).mockReturnValue({success: true});
		mockCurried(projectController.createProject as jest.Mock, project);
		jest.spyOn(utils, "sanitizeResponse").mockImplementation(
			(_response, res) => {
				res.status(StatusCode.SuccessOK).json(project);
				return res;
			});
		await createProject(req as Request, res as Response);
		expect(projectController.createProject).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(StatusCode.SuccessOK);
		expect(res.json).toHaveBeenCalledWith(project);

	});

	test("400s when given an invalid data", async () => {
		(utils.mergeResults as jest.Mock).mockReturnValue({success: false});
		await createProject(req as Request, res as Response);
		expect(projectController.createProject).not.toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(StatusCode.ClientErrorBadRequest);

	});

	describe("409s", () => {
		test(" when a project with an existing name is created", async () => {
			const name = "name";
			req.body.name = name;
			(utils.mergeResults as jest.Mock).mockReturnValue({success: true});
			mockCurried(projectController.createProject as jest.Mock, new Error("Unique constraint failed on the fields: (\`name\`)"));
			await createProject(req as Request, res as Response);
			expect(projectController.createProject).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(StatusCode.ClientErrorConflict);
			expect(res.json).toHaveBeenCalledWith({message: `A project named "${name}" already exists.`});
		});

		test(" when a project is created when max amount is created", async () => {
			const message = "Reached maximum amount of projects";
			(utils.mergeResults as jest.Mock).mockReturnValue({success: true});
			mockCurried(projectController.createProject as jest.Mock, new Error(message));
			await createProject(req as Request, res as Response);
			expect(projectController.createProject).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(StatusCode.ClientErrorConflict);
			expect(res.json).toHaveBeenCalledWith({message});
		});

	});

});