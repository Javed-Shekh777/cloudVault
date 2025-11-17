

const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const fileRouter = require("./routes/FileRoute");
const authRouter = require("./routes/authRoute");
const userRouter = require("./routes/userRoute");



const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/v1/files",fileRouter);
app.use("/api/v1/auth",authRouter);
app.use("/api/v1/user",userRouter);




module.exports = app;

