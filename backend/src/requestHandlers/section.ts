import * as sectionController from "../controllers/section";
import * as utils from "../utils";
import { Request, Response } from "express";
import { StatusCode } from "status-code-enum";

//todo add header comment
const deleteSectionById = async (req: Request, res: Response) => {
	const id = Number(req.params.id);
	
	const validId = utils.assertArgumentsNumber({ id });
	if (!validId.success) {
		return res.status(StatusCode.ClientErrorBadRequest).json(validId);
	}

	const response = await sectionController.deleteSectionById(req.prisma)(id);

	return utils.sanitizeResponse(
		response,
		res,
		`A section with the id "${id}" could not be found.`
	);
};

/**
 * Create section request
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
const createSection = async (req: Request, res: Response) => {
	const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
	const projectId =
		typeof req.body.project_id === "number" ? Number(req.body.project_id) : NaN;

	const validArgs = utils.mergeResults(
		utils.assertArgumentsString({ name }),
		utils.assertArgumentsNumber({ projectId })
	);
	if (!validArgs.success)
		return res.status(StatusCode.ClientErrorBadRequest).json(validArgs);

	const response = await sectionController.createSection(req.prisma)(
		projectId,
		name
	);

	if (response instanceof Error) {
		if (
			response.message.match(
				/A section with the name ".+" already exists within the project ".+"/
			)
		) {
			return res.status(StatusCode.ClientErrorConflict).json({
				message: response.message
			});
		}

		if (response.message.includes("Reached maximum amount of sections")) {
			return res.status(StatusCode.ClientErrorConflict).json({
				message: response.message
			});
		}
	}

	return utils.sanitizeResponse(
		response,
		res,
		"Contact developers if this line appears. createSection request handler"
	);
};
/**
 * @swagger
 * /section/create:
 *   post:
 *     summary: Create a section
 *     description: Create a section within a project.
 *     tags:
 *       - Section
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
 *                 example: "Math"
 *               project_id:
 *                 type: number
 *                 description: The id of the project for this section to fall under
 *                 example: 1
 *
 *     responses:
 *       200:
 *          description: Section successfully created
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: number
 *                              example: 1
 *                          project_id:
 *                              type: number
 *                              example: 2
 *                          name:
 *                              type: string
 *                              example: "Math"
 *                          created_at:
 *                              type: string
 *                              example: "2025-09-05T23:03:57.213Z"
 *                          updated_at:
 *                              type: string
 *                              example: "2025-09-05T23:03:57.213Z"
 *       404:
 *          description: Not found
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                              example: "A project with the id 1 does not exist"
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
 *               existingSection:
 *                 summary: Section already exists within project
 *                 value:
 *                   message: A section with the name "Math" already exists within the project "Work"
 *               maxSections:
 *                 summary: Attempt to go over max section threshold within a project
 *                 value:
 *                   message: Reached maximum amount of sections (100) for the project "Other"
 */

/**
 * Get section by id request
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
const getSectionById = async (req: Request, res: Response) => {
	const id = Number(req.params.id);
	const validArgs = utils.assertArgumentsNumber({ id });
	if (!validArgs.success)
		return res.status(StatusCode.ClientErrorBadRequest).json(validArgs);
	const response = await sectionController.getSectionById(req.prisma)(id);
	return utils.sanitizeResponse(
		response,
		res,
		`A section with the id "${id}" could not be found.`
	);
};
/**
 * @swagger
 * /section/{id}:
 *   get:
 *     summary: Get a section by id
 *     description: Get a section by its id
 *     tags:
 *       - Section
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           example: 1
 *         required: true
 *         description: Numeric id of the section to get
 *     responses:
 *       200:
 *         description: Successful response with section data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   example: 1
 *                 project_id:
 *                   type: number
 *                   example: 2
 *                 name:
 *                   type: string
 *                   example: "Math"
 *                 created_at:
 *                   type: string
 *                   example: "2025-09-05T23:03:57.213Z"
 *                 updated_at:
 *                   type: string
 *                   example: "2025-09-05T23:03:57.213Z"
 *
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "A section with the id \"1\" could not be found."
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
 * Get all sections in project request
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
const getAllSectionsInProject = async (req: Request, res: Response) => {
	const id = Number(req.params.id);
	const validArgs = utils.assertArgumentsNumber({ id });
	if (!validArgs.success)
		return res.status(StatusCode.ClientErrorBadRequest).json(validArgs);
	const response = await sectionController.getAllSectionsInProject(req.prisma)(
		id
	);
	return utils.sanitizeResponse(
		response,
		res,
		`No sections were found in the project with the id of ${id}`
	);
};

/**
 * @swagger
 * /project/sections/{id}:
 *   get:
 *     summary: Get all project sections
 *     description: Fetches all sections from a certain project projects from the database.
 *     tags:
 *       - Section
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           example: 1
 *         required: true
 *         description: Numeric id of the project to get all the sections of
 *     responses:
 *       200:
 *         description: A list of sections within a certain project
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
 *               - id: 104
 *                 project_id: 6
 *                 is_other: true
 *                 name: "Other"
 *                 created_at: "2025-09-07T17:34:03.434Z"
 *                 updated_at: "2025-09-07T17:34:03.434Z"
 *               - id: 105
 *                 project_id: 6
 *                 is_other: false
 *                 name: "Movies"
 *                 created_at: "2025-09-07T17:34:03.434Z"
 *                 updated_at: "2025-09-07T17:34:03.434Z"
 *       404:
 *          description: Not found
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                              example: "A project with the id 1 does not exist"
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
 * Get all sections request
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
const getAllSections = async (req: Request, res: Response) => {
	const response = await sectionController.getAllSections(req.prisma);
	return utils.sanitizeResponse(response, res, "No sections were found");
};
/**
 * @swagger
 * /sections:
 *   get:
 *     summary: Get all sections
 *     description: Fetches all sections from the database.
 *     tags:
 *       - Section
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
 *               - id: 104
 *                 project_id: 6
 *                 is_other: true
 *                 name: "Other"
 *                 created_at: "2025-09-07T17:34:03.434Z"
 *                 updated_at: "2025-09-07T17:34:03.434Z"
 *               - id: 105
 *                 project_id: 7
 *                 is_other: false
 *                 name: "Movies"
 *                 created_at: "2025-09-07T17:34:03.434Z"
 *                 updated_at: "2025-09-07T17:34:03.434Z"
 *       404:
 *         description: No sections
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No sections were found"
 */

export {
	createSection,
	getSectionById,
	getAllSectionsInProject,
	getAllSections
};
