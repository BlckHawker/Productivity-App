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
    const projectId = typeof req.body.project_id === "number" ? Number(req.body.project_id) : NaN;

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

        if(response.message.match(/A section with the name ".+" already exists within the project ".+"/)) {
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
export {
	createSection
};