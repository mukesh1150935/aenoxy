/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         profiile:
 *           type: string
 *     Course:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         level:
 *           type: integer
 *         price:
 *           type: number
 *         photo:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 * 
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '201':
 *         description: User registered successfully
 *       '400':
 *         description: Email already exists
 *       '500':
 *         description: Internal server error
 * 
 * /login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful login, returns JWT token
 *       '401':
 *         description: Invalid credentials
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management endpoints
 * 
 * /courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful operation, returns a list of courses
 *       '401':
 *         description: Unauthorized, missing or invalid token
 *       '500':
 *         description: Internal server error
 * 
 * /enroll:
 *   post:
 *     summary: Enroll in a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               course_id:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successfully enrolled in the course
 *       '401':
 *         description: Unauthorized, missing or invalid token
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * tags:
 *   name: SuperAdmin
 *   description: Super admin operations
 * 
 * /users:
 *   get:
 *     summary: Get all users (SuperAdmin)
 *     tags: [SuperAdmin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful operation, returns a list of users
 *       '401':
 *         description: Unauthorized, missing or invalid token
 *       '403':
 *         description: Forbidden, user is not a super admin
 *       '500':
 *         description: Internal server error
 * 
 * /course:
 *   post:
 *     summary: Add a new course (SuperAdmin)
 *     tags: [SuperAdmin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       '201':
 *         description: Course added successfully
 *       '401':
 *         description: Unauthorized, missing or invalid token
 *       '403':
 *         description: Forbidden, user is not a super admin
 *       '500':
 *         description: Internal server error
 * 
 * /courses/{id}:
 *   put:
 *     summary: Update a course (SuperAdmin)
 *     tags: [SuperAdmin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       '200':
 *         description: Course updated successfully
 *       '401':
 *         description: Unauthorized, missing or invalid token
 *       '403':
 *         description: Forbidden, user is not a super admin
 *       '500':
 *         description: Internal server error
 * 
 * /courses/{id}:
 *   delete:
 *     summary: Delete a course (SuperAdmin)
 *     tags: [SuperAdmin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 */
