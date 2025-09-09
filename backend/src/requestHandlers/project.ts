import * as projectController from "../controllers/project";
import * as utils from "../utils";
import { Request, Response } from "express";
import { StatusCode } from "status-code-enum";


/**
 * Get all projects request
 * @param {Request} req 
 * @param {Response} res 
 * @returns 
 */
const getAllProjects = async (req: Request, res: Response) => {
	const response = await projectController.getAllProjects(req.prisma);
	return utils.sanitizeResponse(response, res, "No projects were found");
};

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get all projects
 *     description: Fetches all projects from the database.
 *     tags:
 *       - Project
 *     responses:
 *       200:
 *         description: A list of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   color:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *             example:
 *               - id: 1
 *                 name: "Movies"
 *                 color: "#FF5733"
 *                 created_at: "2025-09-07T17:34:03.434Z"
 *                 updated_at: "2025-09-07T17:34:03.434Z" 
 *               - id: 2
 *                 name: "Movies"
 *                 color: "#ff33e7ff"
 *                 created_at: "2025-09-07T17:34:03.434Z"
 *                 updated_at: "2025-09-07T17:34:03.434Z" 
 *       404:
 *         description: No projects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No projects were found"
 */

/**
 * Get project by name request
 * @param {Request} req 
 * @param {Response} res 
 * @returns 
 */
const getProjectByName = async (req: Request, res: Response) => {
	const name = String(req.query.name).trim();
	const validArgs = utils.assertArgumentsString({ name });
	if (!validArgs.success) return res.status(StatusCode.ClientErrorBadRequest).json(validArgs);
	const response = await projectController.getProjectByName(req.prisma)(name);
	return utils.sanitizeResponse(response, res, `A project with the name "${name}" could not be found.`);
};
/**
 * @swagger
 * /project:
 *   get:
 *     summary: Get a project by name
 *     description: Get a project by its name (case insensitive)
 *     tags:
 *       - Project
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *           example: "Work"
 *         required: true
 *         description: name of the project to get
 *     responses:
 *       200:
 *         description: Successful response with project data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: Work
 *                 color:
 *                   type: string
 *                   example: "#FF5733"
 *                 created_at:
 *                   type: string
 *                   example: "2025-09-07T17:34:03.434Z"
 *                 updated_at:
 *                   type: string
 *                   example: "2025-09-07T17:34:03.434Z"
 *       404:
 *         description: Project not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "A project with the name \"Work\" could not be found."
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid name: must be a valid string"
 */

/**
 * Get project by id request
 * @param {Request} req 
 * @param {Response} res 
 * @returns 
 */
const getProjectById = async (req: Request, res: Response) => {
	const id = Number(req.params.id);
	const validArgs = utils.assertArgumentsNumber({ id });
	if (!validArgs.success) return res.status(StatusCode.ClientErrorBadRequest).json(validArgs);
	const response = await projectController.getProjectById(req.prisma)(id);
	return utils.sanitizeResponse(response, res, `A project with the id "${id}" could not be found.`);
};
/**
 * @swagger
 * /project/{id}:
 *   get:
 *     summary: Get a project by id
 *     description: Get a project by its id
 *     tags:
 *       - Project
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           example: 1
 *         required: true
 *         description: Numeric id of the project to get
 *     responses:
 *       200:
 *         description: Successful response with project data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: Work
 *                 color:
 *                   type: string
 *                   example: "#FF5733"
 *                 created_at:
 *                   type: string
 *                   example: "2025-09-07T17:34:03.434Z"
 *                 updated_at:
 *                   type: string
 *                   example: "2025-09-07T17:34:03.434Z"
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "A project with the id \"1\" could not be found."
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid id: must be a valid number"
 */

/**
 * Create project request
 * @param {Request} req 
 * @param {Response} res 
 * @returns 
 */
const createProject = async (req: Request, res: Response) => {
	const name = (typeof req.body.name === "string") ? req.body.name.trim() : "";
	const color = (typeof req.body.color === "string") ? req.body.color.trim() : "";

	const validArgs = utils.mergeResults(
		utils.assertArgumentsString({ name }),
		utils.assertArgumentsHexCode({ color })
	);
	if (!validArgs.success) return res.status(StatusCode.ClientErrorBadRequest).json(validArgs);

	const response = await projectController.createProject(req.prisma)(name,color);

	if(response instanceof Error) {
		if(response.message.includes("Unique constraint failed on the fields: (`name`)")) {
			return res.status(StatusCode.ClientErrorConflict).json({ 
				message: `A project named "${name}" already exists.` 
			});
		}

		if(response.message.includes("Reached maximum amount of projects")) {
			return res.status(StatusCode.ClientErrorConflict).json({ 
				message: response.message 
			});
		}
	}

	return utils.sanitizeResponse(response, res, "Contact developers if this line appears. createProject request handler");

};
/**
 * @swagger
 * /project/create:
 *   post:
 *     summary: Create a project
 *     description: Creates a new project in the database.
 *     tags:
 *       - Project
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
 *                 example: "Work"
 *               color:
 *                 type: string
 *                 description: hex code of the color related to this project
 *                 example: "#f00"
 *     responses:
 *       200:
 *          description: Project successfully created
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: number
 *                              example: 1
 *                          color:
 *                              type: string
 *                              example: "#f00"
 *                          name:
 *                              type: string
 *                              example: "Work"
 *                          created_at:
 *                              type: string
 *                              example: "2025-09-05T23:03:57.213Z"
 *                          updated_at:
 *                              type: string
 *                              example: "2025-09-05T23:03:57.213Z"
 *       400:
 *          description: Bad Request
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          success:
 *                              type: boolean
 *                              example: false
 *                          message:
 *                              type: string
 *                              example: "Invalid name: must be typeof string \nInvalid color: must be a valid hex color (e.g. #000 or #000000)"
 *       409:
 *         description: Conflict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               existingProject:
 *                 summary: Project already exists
 *                 value:
 *                   message: A project named "name" already exists.
 *               maxProjects:
 *                 summary: Max projects reached
 *                 value:
 *                   message: Reached maximum amount of projects
 */

export {
	getAllProjects,
	createProject,
	getProjectById,
	getProjectByName
};