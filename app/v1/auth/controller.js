const passport = require("passport");
const User = require("../user/model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../config");

const register = async (req, res, next) => {
  try {
    const payload = req.body;

    let result = await User.create(payload);
    console.log(result);
    return res.status(202).json(result);
  } catch (error) {
    if (error && error.name === "ValidationError") {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.message,
      });
    }
    next(error);
  }
};

const localStrategy = async function (email, password, done) {
  console.log(email, password);
  try {
    const user = await User.findOne({ email }).select(
      "-__v -createdAt -updatedAt -cart_items -token"
    );

    if (!user) {
      return done;
    }

    if (bcrypt.compareSync(password, user.password)) {
      ({ password, ...userWithoutPassword } = user.toJSON());
      return done(null, userWithoutPassword);
    }
  } catch (error) {
    done(error, null);
  }
  done();
};

const login = (req, res, next) => {
  passport.authenticate(
    "local",

    async (err, user) => {
      if (err) {
        return next(err);
      }

      console.log(user);
      if (!user) {
        return res.json({ error: 1, message: "Email or Password incorect" });
      }

      const signed = jwt.sign(user, config.secretKey);

      await User.findByIdAndUpdate(user?._id, { $push: { token: signed } });

      res.json({
        message: "Login Successfully",
        user,
        token: signed,
      });
    }
  )(req, res, next);
};

module.exports = { register, login, localStrategy };
