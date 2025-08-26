import { Request, Response } from 'express';
import * as taskController from "../controllers/task" 
import * as utils from "../utils"

/**
 * Get All Tasks request
 * @param {Request} req 
 * @param {Response} res 
 * @returns 
 */
const getAllTasks = async (req: Request, res: Response): Promise<Response> => {
    const response = await taskController.getAllTasksController(req.prisma);
    return utils.sanitizeResponse(response, res, 'No tasks were found');
};

/**
 * @swagger
 * /task:
 *   get:
 *     summary: Get all tasks
 *     description: Fetches all tasks from the database.
 *     tags:
 *       - Tasks
 *     responses:
 *       200:
 *         description: A list of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   name:
 *                     type: string
 *                   complete:
 *                     type: boolean
 *             example:
 *               - id: 2
 *                 createdAt: "2025-08-26T18:46:37.972Z"
 *                 name: "wash the dishes"
 *                 complete: false
 *               - id: 3
 *                 createdAt: "2025-08-26T19:00:12.111Z"
 *                 name: "laundry"
 *                 complete: true
 *       404:
 *         description: No tasks were found
 */

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