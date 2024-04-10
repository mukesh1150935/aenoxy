const pool = require("../neon-db/db.js");
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
// import { Resend } from 'resend';
const { Resend } = require("resend");

cloudinary.config(process.env.cloudinary_config);

const secretKey = process.env.secretKey;




// Multer storage for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const registerUser = async (req, res) => {
  try {
    const { name, password, email, profile_image } = req.body;

    // Check if email already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

   

    let profileImageUrl = "";
    if (profile_image) {
      const result = await cloudinary.uploader.upload(profile_image, {
        folder: "profile_images",
      });
      profileImageUrl = result.secure_url;
    }
    console.log(profileImageUrl);

    // Insert user data into the database with verification code

    await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email, hashedPassword]);



    // const resend = new Resend("re_hRaQDjry_8HXKEvowTCNPG9AyFSYWW7wz");

// await resend.emails.send({
//   from: 'mukesh1150935@gmail.com',
//   to: email,
//   subject: 'hello world',
//   text: 'it works!',
//   headers: {
//     'X-Entity-Ref-ID': '123456789',
//   },
//   tags: [
//     {
//       name: 'category',
//       value: 'confirm_email',
//     },
//   ],
// });

 

    res
      .status(201)
      .json({
        message:
          "User registered successfully. Please check your email for verification.",
        // profileImageUrl,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Helper function to get user by email
async function getUserByEmail(email) {
  const getUserQuery = `SELECT * FROM users WHERE email = '${email}'`;
  const result = await pool.query(getUserQuery);
  // console.log(result.rows);
  return result.rows.length;
}

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
      // Check if the user with the provided email exists in the database
      const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

      if (user.rows.length === 0) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Verify the password using bcrypt
      const hashedPassword = user.rows[0].password;
      const passwordMatch = await bcrypt.compare(password, hashedPassword);

      if (!passwordMatch) {
          return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate a JWT token for authentication
      const token = jwt.sign({ email: email },process.env.secretKey, { expiresIn: '30d' });

      // Send the token in the response
      res.status(200).json({message:"login successfull", token: token });
  } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};



module.exports = { registerUser, loginUser };
