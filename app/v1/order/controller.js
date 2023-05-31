const CartItem = require("../cart/cart-item/model");
const DeliveryAddress = require("../deliveryAddress/model");
const Order = require("../order/model");
const { Types } = require("mongoose");
const OrderItem = require("../order/order-item/model");
const Product = require("../product/model");
const Invoice = require("../invoice/model");

const OrderInCart = async (req, res, next) => {
  try {
    let { delivery_fee, delivery_address } = req.body;
    const groupQty = {};

    let items = await CartItem.find({ user: req.user._id }).populate("product");
    if (!items.length) {
      return res.status(400).json({
        error: 1,
        message: "you're not create order because you have not items in cart",
      });
    }

    console.log(items);

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
        price: parseInt(item?.product.current_price),
        order: order._id,
        product: item?.product._id,
      }))
    );

    orderItems.forEach((item) => {
      if (groupQty[item.qty] === undefined) {
        groupQty[item.qty] = [];
      }
      groupQty[item.qty].push(item.product._id);

      order.order_items.push(item);
    });

    await order.save();
    await CartItem.deleteMany({ user: req.user._id });

    Object.entries(groupQty).forEach(async ([key, value]) => {
      await Product.updateMany({ _id: value }, { $inc: { sold: key } });
    });

    return res.json(order);
  } catch (error) {
    if (error && error.name === "ValidationError") {
      console.log(error.message)
      return res.status(400).json({
        error: 1,
        message: error.message,
        fields: error.message,
      });
    }
    next(error);
  }
};

const orderBuyNow = async (req, res, next) => {
  try {
    let { items, delivery_address, delivery_fee } = req.body;

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

    let orderItems = await OrderItem.create({
      image: items?.product.image_url,
      name: items?.product.name,
      qty: parseInt(items?.qty),
      price: parseInt(items?.product.current_price),
      order: order._id,
      product: items?.product._id,
    });

    order.order_items.push(orderItems);

    await order.save();

    await Product.updateOne(
      { _id: items?.product._id },
      { $inc: { sold: items?.qty } }
    );

    return res.status(202).json(order);
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

const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Invoice.deleteMany({ order: id });

    const result = await Order.findByIdAndDelete(id);

    const test = await OrderItem.deleteMany({ order: id });
    console.log(test);
    return res.json({
      data: result,
      message: "Success delete order",
    });
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

const getAllOrder = async (req, res, next) => {
  try {
    let count = await Order.find().countDocuments();

    let orders = await Order.find()
      .populate({
        path: "order_items",
        model: "OrderItem",
      })
      .populate("user")
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

const getOrderByUser = async (req, res, next) => {
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

module.exports = {
  OrderInCart,
  getOrderByUser,
  orderBuyNow,
  destroy,
  getAllOrder,
};
