var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
var cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var templatesRouter = require("./routes/templates");
var moderationRouter = require("./routes/moderation");
var contactsRouter = require("./routes/contacts");
var insightsRouter = require("./routes/insights");
var locationRouter = require("./routes/location");

var app = express();
app.use(cookieParser());

app.use(
  session({
    secret: "e-template",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 30, // 30 minutes
    },
  })
);

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "client", "build")));
app.use(express.static(path.join(__dirname, "client", "build", "public")));

app.use("/api", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/templates", templatesRouter);
app.use("/api/moderation", moderationRouter);
app.use("/api/contacts", contactsRouter);
app.use("/api/insights", insightsRouter);
app.use("/api/location", locationRouter);

if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https")
      res.redirect(`https://${req.header("host")}${req.url}`);
    else next();
  });
}

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

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
  res.json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
