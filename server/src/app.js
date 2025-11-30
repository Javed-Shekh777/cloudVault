const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const { allowedOrigins } = require('./constants');

const fileRouter = require("./routes/FileRoute");
const authRouter = require("./routes/authRoute");
const userRouter = require("./routes/userRoute");
const folderRouter = require("./routes/folderRoute");

const { NotFoundError } = require("./errors/AppError");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// CORS config
const corsOptionsDelegate = (req, callback) => {
  const origin = req.header("Origin");
  let corsOptions = { origin: false };
  if (!origin || allowedOrigins.includes(origin)) corsOptions = { origin: true, credentials: true };
  else console.log("❌ CORS blocked:", origin);
  callback(null, corsOptions);
};

app.use(helmet());
app.set("trust proxy", true);
app.use(cors(corsOptionsDelegate));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use("/api/v1/files", fileRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/folders", folderRouter);

// 404 handler
app.use((req, res, next) => next(new NotFoundError("Route not found")));

// Global error handler
app.use(errorHandler);

module.exports = app;
