const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const cloudinary = require("cloudinary").v2;
const nodemailer = require("nodemailer");
const Router = require('./routes/api.js');
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const specs = require("./swagger/swaggerJson.js");
require("./neon-db/db.js");
require("./schemas/schema.js");






const app = express();
const PORT = 3000 || process.env.PORT;
app.use(express.json());
app.use(bodyParser.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/", Router);





app.all("*", (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server`);
  err.status = "fail";
  err.statusCode = 404;
  next(err);
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
