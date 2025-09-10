import * as project from "./requestHandlers/project";
import * as utils from "./utils";
import { Express } from "express";
import cors from "cors";
import { port } from "./server";
import swaggerDocs from "./swagger.js";

export default (app: Express) => {
	app.use(cors());
	app.post("/project/create", project.createProject);
	app.post("/project/update", project.updateProject);
	app.get("/projects", project.getAllProjects);
	app.get("/project/:id", project.getProjectById);
	app.get("/project", project.getProjectByName);

	swaggerDocs(app, port);
	app.use(utils.notFound);
};
