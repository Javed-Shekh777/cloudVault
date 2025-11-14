

const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const fileRouter = require("./routes/FileRoute");

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/v1/files",fileRouter);


module.exports = app;

