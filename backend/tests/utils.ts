// Utility functions for mocking and testing backend controllers and request handlers

import * as utils from "../src/utils";
import { PrismaClient, Project, Section } from "../generated/prisma/index";
import { Request, Response } from "express";
import StatusCode from "status-code-enum";

/**
 * Creates a mocked PrismaClient with optional properties.
 * @param props Optional properties to override the default mock.
 * @returns A Jest-mocked PrismaClient.
 */
const prismaMock = (props: object = {}) =>
	({ ...props }) as jest.Mocked<PrismaClient>;

// Use fake timers to freeze system time during tests
jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));

/**
 * Mocks a curried function that returns a resolved promise with a value.
 * Useful for mocking nested async functions.
 * @param fn The Jest mock function to replace.
 * @param returnValue The value the innermost function should resolve with.
 */
const mockCurried = <T>(fn: jest.Mock, returnValue: T) => {
	fn.mockReturnValueOnce(jest.fn().mockResolvedValueOnce(returnValue));
};

/**
 * Mocks a curried function that returns a rejected promise with an error.
 * Useful for testing async error scenarios.
 * @param fn The Jest mock function to replace.
 * @param error The error to reject with. Defaults to "Error message".
 */
const mockCurriedError = (
	fn: jest.Mock,
	error: Error = new Error("Error message")
) => {
	fn.mockReturnValueOnce(jest.fn().mockRejectedValueOnce(error));
};

/**
 * Mocks a simple async function to resolve with a given value.
 * @param fn The Jest mock function to replace.
 * @param returnValue The value the function should resolve with.
 */
const mockFlat = <T>(fn: jest.Mock, returnValue: T) => {
	fn.mockResolvedValueOnce(returnValue);
};

/**
 * Mocks a simple async function to reject with a given error.
 * @param fn The Jest mock function to replace.
 * @param error The error to reject with. Defaults to "Error message".
 */
const mockFlatError = (
	fn: jest.Mock,
	error: Error = new Error("Error message")
) => {
	fn.mockRejectedValueOnce(error);
};

/**
 * Resets the request and response objects for a request handler test.
 * Clears all mocks and prepares a fresh req/res environment.
 */
const resetRequestHandlerTests = () => {
	req = { prisma: {}, body: {}, query: {} };
	const resPartial: Partial<jest.Mocked<Response>> = {
		status: jest.fn().mockReturnThis(),
		json: jest.fn().mockReturnThis()
	};
	res = resPartial as jest.Mocked<Response>;
	jest.clearAllMocks();
};

/**
 * Base function to mock `sanitizeResponse`.
 * Allows optional message parameter for responses.
 * @param status HTTP status code to return.
 * @param payload Function that generates the response body; receives optional message.
 */
const mockSanitizeResponseBase = <T>(
	status: StatusCode,
	payload: (message?: string) => T
) => {
	return jest
		.spyOn(utils, "sanitizeResponse")
		.mockImplementation((_response, expressRes: Response, message?: string) => {
			expressRes.status(status).json(payload(message));
			return expressRes;
		});
};

/**
 * Mocks `sanitizeResponse` where a message is required.
 * Throws an error if `sanitizeResponse` is called without a message.
 * @param status HTTP status code to return.
 * @param payload Function that generates the response body; receives required message.
 */
const mockSanitizeResponseWithMessage = <T>(
	status: StatusCode,
	payload: (message: string) => T
) => {
	return mockSanitizeResponseBase(status, (message?: string) => {
		if (message === undefined) {
			throw new Error("sanitizeResponse was called without a message");
		}
		return payload(message);
	});
};

/**
 * Mocks `sanitizeResponse` where no message is used.
 * Payload function does not receive any parameters.
 * @param status HTTP status code to return.
 * @param payload Function that generates the response body; receives no arguments.
 */
const mockSanitizeResponseNoMessage = <T>(
	status: StatusCode,
	payload: () => T
) => {
	return mockSanitizeResponseBase(status, () => payload());
};

type MockPrisma = Partial<PrismaClient>;
let req: Partial<Request> & { prisma?: MockPrisma };
let res: jest.Mocked<Response>;

// Example mocked project
const mockedProject: Project = {
	id: 1,
	name: "Test Project",
	color: "#FFFFFF"
} as Project;

// Example mocked section
const mockedSection: Section = {
	id: 1,
	name: "Test Section"
} as Section;

export {
	MockPrisma,
	mockedProject,
	mockedSection,
	req,
	res,
	mockSanitizeResponseWithMessage,
	mockSanitizeResponseNoMessage,
	resetRequestHandlerTests,
	prismaMock,
	mockCurried,
	mockCurriedError,
	mockFlat,
	mockFlatError
};
