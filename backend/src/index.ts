/**
 * Entry point for the backend Express server.
 * Sets up a minimal HTTP API with a single health check endpoint.
 */

import express, { Request, Response } from "express";

const app = express();
const port = process.env.PORT || 3000;

/**
 * Health check route to verify the server is running.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @returns Sends a plain text "OK" message.
 */
app.get("/health", (req: Request, res: Response): void => {
	res.status(200).send("OK");
});

app.listen(port, () => {
	// eslint-disable-next-line no-console
	console.log(`Backend server running on port ${port}`);
});