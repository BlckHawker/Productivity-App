/**
 * Route all incoming requests
 */
import * as utils from "./utils.js"
import { Express } from 'express';
import cors from 'cors';
import * as task from './requestHandlers/task.js'

export default (app: Express) => {
    app.use(cors());
    app.get('/task', task.getAllTasks);
    app.post('/createTask', task.createTask);
    app.use(utils.notFound);
};