const Product = require("../product/model");
const CartItem = require("./cart-item/model");

const insert = async (req, res, next) => {
  try {
    const { items, qty } = req.body;

    const result = await CartItem.create({
      qty,
      product: items?._id,
      user: req.user._id,
    });
    return res.status(202).json(result);
  } catch (error) {
    if (error && error.name == "ValidationError") {
      return res.status(400).json({
        error: 1,
        message: error.message,
        fields: error.message,
      });
    }
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { qty } = req.body;
    const { id } = req.params;

    const findCart = CartItem.findById({ _id: id });

    if (!findCart) {
      return res.status(400).json({
        message: `Cart dengan ${id} tidak ditemukan`,
      });
    }

    const result = await CartItem.findByIdAndUpdate(
      { _id: id },
      { qty },
      {
        new: true,
        runValidators: true,
      }
    ).populate("product");

    console.log(result);
    return res.status(200).json(result);
  } catch (error) {
    if (error && error.name == "ValidationError") {
      return res.status(400).json({
        error: 1,
        message: error.message,
        fields: error.message,
      });
    }
    next(error);
  }
};

const getCart = async (req, res, next) => {
  try {
    let items = await CartItem.find({ user: req.user._id }).populate("product");

    return res.json(items);
  } catch (err) {
    if (err && err.name == "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.message,
      });
    }
    next(err);
  }
};

const deleteCart = async (req, res, next) => {
  try {
    const { id } = req.params;

    const checkId = await CartItem.findById({ _id: id });

    if (!checkId) {
      return res.status(400).json({
        message: `id Tag ${id} tidak ditemukan`,
      });
    }

    const result = await CartItem.findByIdAndDelete({ _id: id });

    return res.status(200).json(result);
  } catch (err) {
    if (err && err.name == "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.message,
      });
    }
    next(err);
  }
};

module.exports = { update, getCart, insert, deleteCart };
