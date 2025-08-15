import { Request, Response } from 'express';
import * as taskController from "../controllers/task" 
import * as utils from "../utils"

const getAllTasks = async (req: Request, res: Response): Promise<Response> => {
    const response = await taskController.getAllTasksController(req.prisma);
    return utils.sanitizeResponse(response, res, 'No tasks were found');
};

const createTask = async (req: Request, res: Response): Promise<Response> => {

    // validate arguments
    const name = (typeof req.body.name === 'string') ? req.body.name : '';
    const complete = (typeof req.body.complete === 'boolean') ? req.body.complete : false;
    const validArgs = utils.assertArgumentsString({ name });
    if (!validArgs.success) return res.status(400).json(validArgs);

    const response = await taskController.createTaskController(req.prisma)(name,complete);
    return utils.sanitizeResponse(response, res, 'Could not create task'); //todo verify this message404 make sense
};

export {
    getAllTasks,
    createTask
}