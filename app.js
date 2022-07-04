const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const multer = require("multer");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const postRouter = require("./routes/post");
const commentRouter = require("./routes/comment");

const firebase = require("./seed/firebase");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

mongoose
  .connect(
    "mongodb+srv://khaphat128:Xdy3GZTUuaictWLJ@lostandfind.4nz2z.mongodb.net/lostandfind",
    { useNewUrlParser: true }
  )
  .then((rs) => {
    console.log("db successful");
  });

//config upload single image
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ extended: false }));
const upload = multer({
  storage: multer.memoryStorage(),
});
app.post("/uploadImage", upload.single("recfile"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("Error: No files found");
  }
  const blob = firebase.bucket.file(req.file.originalname);
  const blobWriter = blob.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
    },
  });
  blobWriter.on("error", (err) => {
    console.log(err);
  });
  blobWriter.on("finish", () => {
    const fileLocation = `https://firebasestorage.googleapis.com/v0/b/${firebase.bucket.name}/o/${blob.name}?alt=media`;
    return res.status(200).send({ url: fileLocation });
  });
  blobWriter.end(req.file.buffer);
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/post", postRouter);
app.use("/comment", commentRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
