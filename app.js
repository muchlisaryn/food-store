const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const app = express();
const { decodeToken } = require("./middlewares");

//router
const productRoute = require("./app/v1/product/router");
const categoryRoute = require("./app/v1/category/router");
const tagRoute = require("./app/v1/tag/router");
const authUserRoute = require("./app/v1/auth/router");
const userRoute = require("./app/v1/user/router");
const deliveryRoute = require("./app/v1/deliveryAddress/router");
const cartRoute = require("./app/v1/cart/router");
const orderRoute = require("./app/v1/order/router");
const invoiceRoute = require("./app/v1/invoice/router");
const passport = require("passport");

const v1 = "/api/v1";

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(decodeToken());
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));

app.use(v1, productRoute);
app.use(v1, categoryRoute);
app.use(v1, tagRoute);
app.use("/auth/v1", authUserRoute);
app.use(v1, userRoute);
app.use(v1, deliveryRoute);
app.use(v1, cartRoute);
app.use(v1, orderRoute);
app.use(v1, invoiceRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).send({ msg: "Route does not exist" });
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
