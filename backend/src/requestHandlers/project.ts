import { Request, Response } from 'express';
import * as utils from "../utils"
import { StatusCode } from 'status-code-enum'
import * as projectController from "../controllers/project"
// Get project by id
// Get project by name

/**
 * Create project request
 * @param {Request} req 
 * @param {Response} res 
 * @returns 
 */
const createProject = async (req: Request, res: Response) => {
    // validate arguments
    const name = (typeof req.body.name === 'string') ? req.body.name.trim() : '';
    const color = (typeof req.body.color === 'string') ? req.body.color.trim() : '';

    const validArgs = utils.mergeResults(
        utils.assertArgumentsString({ name }),
        utils.assertArgumentsHexCode({ color })
    )
    if (!validArgs.success) return res.status(StatusCode.ClientErrorBadRequest).json(validArgs);

    const response = await projectController.createProject(req.prisma)(name,color);
    return utils.sanitizeResponse(response, res, "Contact developers if this line appears. createProject request handler");

};
/**
 * @swagger
 * /createProject:
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
 */

export {
    createProject
}