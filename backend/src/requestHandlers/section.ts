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

	if(response instanceof Error && response.message == `Can not change the name of "Other" section`) {
		return res.status(StatusCode.ClientErrorBadRequest).json({message: response.message});
	}



	return utils.sanitizeResponse(
		response,
		res,
		"Contact developers if this line appears. changeSectionName request handler"
	);
};
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

		if(response.message == `Can not move "Other" section to a different project`) {
			return res.status(StatusCode.ClientErrorBadRequest).json({message: response.message});
		}
	}

	return utils.sanitizeResponse(
		response,
		res,
		"Contact developers if this line appears. moveSectionToProject request handler"
	);


}


export {
	createSection,
	getSectionById,
	getAllSectionsInProject,
	getAllSections,
	changeSectionName,
	moveSectionToProject,
	deleteSectionById
};
