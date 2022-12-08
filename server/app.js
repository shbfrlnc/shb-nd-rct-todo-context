const express = require("express");
const cors = require("cors");
const url = require("url");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

const todoRouter = require("./routes/todo");
const authRouter = require("./routes/auth");

const app = express();
var corsOptions = {
    origin: process.env.CORS_ORIGIN,
    credentials: true
}
app.use(cors(corsOptions));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/todo", todoRouter);
app.use("/auth", authRouter);

if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).catch((err) => {
        console.log(err);
    });
} else {
    throw new Error("Detail database tidak valid.")
}

mongoose.connection.on("error", err => {
    console.log(err);
});

mongoose.connection.on("connected", async function () {
    const port = url.parse(process.env.BASE_URL).port | 3001;
    app.listen(port, function () {
        console.log(`server berjalan di port ${port}`);
    });
});
