/**
 * Route all incoming requests
 */
// Must-come-first imports
import * as utils from "./utils";
import cors from "cors";

// Normal imports
import { Express } from "express";
import * as project from "./requestHandlers/project";
import { port } from "./server";
import swaggerDocs from "./swagger.js";

export default (app: Express) => {
	app.use(cors());
	app.post("/project/create", project.createProject);
	app.get("/projects", project.getAllProjects);
	app.get("/project/:id", project.getProjectById);
	app.get("/project", project.getProjectByName);

	swaggerDocs(app, port);
	app.use(utils.notFound);
};