const pool = require("../neon-db/db.js");
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
// import { Resend } from 'resend';
const { Resend } = require("resend");
const nodemailer = require("nodemailer");

cloudinary.config(process.env.cloudinary_config);

const secretKey = process.env.secretKey;

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


const registerUser = async (req, res) => {
  try {
    const { name, password, email } = req.body;
    console.log(req.file);

    // if email already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    //hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const profile_image=req.file;
    // Upload profile image to Cloudinary
    let profileImageUrl = '';
    if (profile_image) {
      const result = await cloudinary.uploader.upload(profile_image, {
        folder: 'profile_images'
      });
      profileImageUrl = result.secure_url;
    }


    // database query
    await pool.query(
      "INSERT INTO users (name, email, password, profiile) VALUES ($1, $2, $3, $4)",
      [name, email, hashedPassword,profileImageUrl]
    );

    // const resend = new Resend("re_hRaQDjry_8HXKEvowTCNPG9AyFSYWW7wz");

    // (async function () {
    //   const { data, error } = await resend.emails.send({
    //     from: 'Acme <onboarding@resend.dev>',
    //     to: [email],
    //     subject: 'Hello World',
    //     html: '<strong>It works!</strong>',
    //     headers: {
    //       'X-Entity-Ref-ID': '123456321', // This is where you define your custom value
    //     },
    //   });

    //   if (error) {
    //     return console.error({ error });
    //   }

    //   console.log({ data });
    // })();


    console.log(name,email,profileImageUrl);
    res.status(201).json({
      message:
        "User registered successfully",
      user:{name,email,profile_image}
      // profileImageUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// user info search using email
async function getUserByEmail(email) {
  const getUserQuery = `SELECT * FROM users WHERE email = '${email}'`;
  const result = await pool.query(getUserQuery);
  // console.log(result.rows);
  return result.rows.length;
}

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // if the user with the provided email exists in the database
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const hashedPassword = user.rows[0].password;
    const passwordMatch = await bcrypt.compare(password, hashedPassword);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // JWT token for authentication
    const token = jwt.sign({ email: email }, process.env.secretKey, {
      expiresIn: "30d",
    });

    res.status(200).json({ message: "login successfull", token: token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { registerUser, loginUser };
