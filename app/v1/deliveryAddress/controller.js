const DeliveryAddress = require("./model");

const createDeliveryAddress = async (req, res, next) => {
  try {
    const payload = req.body;
    const user = req.user;

    const result = await DeliveryAddress.create({
      ...payload,
      user: user?._id,
    });
    await result.save();
    return res.status(202).json(result);
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

const updateDeliveryAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const findData = await DeliveryAddress.findOne({ _id: id });

    if (!findData) {
      return res.status(400).json({
        message: `Delivery Address dengan id ${id} tidak ditemukan`,
      });
    }

    const result = await DeliveryAddress.findByIdAndUpdate(
      { _id: id },
      payload,
      { new: true, runValidators: true }
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

const getDelivery = async (req, res, next) => {
  try {
    const result = await DeliveryAddress.find();

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

const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;

    const findData = await DeliveryAddress.findOne({ _id: id });

    if (!findData) {
      return res.status(400).json({
        message: `Delivery Address dengan id ${id} tidak ditemukan`,
      });
    }

    const result = await DeliveryAddress.findByIdAndDelete({ _id: id });
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

module.exports = {
  createDeliveryAddress,
  updateDeliveryAddress,
  getDelivery,
  destroy,
};
