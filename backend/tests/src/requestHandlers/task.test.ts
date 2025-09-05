import * as taskController from "../../../src/controllers/task.ts";
import * as utils from "../../../src/utils.ts";
import { Request, Response } from "express";
import { createTask, getAllTasks } from "../../../src/requestHandlers/task.ts";

jest.mock("../../../src/controllers/task.ts");
jest.mock("../../../src/utils.ts");

describe("task route handlers", () => {
	type MockResponse = {
	status: jest.Mock;
	json: jest.Mock;
} & Partial<Response>;

	let req: Partial<Request> & { prisma?: unknown };
	let res: MockResponse;

	beforeEach(() => {
		req = { prisma: {}, body: {} };
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis()
		};

		jest.clearAllMocks();
	});

	describe("getAllTasks", () => {
		it("calls controller and passes result to sanitizeResponse", async () => {
			const controllerResult = [{ id: 1 }];
			(taskController.getAllTasksController as jest.Mock).mockResolvedValue(controllerResult);
			(utils.sanitizeResponse as jest.Mock).mockReturnValue("sanitized");

			const result = await getAllTasks(req as Request, res as Response);

			expect(taskController.getAllTasksController).toHaveBeenCalledWith(req.prisma);
			expect(utils.sanitizeResponse).toHaveBeenCalledWith(controllerResult, res, "No tasks were found");
			expect(result).toBe("sanitized");
		});
	});

	describe("createTask", () => {
		it("returns 400 if name is invalid", async () => {
			req.body = { name: 123 }; // not a string
			(utils.assertArgumentsString as jest.Mock).mockReturnValue({ success: false, message: "invalid" });

			await createTask(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ success: false, message: "invalid" });
			expect(taskController.createTaskController).not.toHaveBeenCalled();
		});

		it("calls controller and sanitizeResponse when name is valid", async () => {
			req.body = { name: "test", complete: true };
			(utils.assertArgumentsString as jest.Mock).mockReturnValue({ success: true });

			const controllerFn = jest.fn().mockResolvedValue("controller-result");
			(taskController.createTaskController as jest.Mock).mockReturnValue(controllerFn);
			(utils.sanitizeResponse as jest.Mock).mockReturnValue("sanitized");

			const result = await createTask(req as Request, res as Response);

			expect(utils.assertArgumentsString).toHaveBeenCalledWith({ name: "test" });
			expect(taskController.createTaskController).toHaveBeenCalledWith(req.prisma);
			expect(controllerFn).toHaveBeenCalledWith("test", true);
			expect(utils.sanitizeResponse).toHaveBeenCalledWith("controller-result", res, "Could not create task");
			expect(result).toBe("sanitized");
		});

		it("defaults complete to false when not boolean", async () => {
			req.body = { name: "test", complete: "not-a-boolean" };
			(utils.assertArgumentsString as jest.Mock).mockReturnValue({ success: true });

			const controllerFn = jest.fn().mockResolvedValue("result");
			(taskController.createTaskController as jest.Mock).mockReturnValue(controllerFn);
			(utils.sanitizeResponse as jest.Mock).mockReturnValue("sanitized");

			await createTask(req as Request, res as Response);

			expect(controllerFn).toHaveBeenCalledWith("test", false);
		});
	});
});
