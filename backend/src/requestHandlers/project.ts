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

export {
    getAllProjects,
    createProject,
    getProjectById,
    getProjectByName,
    updateProject,
    deleteProjectById
};
