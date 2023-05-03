const Tag = require("./model");

const createTag = async (req, res, next) => {
  try {
    let { name } = req.body;
    const tag = name?.toLowerCase();

    const findTag = await Tag.findOne({
      tag: name?.toLowerCase(),
    });

    if (findTag) {
      return res.status(400).json({
        error: 1,
        message: `Nama Tag ${name} Sudah Ada`,
      });
    }

    const result = await new Tag({ name, tag });
    await result.save();
    return res.json(result);
  } catch (error) {
    if (error && error.name === "ValidationError") {
      return res.status(400).json({
        error: 1,
        message: error.message,
        fields: error.message,
      });
    }
    next(error);
  }
};

const updateTag = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const tag = name?.toLowerCase();

    const checkId = await Tag.findById({ _id: id });

    if (!checkId) {
      return res.status(400).json({
        message: `id Tag ${id} tidak ditemukan`,
      });
    }

    const findTag = await Tag.findOne({
      tag: name?.toLowerCase(),
    });

    if (findTag) {
      return res.status(400).json({
        error: 1,
        message: `Nama Tag ${name} Sudah Ada`,
      });
    }

    const result = await Tag.findByIdAndUpdate(
      { _id: id },
      { name, tag },
      {
        new: true,
        runValidators: true,
      }
    );
    return res.json(result);
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

const deleteTag = async (req, res, next) => {
  try {
    const { id } = req.params;
    const checkId = await Tag.findById({ _id: id });

    if (!checkId) {
      return res.status(400).json({
        message: `id Tag ${id} tidak ditemukan`,
      });
    }

    let result = await Tag.findByIdAndDelete({ _id: id });
    return res.json(result);
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

const getTag = async (req, res, next) => {
  try {
    const { skip = null, limit = null, q = "" } = req.query;
    let ceriteria = {};

    if (q.length > 0) {
      ceriteria = { ...ceriteria, name: { $regex: `${q}`, $options: "i" } };
    }

    const count = await Tag.find(ceriteria).countDocuments();
    const result = await Tag.find(ceriteria)
      .skip(parseInt((skip - 1) * limit))
      .limit(parseInt(limit));
    return res.json({
      data: result,
      count,
    });
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

module.exports = {
  createTag,
  updateTag,
  deleteTag,
  getTag,
};
