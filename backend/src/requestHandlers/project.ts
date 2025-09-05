import { Request, Response } from 'express';
import * as utils from "../utils"
import { StatusCode } from 'status-code-enum'
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
    const name = (typeof req.body.name === 'string') ? req.body.name : '';
    const color = (typeof req.body.color === 'string') ? req.body.color : '';

    const validArgs = utils.mergeResults(
        utils.assertArgumentsString({ name }),
        utils.assertArgumentsHexCode({ color })
    )
    if (!validArgs.success) return res.status(StatusCode.ClientErrorBadRequest).json(validArgs);
    return utils.sanitizeResponse([], res, 'debug response'); //todo change this

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