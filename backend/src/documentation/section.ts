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
 *               - project_id
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
 *                      $ref: "#/components/schemas/Section"
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
 *               $ref: "#/components/schemas/Section"
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
 *                 $ref: "#/components/schemas/Section"
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
 * @swagger
 * /sections:
 *   get:
 *     summary: Get all sections
 *     description: Fetches all sections from the database.
 *     tags:
 *       - Section
 *     responses:
 *       200:
 *         description: A list of sections
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Section"
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