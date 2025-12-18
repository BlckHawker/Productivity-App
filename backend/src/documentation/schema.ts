/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         color:
 *           type: string
 *           example: "#FF5733"
 *         name:
 *           type: string
 *           example: "School"
 *         sections:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/Section"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-01-15T10:24:00.000Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2025-01-15T10:26:41.000Z"
 *       required:
 *         - id
 *         - color
 *         - name
 *         - created_at
 *         - updated_at
 *  
 *     Section:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 10
 *         project_id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Math"
 *         is_other:
 *           type: boolean
 *           example: false
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-01-15T10:25:00.000Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2025-01-15T10:26:41.000Z"
 *       required:
 *         - id
 *         - project_id
 *         - name
 *         - is_other
 *         - created_at
 *         - updated_at
 */ 