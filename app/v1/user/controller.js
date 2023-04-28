const User = require("./model");

const getAllUser = async (req, res, next) => {
  try {
    const result = await User.find();
    return res.json(result);
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const findUser = await User.findOne({ _id: id });

    if (!findUser) {
      return res.status(400).json({
        message: `id user "${id}" tidak ditemukan`,
      });
    }

    const result = await User.findByIdAndDelete({ _id: id });
    return res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllUser, deleteUser };
