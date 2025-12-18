/**
 * App router.
 *
 * Sets up all project and section routes, applies middleware,
 * and loads the Swagger docs. Connects each endpoint to its
 * corresponding request handler.
 */

import * as project from "./requestHandlers/project";
import * as section from "./requestHandlers/section";

import * as utils from "./utils";
import { Express } from "express";
import cors from "cors";
import { port } from "./server";
import swaggerDocs from "./swagger.js";

export default (app: Express) => {
	app.use(cors());
	app.get("/projects", project.getAllProjects);
	app.delete("/project/:id", project.deleteProjectById);
	app.get("/project/:id", project.getProjectById);
	app.get("/project", project.getProjectByName);
	app.post("/project/create", project.createProject);
	app.put("/project/update", project.updateProject);
	app.get("/section/:id", section.getSectionById);
	app.get("/sections/", section.getAllSections);
	app.get("/project/sections/:id", section.getAllSectionsInProject);
	app.post("/section/create", section.createSection);
	app.put("/section/changeName", section.changeSectionName)
	app.put("/section/changeProject", section.moveSectionToProject)
	swaggerDocs(app, port);
	app.use(utils.notFound);
};
