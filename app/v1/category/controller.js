const Category = require("./model");

const createCategory = async (req, res, next) => {
  try {
    let { name } = req.body;
    const tag = name?.toLowerCase();

    const findProduct = await Category.findOne({
      tag: name?.toLowerCase(),
    });

    console.log(findProduct);
    if (findProduct) {
      return res.status(400).json({
        error: 1,
        message: "Nama Category Sudah Ada",
      });
    }

    let category = await new Category({ name, tag });
    await category.save();
    return res.json(category);
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

const updateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const tag = name?.toLowerCase();

    const checkId = await Category.findById({ _id: id });

    if (!checkId) {
      return res.status(400).json({
        message: `id category ${id} tidak ditemukan`,
      });
    }

    const findCategory = await Category.findOne({
      tag: name?.toLowerCase(),
    });

    if (findCategory) {
      return res.status(400).json({
        error: 1,
        message: `Nama Category ${name} Sudah Ada`,
      });
    }

    let category = await Category.findByIdAndUpdate(
      { _id: id },
      { name, tag },
      {
        new: true,
        runValidators: true,
      }
    );
    return res.json(category);
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

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const checkId = await Category.findById({ _id: id });

    if (!checkId) {
      return res.status(400).json({
        message: `id category ${id} tidak ditemukan`,
      });
    }

    let category = await Category.findByIdAndDelete({ _id: id });
    return res.json(category);
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

const getCategory = async (req, res, next) => {
  try {
    let category = await Category.find();
    return res.json(category);
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
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
};
