const User = require("./model");

const getAllUser = async (req, res, next) => {
  try {
    const { skip = null, limit = null, q = "", role = "" } = req.query;

    let ceriteria = {};

    if (q.length > 0) {
      ceriteria = {
        ...ceriteria,
        full_name: { $regex: `${q}`, $options: "i" },
      };
    }

    if (role.length > 0) {
      const roleName = role?.toLowerCase();
      ceriteria = {
        ...ceriteria,
        role: roleName,
      };
    }

    const count = await User.find(ceriteria).countDocuments();

    const result = await User.find(ceriteria)
      .skip(parseInt((skip - 1) * limit))
      .limit(parseInt(limit));
    return res.json({
      data: result,
      count,
    });
  } catch (err) {
    next(err);
  }
};

const getOneUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await User.findById({ _id: id });

    if (!result) {
      return res.status(400).json({
        message: `id user ${id} tidak ditemukan`,
      });
    }

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

module.exports = { getAllUser, deleteUser, getOneUser };
