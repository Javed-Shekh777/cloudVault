

const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const fileRouter = require("./routes/FileRoute");
const authRouter = require("./routes/authRoute");
const userRouter = require("./routes/userRoute");
const folderRouter = require("./routes/folderRoute");

const { allowedOrigins } = require('./constants');



const app = express();
const corsOptionsDelegate = (req, callback) => {
  const origin = req.header("Origin");
  let corsOptions;

  if (!origin || allowedOrigins.includes(origin)) {
    corsOptions = { origin: true, credentials: true };
  } else {
    corsOptions = { origin: false };
    console.log("❌ CORS blocked:", origin);
  }

  callback(null, corsOptions);
};

// ✅ CORS middleware
app.use(cors(corsOptionsDelegate));


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/v1/files",fileRouter);
app.use("/api/v1/auth",authRouter);
app.use("/api/v1/user",userRouter);
app.use("/api/v1/folders",folderRouter);





module.exports = app;

