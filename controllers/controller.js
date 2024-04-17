const pool = require("../neon-db/db.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

const getCourses = async (req, res) => {
  const { level, page = 1, limit = 10 } = req.query;
  let queryParams = [];
  let filterQuery = "SELECT * FROM courses WHERE 1=1";

  if (level) {
    filterQuery += " AND level = $1::int";
    queryParams.push(level);
  }

  const offset = (page - 1) * limit;
  filterQuery += ` LIMIT $${queryParams.length + 1} OFFSET $${
    queryParams.length + 2
  }`;
  queryParams.push(limit, offset);

  try {
    const result = await pool.query(filterQuery, queryParams);
    res.json(result.rows);
  } catch (error) {
    console.error("Failed to fetch data", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM users");
    res.json(users.rows);
  } catch (error) {
    console.error("Failed to fetch data", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const profile = await pool.query(
      `SELECT * FROM users WHERE email='${req.params.email}'`
    );

    res.json(profile.rows);
  } catch {
    console.error("Failed to fetch data", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

cloudinary.config({
  cloud_name: "dizxfdrvn",
  api_key: "849969554411227",
  api_secret: "YI8DsulU3NXo_VOCK5bBSh0IusU",
});
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const addCourse = async (req, res) => {
  try {
    const { course_id, title, description, category, level, price, photo } =
      req.body;
    let profileUrl = "";

    const rows = await pool.query(
      `Select * from courses where course_id='${course_id}'`
    );
    if (rows.rows.length > 0) {
      res.json({ message: "already exists course" });
    }

    if (photo) {
      const result = await cloudinary.uploader.upload(photo, {
        folder: "profile_images",
      });
      profileUrl = result.secure_url;
    }

    await pool.query(
      "INSERT INTO courses (course_id, title, description, category, level, price, photo) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [course_id, title, description, category, level, price, profileUrl]
    );

    res.status(200).json({ message: "Course added successfully", profileUrl });
  } catch (error) {
    console.log("Failed to add data", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { title, description, category, level, price, photo } = req.body;
    let profileUrl = "";

    if (photo) {
      const result = await cloudinary.uploader.upload(photo, {
        folder: "profile_images",
      });
      profileUrl = result.secure_url;
    }

    await pool.query(
      "UPDATE courses SET title = $1, description = $2, category = $3, level = $4, price = $5, photo = $6 WHERE course_id = $7",
      [title, description, category, level, price, profileUrl, courseId]
    );

    res
      .status(200)
      .json({ message: "Course updated successfully", profileUrl });
  } catch (error) {
    console.log("Failed to update course", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    await pool.query("DELETE FROM courses WHERE course_id = $1", [courseId]);

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.log("Failed to delete course", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const enrollInCourse = async (req, res) => {
  try {
    const { email, course_id } = req.body;

    // if the user is already enrolled in the course
    // const existingEnrollment = await pool.query('SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2', [email, course_id]);
    // if (existingEnrollment.rows.length > 0) {
    //     return res.status(400).json({ message: 'User is already enrolled in the course' });
    // }

    // Insert a new enrollment record
    await pool.query(
      "INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2)",
      [email, course_id]
    );

    res
      .status(200)
      .json({ message: "User enrolled in the course successfully" });
  } catch (error) {
    console.error("Failed to enroll user in course", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const coursesOfUser = async (req, res) => {
  const { email } = req.params;

  try {
    // if the user with the provided email exists in the database
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const courses = await pool.query(
      "SELECT * FROM enrollments WHERE user_id = $1",
      [email]
    );

    res.status(200).json(courses.rows);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getCourses,
  getAllUsers,
  getProfile,
  addCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  coursesOfUser,
};
