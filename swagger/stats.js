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
 *           format: binary
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
 * 
 * 
 *   securitySchemes: 
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   
 *   security:
 *   - bearerAuth: []
 * 
 * 
 * 
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
 *     summary: Get courses with pagination
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: level
 *         schema:
 *           type: integer
 *         description: Filter courses by level
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       '200':
 *         description: Successful operation, returns a list of courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 *       '500':
 *         description: Internal server error
 * 
 * 
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
 *
 * 
 * /users/{email}/courses:
 *   get:
 *     summary: Get courses of a user by email
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
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
 * 
 * /users/{email}:
 *   get:
 *     summary: Get profile of a particular user
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
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
 * 
 * 
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
 *       required: false
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
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       '200':
 *         description: Course delelted successfully
 *       '401':
 *         description: Unauthorized, missing or invalid token
 *       '403':
 *         description: Forbidden, user is not a super admin
 *       '500':
 *         description: Internal server error
 * 
 */



