/**
 * Route all incoming requests
 */
import * as utils from "./utils.js"
import { Express } from 'express';
import cors from 'cors';
import * as task from './requestHandlers/task.js'
import swaggerDocs from "./swagger/swagger.js";
import { port } from "./server.js";

export default (app: Express) => {
    app.use(cors());
    app.get('/task', task.getAllTasks);
    app.post('/createTask', task.createTask);
    swaggerDocs(app, port)
    app.use(utils.notFound);
};