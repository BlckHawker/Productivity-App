/**
 * Project request handler layer.
 *
 * Defines Express route handlers for creating, fetching, updating,
 * and moving projects. Performs request validation, forwards logic to
 * the project controller, and returns consistent HTTP responses
 * for success, validation errors, and controller-level errors.
 */
import * as projectController from "../controllers/project";
import * as utils from "../utils";
import { Request, Response } from "express";
import { StatusCode } from "status-code-enum";

/**
 * delete project by id request
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
const deleteProjectById = async (req: Request, res: Response) => {
	const id = Number(req.params.id);
	const validId = utils.assertArgumentsNumber({ id });
	if (!validId.success) {
		return res.status(StatusCode.ClientErrorBadRequest).json(validId);
	}

	const response = await projectController.deleteProjectById(req.prisma)(id);

	return utils.sanitizeResponse(
		response,
		res,
		`A project with the id "${id}" could not be found.`
	);
};
/**
 * @swagger
 * /project/{id}:
 *   delete:
 *     summary: Delete a project by id
 *     description: delete a project by its id
 *     tags:
 *       - Project
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           example: 1
 *         required: true
 *         description: Numeric id of the project to delete
 *     responses:
 *       200:
 *         description: the project data deleted
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
 * Update project request
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
const updateProject = async (req: Request, res: Response) => {
	const id = typeof req.body.id === "number" ? req.body.id : NaN;
	const newName = typeof req.body.name === "string" ? req.body.name.trim() : "";
	const newColor =
		typeof req.body.color === "string" ? req.body.color.trim() : "";
	const validId = utils.assertArgumentsNumber({ id });
	const validName = utils.assertArgumentsString({ newName });
	const validColor = utils.assertArgumentsString({ newColor });
	const invalidName = !validName.success;
	const invalidColor = !validColor.success;

	if (!validId.success) {
		return res.status(StatusCode.ClientErrorBadRequest).json(validId);
	}

	if (invalidName && invalidColor) {
		return res
			.status(StatusCode.ClientErrorBadRequest)
			.json({ message: `${validName.message}\n${validColor.message}` });
	}

	const response = await projectController.updateProject(req.prisma)(id, {
		name: invalidName ? null : newName,
		color: invalidColor ? null : newColor
	});

	if (response instanceof Error) {
		const badRequestStr = [
			"A project with the id",
			"Cannot update a project with the same values it currently has.",
			"Updated project name must be different from the current name.",
			"Updated project color must be different from the current color.",
			"Updated project color must be different from the current color.",
			"A project with the name"
		];
		if (badRequestStr.some((str) => response.message.includes(str))) {
			return res.status(StatusCode.ClientErrorBadRequest).json({
				message: response.message
			});
		}
	}

	return utils.sanitizeResponse(
		response,
		res,
		"Contact developers if this line appears. updateProject request handler"
	);
};
/**
 * @swagger
 * /project/update:
 *   put:
 *     summary: Update a project given its id
 *     tags:
 *       - Project
  *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: number
 *                 description: The id of the project that wants to be updated
 *                 example: 1
 *               name:
 *                 type: string
 *                 description: The new name of the project
 *                 example: "Gym"
 *               color:
 *                 type: string
 *                 description: The new color of the project
 *                 example: "#FF5733"
 *     responses:
 *       200:
 *         description: The project with its updated values
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
 *                   example: Gym
 *                 color:
 *                   type: string
 *                   example: "#FF5733"
 *                 created_at:
 *                   type: string
 *                   example: "2025-09-07T17:34:03.434Z"
 *                 updated_at:
 *                   type: string
 *                   example: "2025-09-07T17:34:03.434Z"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               invalid id:
 *                 value:
 *                   message: "Invalid id: must be a valid number"
 *               same color and name:
 *                 value:
 *                   message: "Cannot update a project with the same values it currently has."
 *               project with id doesn't exist:
 *                 value:
 *                   message: "A project with the id \"1\" could not be found."
 *               same name:
 *                 value:
 *                   message: "Updated project name must be different from the current name."
 *               same color:
 *                 value:
 *                   message: "Updated project color must be different from the current color."
  *               change name to a project that already has that name:
 *                 value:
 *                   message: "A project with the name \"Gym\" already exists"

 */

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
	if (!validArgs.success)
		return res.status(StatusCode.ClientErrorBadRequest).json(validArgs);
	const response = await projectController.getProjectByName(req.prisma)(name);
	return utils.sanitizeResponse(
		response,
		res,
		`A project with the name "${name}" could not be found.`
	);
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
	if (!validArgs.success)
		return res.status(StatusCode.ClientErrorBadRequest).json(validArgs);
	const response = await projectController.getProjectById(req.prisma)(id);
	return utils.sanitizeResponse(
		response,
		res,
		`A project with the id "${id}" could not be found.`
	);
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
	const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
	const color = typeof req.body.color === "string" ? req.body.color.trim() : "";

	const validArgs = utils.mergeResults(
		utils.assertArgumentsString({ name }),
		utils.assertArgumentsHexCode({ color })
	);
	if (!validArgs.success)
		return res.status(StatusCode.ClientErrorBadRequest).json(validArgs);

	const response = await projectController.createProject(req.prisma)(
		name,
		color
	);

	if (response instanceof Error) {
		if (
			response.message.includes(
				"Unique constraint failed on the fields: (`name`)"
			)
		) {
			return res.status(StatusCode.ClientErrorConflict).json({
				message: `A project named "${name}" already exists.`
			});
		}

		if (response.message.includes("Reached maximum amount of projects")) {
			return res.status(StatusCode.ClientErrorConflict).json({
				message: response.message
			});
		}
	}

	return utils.sanitizeResponse(
		response,
		res,
		"Contact developers if this line appears. createProject request handler"
	);
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
	getProjectByName,
	updateProject,
	deleteProjectById
};
