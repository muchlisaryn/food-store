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
    const { items } = req.body;
    const productsId = await items.map((item) => item?.product?._id);
    const product = await Product.find({ _id: { $in: productsId } });

    let cartItems = items.map((item) => {
      let relatedProduct = product.find(
        (product) => product?._id.toString() === item.product._id
      );

      return {
        product: relatedProduct._id,
        price: relatedProduct.price,
        name: relatedProduct.name,
        user: req.user._id,
        qty: item.qty,
      };
    });

    await CartItem.deleteMany({ user: req.user._id });
    await CartItem.bulkWrite(
      cartItems.map((item) => {
        return {
          updateOne: {
            filter: {
              user: req.user._id,
              product: item.product,
            },
            update: item,
            upsert: true,
          },
        };
      })
    );
    return res.json(cartItems);
  } catch (error) {
    if (error && error.name == "ValidationError") {
      return res.json({
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
