import { Request } from "express";
import * as utils from "../../src/utils.ts";

describe("assertArguments", () => {
	test("should return success when all arguments pass predicate", () => {
		const result = utils.assertArguments({ a: 1, b: 2 }, v => v > 0, "must be positive");
		expect(result).toEqual({ success: true });
	});

	test("should return failure when some arguments fail predicate", () => {
		const result = utils.assertArguments({ a: 1, b: -1 }, v => v > 0, "must be positive");
		expect(result.success).toBe(false);
		expect(result.message).toBe("Invalid b: must be positive");
	});

	test("should combine multiple error messages", () => {
		const result = utils.assertArguments({ a: -1, b: -2 }, v => v > 0, "must be positive");
		expect(result.success).toBe(false);
		expect(result.message).toBe("Invalid a: must be positive. Invalid b: must be positive");
	});

	test("should work without a custom message", () => {
		const result = utils.assertArguments({ a: undefined }, () => false, "");
		expect(result.message).toBe("Invalid a");
	});
});

describe("assertArgumentsHexCode", () => {
	test("should return success for valid 3-digit hex", () => {
		const result = utils.assertArgumentsHexCode({ color: "#fff" });
		expect(result).toEqual({ success: true });
	});

	test("should return success for valid 6-digit hex", () => {
		const result = utils.assertArgumentsHexCode({ color: "#A1B2C3" });
		expect(result).toEqual({ success: true });
	});

	test("should return failure for invalid hex", () => {
		const result = utils.assertArgumentsHexCode({ color: "blue" });
		expect(result.success).toBe(false);
		expect(result.message).toContain("must be a valid hex color");
	});

	test("should return failure for missing #", () => {
		const result = utils.assertArgumentsHexCode({ color: "123456" });
		expect(result.success).toBe(false);
		expect(result.message).toContain("must be a valid hex color");
	});
});

describe("assertArgumentsDefined", () => {
	test("should return success if all defined", () => {
		expect(utils.assertArgumentsDefined({ a: 1, b: "test" })).toEqual({ success: true });
	});

	test("should return failure if any undefined", () => {
		const result = utils.assertArgumentsDefined({ a: 1, b: undefined });
		expect(result.success).toBe(false);
		expect(result.message).toContain("cannot be undefined");
	});
});

describe("assertArgumentsNumber", () => {
	test("should return success if all are numbers", () => {
		expect(utils.assertArgumentsNumber({ a: 1, b: 2.5 })).toEqual({ success: true });
	});

	test("should fail if any value is NaN", () => {
		const result = utils.assertArgumentsNumber({ a: NaN });
		expect(result.success).toBe(false);
		expect(result.message).toContain("must be a valid number");
	});
});

describe("assertArgumentsString", () => {
	test("should return success if all are non-empty strings", () => {
		expect(utils.assertArgumentsString({ a: "hello", b: "world" })).toEqual({ success: true });
	});

	test("should fail if any string is empty", () => {
		const result = utils.assertArgumentsString({ a: "" });
		expect(result.success).toBe(false);
		expect(result.message).toContain("must be typeof string");
	});
});

describe("sanitizeResponse", () => {
	let res: MockResponse;

	beforeEach(() => {
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis()
		};
	});

	test("should return 404 for null", () => {
		utils.sanitizeResponse(null, res);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ message: "404 not found" });
	});

	test("should return 404 for empty array", () => {
		utils.sanitizeResponse([], res, "No data");
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ message: "No data" });
	});

	test("should return 404 for Error containing \"not found\"", () => {
		utils.sanitizeResponse(new Error("User not found"), res);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
	});

	test("should return 500 for other Errors", () => {
		utils.sanitizeResponse(new Error("Something broke"), res);
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({ message: "Something broke" });
	});

	test("should return 200 for valid data", () => {
		utils.sanitizeResponse({ id: 1 }, res);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({ id: 1 });
	});
});

describe("notFound", () => {
	test("should return 404 with correct message", () => {
		const req: MockRequest = { method: "GET", originalUrl: "/test" } as Request;
		const res: MockResponse  = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis()
		};

		utils.notFound(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ message: "'GET /test' is not a valid request" });
	});
});

describe("mergeResults", () => {
	const {  } = require("../../src/utils.ts");

	test("should return success if all validations succeed", () => {
		const result = utils.mergeResults({ success: true }, { success: true });
		expect(result).toEqual({ success: true, message: "" });
	});

	test("should return failure if one validation fails", () => {
		const result = utils.mergeResults({ success: true }, { success: false, message: "error" });
		expect(result.success).toBe(false);
		expect(result.message).toBe("error");
	});

	test("should return failure and combine messages if multiple validations fail", () => {
		const result = utils.mergeResults(
			{ success: false, message: "error 1" },
			{ success: false, message: "error 2" }
		);
		expect(result.success).toBe(false);
		expect(result.message).toBe("error 1 \nerror 2");
	});

	test("should handle empty messages gracefully", () => {
		const result = utils.mergeResults(
			{ success: false, message: "" },
			{ success: false, message: "another error" }
		);
		expect(result.success).toBe(false);
		expect(result.message).toBe(" \nanother error");
	});
});
