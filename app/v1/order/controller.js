const CartItem = require("../cart/cart-item/model");
const DeliveryAddress = require("../deliveryAddress/model");
const Order = require("../order/model");
const { Types } = require("mongoose");
const OrderItem = require("../order/order-item/model");

const store = async (req, res, next) => {
  try {
    let { delivery_fee, delivery_address } = req.body;

    let items = await CartItem.find({ user: req.user._id }).populate("product");
    if (!items.length) {
      return res.status(400).json({
        error: 1,
        message: "you're not create order because you have not items in cart",
      });
    }

    let address = await DeliveryAddress.findById(delivery_address);

    let order = await new Order({
      _id: new Types.ObjectId(),
      delivery_fee,
      delivery_address: {
        name: address?.name,
        no_telephone: address?.no_telephone,
        provinsi: address?.provinsi,
        kabupaten: address.kabupaten,
        kecamatan: address?.kecamatan,
        kelurahan: address?.kelurahan,
        detail: `${address?.detail}, Kel ${address?.kelurahan}, Kec ${address?.kecamatan}, ${address?.kabupaten}, ${address?.provinsi} `,
      },
      user: req?.user?._id,
    });

    let orderItems = await OrderItem.insertMany(
      items.map((item) => ({
        ...item,
        image: item?.product?.image_url,
        name: item?.product.name,
        qty: parseInt(item.qty),
        price: parseInt(item?.product.price),
        order: order._id,
        product: item?.product._id,
      }))
    );
    orderItems.forEach((item) => order.order_items.push(item));

    await order.save();
    await CartItem.deleteMany({ user: req.user._id });
    return res.json(order);
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

const index = async (req, res, next) => {
  try {
    let { skip = 0, limit = 10 } = req.query;
    let count = await Order.find({ user: req.user._id }).countDocuments();

    let orders = await Order.find({ user: req.user._id })
      .populate({
        path: "order_items",
        model: "OrderItem",
      })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .sort("-createdAt");

    return res.json({
      data: orders,
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

module.exports = { store, index };
