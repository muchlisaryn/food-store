const CartItem = require("./cart-item/model");

const insert = async (req, res, next) => {
  try {
    const { items, qty } = req.body;

    console.log(items);

    const findProductInCart = await CartItem.find({
      product: items._id,
      user: req.user._id,
    });

    if (findProductInCart.length > 0) {
      return res.status(400).json({
        error: 1,
        message: "Product ini sudah ada di keranjang anda",
      });
    }

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

    const result = await CartItem.findByIdAndDelete({ _id: id });

    return res.status(200).json(result);
  } catch (err) {
    if (err && err.name == "ValidationError") {
      return res.status(400).json({
        error: 1,
        message: err.message,
        fields: err.message,
      });
    }
    next(err);
  }
};

module.exports = { update, getCart, insert, deleteCart };
