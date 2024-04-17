const express = require('express');
const {getAllUsers,getCourses,getProfile,addCourse,updateCourse,deleteCourse,enrollInCourse,coursesOfUser}=require('../controllers/controller.js');
const {registerUser,loginUser} = require('../controllers/register.js');
const {authenticateUser,superAdminMiddleware} = require('../middlewares/userAuth.js');
const Router=express.Router();


Router.post('/register',registerUser);
Router.post('/login',loginUser);

Router.get('/courses',authenticateUser,getCourses);


//for courses (only for super admin )
Router.get('/users',authenticateUser,superAdminMiddleware,getAllUsers);  
Router.post('/course',authenticateUser,superAdminMiddleware,addCourse);
Router.put('/courses/:id',authenticateUser,superAdminMiddleware,updateCourse);
Router.delete('/courses:id',authenticateUser,superAdminMiddleware,deleteCourse);


Router.post('/enroll',authenticateUser,enrollInCourse);
Router.get('/users/:email/courses',authenticateUser,coursesOfUser);
Router.get('/users/:email',authenticateUser,getProfile);







module.exports =Router;