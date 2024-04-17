const jwt = require("jsonwebtoken");
const pool = require("../neon-db/db.js");
const secret = process.env.secretKey;

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log(token);

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    // console.log({ decoded: decoded });

    req.user = decoded;

    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(403).json({ error: "Invalid token" });
  }
};

const superAdminMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    console.log(token);

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    const decoded = jwt.verify(token, secret);
    // console.log({decoded:decoded});

    const user = await pool.query(
      `select * from users where email='${decoded.email}'`
    );

    // console.log(user.rows);
    if (!user.rows[0].issuperadmin) {
      res.status(401).json({ error: "no superadmin,only superadmin access" });
    } else {
      next();
    }

    // req.user = decoded;
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(403).json({ error: "Invalid token" });
  }
};

module.exports = { authenticateUser, superAdminMiddleware };
