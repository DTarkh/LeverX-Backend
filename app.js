const express = require("express");
const cors = require("cors");
const usersRouter = require("./route/userRoute");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", usersRouter);

module.exports = app;
