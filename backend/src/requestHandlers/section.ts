import * as sectionController from "../controllers/section";
import * as utils from "../utils";
import { Request, Response } from "express";
import { StatusCode } from "status-code-enum";
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

export {
	createSection,
	getSectionById,
	getAllSectionsInProject,
	getAllSections
};
