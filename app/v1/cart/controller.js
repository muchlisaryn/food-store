const Product = require("../product/model");
const CartItem = require("./cart-item/model");

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
        image_url: relatedProduct.image_url,
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
  } catch (error) {
    if (err && err.name == "ValidationError") {
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
        message: error.message,
        fields: error.message,
      });
    }
    next(err);
  }
};

module.exports = { update, getCart };
