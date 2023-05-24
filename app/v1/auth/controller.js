const User = require("../user/model");
const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const { getToken } = require("../../../utils");

const register = async (req, res, next) => {
  try {
    const payload = req.body;
    const full_name = payload?.first_name + " " + payload?.last_name;

    let result = await User.create({ ...payload, full_name });
    return res.status(202).json(result);
  } catch (error) {
    if (error?.errors?.email) {
      return res.status(400).json({
        error: 1,
        message: error?.errors?.email?.message,
      });
    }
    next(error);
  }
};

const localStrategy = async (email, password, done) => {
  try {
    const user = await User.findOne({ email }).select(
      "-__v -createdAt -updatedAt -cart_items -token"
    );

    if (!user) {
      return done();
    }

    if (bcrypt.compareSync(password, user?.password)) {
      ({ password, ...userWithoutPassword } = user.toJSON());
      return done(null, userWithoutPassword);
    }
  } catch (error) {
    return done(error, null);
  }
  return done();
};

const login = (req, res, next) => {
  passport.authenticate("local", async (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res
        .status(400)
        .json({ error: 1, message: "Email or Password incorect" });
    }

    const signed = jwt.sign(user, config.secretKey);

    await User.findByIdAndUpdate(user?._id, { $push: { token: signed } });

    res.json({
      message: "Login Successfully",
      user,
      token: signed,
    });
  })(req, res, next);
};

const logout = async (req, res, next) => {
  try {
    const token = await getToken(req);

    const user = await User.findOneAndUpdate(
      { token: { $in: [token] } },
      { $pull: { token } },
      { useFindAndModify: false }
    );
    if (!token || !user) {
      return res.status(400).json({
        error: 1,
        message: "Logout Failed",
      });
    }
    return res.status(200).json({
      message: "Logout Berhasil",
    });
  } catch (err) {
    next(err);
  }
};

const checkUserToken = (req, res, next) => {
  if (!req.user) {
    res.status(400).json({
      message: "you not login or token expired",
    });
  }

  return res.json(req.user);
};

module.exports = { register, login, localStrategy, logout, checkUserToken };
