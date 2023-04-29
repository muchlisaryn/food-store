const router = require("express").Router();
const {
  register,
  login,
  localStrategy,
  logout,
  checkUserToken,
} = require("./controller");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    localStrategy
  )
);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", checkUserToken);

module.exports = router;
