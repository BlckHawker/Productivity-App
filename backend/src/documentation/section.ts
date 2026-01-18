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
 *     responses:
 *       200:
 *         description: Section successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Section"
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "A project with the id 1 does not exist"
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
 *               $ref: "#/components/schemas/Section"
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
 *               invalidProjectId:
 *                 summary: project_id is either missing or not an integer
 *                 value:
 *                   success: false
 *                   message: "Invalid project_id: must be typeof integer"
 *               invalidSection:
 *                 summary: An "Other" section is requested to move
 *                 value:
 *                   success: false
 *                   message: "Can not move \"Other\" section to a different project"
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               projectId:
 *                 summary: Project with given id is not in database
 *                 value:
 *                   message: "A project with the id 1 does not exist"
 *               sectionId:
 *                 summary: Section with given id is not in database
 *                 value:
 *                   message: "A section with the id 1 does not exist"
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
 *               sameProject:
 *                 summary: Attempting to move section in current project
 *                 value:
 *                   message: "Cannot move section \"Budget\" (id: 205) to project \"fda\" (id: 110). Section already exists in that project"
 *               maxSections:
 *                 summary: Target project can't store any more sections
 *                 value:
 *                   message: "Cannot move section \"Budget\" (id: 205) to project \"fda\" (id: 110). Project already has max amount of sections (100)"
 *               sameName:
 *                 summary: Target project already has a section with the moving section's name
 *                 value:
 *                   message: "Cannot move section \"Budget\" (id: 205) to project \"fda\" (id: 110). A section within that project already has that name."
 */