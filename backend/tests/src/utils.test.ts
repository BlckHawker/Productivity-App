import { Request, Response } from "express";

import {
	assertArguments,
	assertArgumentsDefined,
	assertArgumentsNumber,
	assertArgumentsString,
	notFound,
	sanitizeResponse
} from "../../src/utils.ts";

describe("assertArguments", () => {
	test("should return success when all arguments pass predicate", () => {
		const result = assertArguments({ a: 1, b: 2 }, v => v > 0, "must be positive");
		expect(result).toEqual({ success: true });
	});

	test("should return failure when some arguments fail predicate", () => {
		const result = assertArguments({ a: 1, b: -1 }, v => v > 0, "must be positive");
		expect(result.success).toBe(false);
		expect(result.message).toBe("Invalid b: must be positive");
	});

	test("should combine multiple error messages", () => {
		const result = assertArguments({ a: -1, b: -2 }, v => v > 0, "must be positive");
		expect(result.success).toBe(false);
		expect(result.message).toBe("Invalid a: must be positive. Invalid b: must be positive");
	});

	test("should work without a custom message", () => {
		const result = assertArguments({ a: undefined }, () => false, "");
		expect(result.message).toBe("Invalid a");
	});
});

describe("assertArgumentsDefined", () => {
	test("should return success if all defined", () => {
		expect(assertArgumentsDefined({ a: 1, b: "test" })).toEqual({ success: true });
	});

	test("should return failure if any undefined", () => {
		const result = assertArgumentsDefined({ a: 1, b: undefined });
		expect(result.success).toBe(false);
		expect(result.message).toContain("cannot be undefined");
	});
});

describe("assertArgumentsNumber", () => {
	test("should return success if all are numbers", () => {
		expect(assertArgumentsNumber({ a: 1, b: 2.5 })).toEqual({ success: true });
	});

	test("should fail if any value is NaN", () => {
		const result = assertArgumentsNumber({ a: NaN });
		expect(result.success).toBe(false);
		expect(result.message).toContain("must be a valid number");
	});
});

describe("assertArgumentsString", () => {
	test("should return success if all are non-empty strings", () => {
		expect(assertArgumentsString({ a: "hello", b: "world" })).toEqual({ success: true });
	});

	test("should fail if any string is empty", () => {
		const result = assertArgumentsString({ a: "" });
		expect(result.success).toBe(false);
		expect(result.message).toContain("must be typeof string");
	});
});

describe("sanitizeResponse", () => {
	let res: jest.Mocked<Response>;

	beforeEach(() => {
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis()
		} as any;
	});

	test("should return 404 for null", () => {
		sanitizeResponse(null, res);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ message: "404 not found" });
	});

	test("should return 404 for empty array", () => {
		sanitizeResponse([], res, "No data");
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ message: "No data" });
	});

	test("should return 404 for Error containing \"not found\"", () => {
		sanitizeResponse(new Error("User not found"), res);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
	});

	test("should return 500 for other Errors", () => {
		sanitizeResponse(new Error("Something broke"), res);
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({ message: "Something broke" });
	});

	test("should return 200 for valid data", () => {
		sanitizeResponse({ id: 1 }, res);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({ id: 1 });
	});
});

describe("notFound", () => {
	test("should return 404 with correct message", () => {
		const req = { method: "GET", originalUrl: "/test" } as Request;
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis()
		} as any;

		notFound(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ message: "'GET /test' is not a valid request" });
	});
});
