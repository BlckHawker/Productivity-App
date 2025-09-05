import { Request, Response } from 'express';
import * as taskController from "../controllers/task" 
import * as utils from "../utils"
import { StatusCode } from 'status-code-enum'

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
 *       - Task
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


/**
 * Create task request
 * @param {Request} req 
 * @param {Response} res 
 * @returns 
 */
const createTask = async (req: Request, res: Response): Promise<Response> => {

    // validate arguments
    const name = (typeof req.body.name === 'string') ? req.body.name : '';
    const complete = (typeof req.body.complete === 'boolean') ? req.body.complete : false;
    const validArgs = utils.assertArgumentsString({ name });
    if (!validArgs.success) return res.status(StatusCode.ClientErrorBadRequest).json(validArgs);

    const response = await taskController.createTaskController(req.prisma)(name,complete);

    if (response instanceof Error && response.message.includes(`Unique constraint failed on the fields: (\`name\`)`)) {
        return res.status(StatusCode.ClientErrorConflict).json({ 
        message: `A task named "${name}" already exists.` 
    });
}
    return utils.sanitizeResponse(response, res, 'Could not create task'); //todo verify this message404 make sense
};

export {
    getAllTasks,
    createTask
}

/**
 * @swagger
 * /createTask:
 *   post:
 *     summary: Create a task
 *     description: Creates a new task in the database.
 *     tags:
 *       - Task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "wash the dishes"
 *               complete:
 *                 type: boolean
 *                 description: Whether the task is complete (defaults to false if not provided)
 *                 example: false
 *     responses:
 *       200:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 2
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-08-26T18:46:37.972Z"
 *                 name:
 *                   type: string
 *                   example: "wash the dishes"
 *                 complete:
 *                   type: boolean
 *                   example: false
 *       409:
 *          description: Task name already exists
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                              example: A task named "laundry" already exists.
 */
