/**
 * Route all incoming requests
 */
import * as utils from "./utils"
import { Express } from 'express';
import cors from 'cors';
import * as task from './requestHandlers/task'
import * as project from './requestHandlers/project'

import swaggerDocs from "./swagger.js";
import { port } from "./server";

export default (app: Express) => {
    app.use(cors());
    app.post('/createProject', project.createProject)
    swaggerDocs(app, port)
    app.use(utils.notFound);
};