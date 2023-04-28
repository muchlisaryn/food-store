const router = require("express").Router();
const { register, login, localStrategy } = require("./controller");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

passport.use(new LocalStrategy({ usernameField: "email" }, localStrategy));
router.post("/register", register);
router.post("/login", login);

module.exports = router;
