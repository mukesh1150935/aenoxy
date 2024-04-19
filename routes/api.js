const express = require('express');
const {getAllUsers,getCourses,getProfile,addCourse,updateCourse,deleteCourse,enrollInCourse,coursesOfUser}=require('../controllers/controller.js');
const {registerUser,loginUser} = require('../controllers/register.js');
const {authenticateUser,superAdminMiddleware} = require('../middlewares/userAuth.js');
const Router=express.Router();
const multer = require('multer');   
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
      if (file.mimetype === 'image/jpeg'||file.mimetype === 'image/jpg'||file.mimetype === 'image/png') {
        cb(null, true);
      } else {
        cb(new Error('Only JPEG files are allowed'));
      }
    }
  });

Router.post('/register',upload.single('profiile'),registerUser);
Router.post('/login',loginUser);

Router.get('/courses',authenticateUser,getCourses);


//for courses (only for super admin )
Router.get('/users',authenticateUser,superAdminMiddleware,getAllUsers);  
Router.post('/course',authenticateUser,superAdminMiddleware,addCourse);
Router.put('/courses/:id',authenticateUser,superAdminMiddleware,updateCourse);
Router.delete('/courses/:id',authenticateUser,superAdminMiddleware,deleteCourse);


Router.post('/enroll',authenticateUser,enrollInCourse);
Router.get('/users/:email/courses',authenticateUser,coursesOfUser);
Router.get('/users/:email',authenticateUser,getProfile);







module.exports =Router;