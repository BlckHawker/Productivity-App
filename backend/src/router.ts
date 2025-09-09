/**
 * Route all incoming requests
 */
import * as utils from "./utils";
import { Express } from "express";
import cors from "cors";
import * as project from "./requestHandlers/project";

import swaggerDocs from "./swagger.js";
import { port } from "./server";

export default (app: Express) => {
	app.use(cors());
	app.post("/project/create", project.createProject);
	app.get("/projects", project.getAllProjects);
	app.get("/project/:id", project.getProjectById),
	app.get("/project", project.getProjectByName);

	swaggerDocs(app, port);
	app.use(utils.notFound);
};