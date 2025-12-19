/**
 * Section request handler layer.
 *
 * Defines Express route handlers for creating, fetching, updating,
 * and moving sections. Performs request validation, forwards logic to
 * the section controller, and returns consistent HTTP responses
 * for success, validation errors, and controller-level errors.
 */

import * as sectionController from "../controllers/section";
import * as utils from "../utils";
import { Request, Response } from "express";
import { StatusCode } from "status-code-enum";

/**
 * Delete section by id request
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
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
 * Handles the creation of a new section within a project.
 *
 * Validates the request body, forwards the request to the section controller,
 * and returns appropriate HTTP responses based on validation errors,
 * controller errors, or successful section creation.
 *
 * @param req - Express request object containing `name` and `project_id` in the body.
 * @param res - Express response object used to return JSON responses.
 * @returns A Promise resolving to the HTTP response sent to the client.
 */
const changeSectionName = async (req: Request, res: Response) => {
	const new_name = req.body && typeof req.body?.new_name === "string" ? req.body?.new_name.trim() : "";
	const section_id = req.body && typeof req.body?.section_id === "number" ? Number(req.body?.section_id) : NaN;
	
	const validArgs = utils.mergeResults(
		utils.assertArgumentsString({ new_name }),
		utils.assertArgumentsNumber({ section_id })
	);

	if (!validArgs.success)
		return res.status(StatusCode.ClientErrorBadRequest).json(validArgs);

	const response = await sectionController.changeSectionName(req.prisma)(
		section_id,new_name
	);

	if(response instanceof Error && response.message.match(/A section within the project named ".+" \(id: .+\) already has a section named ".+"\. Cannot change the section named ".+" \(id: .+\) to ".+"/)) {
		return res.status(StatusCode.ClientErrorConflict).json({message: response.message});
	}

	return utils.sanitizeResponse(
		response,
		res,
		"Contact developers if this line appears. changeSectionName request handler"
	);
};
/**
 * @swagger
 * /section/changeName:
 *   put:
 *     summary: Change the name of an existing section (case insensitive)
 *     tags:
 *       - Section
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - section_id
 *               - new_name
 *             properties:
 *               new_name:
 *                 type: string
 *                 description: The new name of the section
 *                 example: "Budget"
 *               section_id:
 *                 type: number
 *                 description: The id of the section of the name to be changed
 *                 example: 1
 *     responses:
 *       200:
 *         description: Successful response with updated section data
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
 *       400:
 *         description: Invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             examples:
 *               invalidSectionId:
 *                 summary: section_id is either missing or not an integer
 *                 value:
 *                   success: false
 *                   message: "Invalid section_id: must be a valid number"
 *               invalidNewName:
 *                 summary: new_name is either missing or not a string
 *                 value:
 *                   success: false
 *                   message: "Invalid new_name: must be typeof string"
 *       404:
 *          description: Section could not be found
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                              example: "A section with the id 1 does not exist"
 *       409:
 *         description: A section within the same project already has the new name
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "A section within the project named \"School\" (id: 1) already has a section named \"Math\". Cannot change the section named \"Algebra\" (id: 1) to \"Math\""
 */

/**
 * Moves a section from one project into another.
 *
 * Validates the request body, then calls the controller to perform the move.
 * Returns detailed error statuses for:
 * - missing/invalid IDs,
 * - non-existent section or project,
 * - attempting to move to the same project,
 * - exceeding section limits,
 * - or name conflicts within the destination project.
 *
 * @param req - Express request object containing `section_id` and `project_id` in the body.
 * @param res - Express response object used to return JSON responses.
 * @returns A Promise resolving to the HTTP response sent to the client.
 */
const moveSectionToProject = async (req: Request, res: Response) => {
	const section_id = req.body && typeof req.body?.section_id === "number" ? Number(req.body?.section_id) : NaN;
	const project_id = req.body && typeof req.body?.project_id === "number" ? Number(req.body?.project_id) : NaN;

	const validArgs = utils.mergeResults(
		utils.assertArgumentsNumber({ project_id }),
		utils.assertArgumentsNumber({ section_id })
	);

	if (!validArgs.success)
		return res.status(StatusCode.ClientErrorBadRequest).json(validArgs);

	const response = await sectionController.moveSectionToProject(req.prisma)(section_id, project_id);

	const notFoundMatches = [/A section with the id .+ does not exist/, /A project with the id .+ does not exist/];
	const conflictMatches = [/Cannot move section ".+" \(id: .+\) to project ".+" \(id: .+\)\. Section already exists in that project/,
		/Cannot move section ".+" \(id: .+\) to project ".+" \(id: .+\)\. Project already has max amount of sections \(.+\)/,
		/Cannot move section ".+" \(id: .+\) to project ".+" \(id: .+\)\. A section within that project already has that name\./
	]

	if(response instanceof Error) {
		if(notFoundMatches.some(reg => response.message.match(reg))) {
			return res.status(StatusCode.ClientErrorNotFound).json({message: response.message});
		}

		if(conflictMatches.some(reg => response.message.match(reg))) {
			return res.status(StatusCode.ClientErrorConflict).json({message: response.message});
		}
	}

	return utils.sanitizeResponse(
		response,
		res,
		"Contact developers if this line appears. moveSectionToProject request handler"
	);


}
/**
 * @swagger
 * /section/changeProject:
 *   put:
 *     summary: Change a section's project
 *     tags:
 *       - Section
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - section_id
 *               - project_id
 *             properties:
 *               project_id:
 *                 type: number
 *                 description: The id of the project that the section will be moved to
 *                 example: 1
 *               section_id:
 *                 type: number
 *                 description: The id of the section that will be moved
 *                 example: 1
 *     responses:
  *       200:
 *         description: Successful response with updated section data
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
 *       400:
 *         description: Invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: number
 *             examples:
 *               invalidSectionId:
 *                 summary: section_id is either missing or not an integer
 *                 value:
 *                   success: false
 *                   message: "Invalid section_id: must be a valid number"
 *               invalidNewName:
 *                 summary: project_id is either missing or not an integer
 *                 value:
 *                   success: false
 *                   message: "Invalid project_id: must be typeof integer"
 *       404:
 *          description: Not found
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                  examples:
 *                    projectId:
 *                      summary: Project with given id is not in database 
 *                      value:
 *                        message: "A project with the id 1 does not exist"
 *                    sectionId:
 *                      summary: Section with given id is not in database
 *                      value:
 *                        message: "A section with the id 1 does not exist"
 *       409:
 *          description: Conflict
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                  examples:
 *                    sameProject:
 *                      summary: Attempting to move section in current project
 *                      value:
 *                        message: "Cannot move section \"Budget\" (id: 205) to project \"fda\" (id: 110). Section already exists in that project"
 *                    maxSections:
 *                      summary: Target project can't store any more sections
 *                      value:
 *                        message: "Cannot move section \"Budget\" (id: 205) to project \"fda\" (id: 110). Project already has max amount of sections (100)"
 *                    sameName:
 *                      summary: Target project already has a section with the moving section's name (case-insensitive)
 *                      value:
 *                        message: "Cannot move section \"Budget\" (id: 205) to project \"fda\" (id: 110). A section within that project already has that name."
 */


export {
	createSection,
	getSectionById,
	getAllSectionsInProject,
	getAllSections,
	changeSectionName,
	moveSectionToProject,
	deleteSectionById
};
