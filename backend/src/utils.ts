import { Request, Response } from "express";

type AssertResult = { success: boolean; message?: string };

/**
 * Runs a predicate check against a collection of arguments.
 *
 * @param args - A dictionary of key/value pairs to validate
 * @param predicate - A function that validates each value
 * @param message - Error message to append if validation fails
 */
const assertArguments = <T>(
	args: Record<string, T>,
	predicate: (value: T) => boolean,
	message: string
): AssertResult => {
	const messages: string[] = [];

	for (const [key, value] of Object.entries(args)) {
		if (!predicate(value as T)) {
			messages.push(`Invalid ${key}${message ? ": " + message : ""}`);
		}
	}

	if (messages.length > 0) {
		return { success: false, message: messages.join(". ") };
	}
	return { success: true };
};

const assertArgumentsDefined = (args: Record<string, unknown>): AssertResult => {
	return assertArguments(args, (a): a is NonNullable<unknown> => a !== undefined, "cannot be undefined");
};

const assertArgumentsNumber = (args: Record<string, unknown>): AssertResult => {
	return assertArguments(args, (a): a is number => typeof a === "number" && !isNaN(a), "must be a valid number");
};

const assertArgumentsString = (args: Record<string, unknown>): AssertResult => {
	return assertArguments(args, (arg): arg is string => typeof arg === "string" && arg.trim() !== "", "must be a non-empty string");
};

/**
 * Parses a database response into an Express response with appropriate status codes:
 * - [] | undefined | null => 404
 * - Error => 500 (or 404 if message suggests "not found")
 * - Any other value => 200
 */
const sanitizeResponse = (
	response: unknown,
	expressResponse: Response,
	message404: string = "404 not found"
): Response => {
	if (response == null || (Array.isArray(response) && response.length === 0)) {
		return expressResponse.status(404).json({ message: message404 });
	}

	if (response instanceof Error) {
		if (/does not exist|not found/i.test(response.message)) {
			return expressResponse.status(404).json({ message: response.message ?? "Not found" });
		}
		return expressResponse.status(500).json({ message: response.message ?? "Internal server error." });
	}

	return expressResponse.status(200).json(response);
};

const notFound = (req: Request, res: Response): Response => {
	return res.status(404).json({ message: `'${req.method} ${req.originalUrl}' is not a valid request` });
};

export {
	sanitizeResponse,
	assertArguments,
	assertArgumentsDefined,
	assertArgumentsNumber,
	assertArgumentsString,
	notFound
};
