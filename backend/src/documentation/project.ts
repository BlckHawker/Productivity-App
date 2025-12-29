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
 *         description: Project and default \"Other\" section successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               minItems: 2
 *               maxItems: 2
 *               items:
 *                 allOf:
 *                   - $ref: "#/components/schemas/Project"
 *                   - $ref: "#/components/schemas/Section"
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
 *             oneOf:
 *               - type: object
 *                 required: [id, name]
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "NEW NAME"
 *                 description: Update only the project name
 *  
 *               - type: object
 *                 required: [id, color]
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   color:
 *                     type: string
 *                     example: "#FFF"
 *                 description: Update only the project color
 *   
 *               - type: object
 *                 required: [id, name, color]
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "NEW NAME"
 *                   color:
 *                     type: string
 *                     example: "#FFF"
 *                 description: Update both the project name and color
 *     responses:
 *       200:
 *         description: The project with its updated values
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Project"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

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
 *               $ref: "#/components/schemas/Project"
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
 *               $ref: "#/components/schemas/Project"
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
 *               $ref: "#/components/schemas/Project"
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
 *                 $ref: "#/components/schemas/Project"
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
 *               $ref: "#/components/schemas/Project"
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