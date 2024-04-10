const jwt = require("jsonwebtoken");
const pool = require("../neon-db/db.js");

const secret = process.env.secretKey;

const authenticateUser = (req, res, next) => {
  // Get the token from the request headers (assuming it's sent in the Authorization header)
  // const token = req.headers.authorization;
  const token = req.headers.authorization?.split(" ")[1];
  console.log(token);

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    // Verify the token using your secret key
    const decoded = jwt.verify(token, secret);
    console.log({ decoded: decoded });

    // Attach the decoded user information to the request object for use in subsequent middleware or route handlers
    req.user = decoded;

    // Call next() to proceed to the next middleware or route handler
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
    // Verify the token using your secret key
    const decoded = jwt.verify(token, secret);
    // console.log({decoded:decoded});

    const user=await pool.query(`select * from users where email='${decoded.email}'`);

    console.log(user.rows);
    if(!(user.rows[0].issuperadmin)){
        res.status(401).json({error:"no superadmin,only superadmin access"});
    }else{
        next();
    }
    

    // Attach the decoded user information to the request object for use in subsequent middleware or route handlers
    // req.user = decoded;

    
    
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(403).json({ error: "Invalid token" });
  }

   
};

module.exports = { authenticateUser, superAdminMiddleware };
