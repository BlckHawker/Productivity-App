/**
 * Route all incoming requests
 */
import * as task from "./requestHandlers/task.js";
import * as utils from "./utils.js";
import { Express } from "express";
import cors from "cors";

export default (app: Express) => {
	app.use(cors());
	app.get("/task", task.getAllTasks);
	app.post("/createTask", task.createTask);
	app.use(utils.notFound);
};