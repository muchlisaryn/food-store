const { subject } = require("@casl/ability");
const DeliveryAddress = require("./model");
const { policyFor } = require("../../../utils");

const createDeliveryAddress = async (req, res, next) => {
  try {
    const {
      name,
      no_telephone,
      kelurahan,
      kecamatan,
      kabupaten,
      provinsi,
      detail,
    } = req.body;
    const user = req.user;

    const result = await DeliveryAddress.create({
      name,
      no_telephone,
      kelurahan,
      kecamatan,
      kabupaten,
      provinsi,
      detail,
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
    const { _id, ...payload } = req.body;
    const { id } = req.params;

    const findData = await DeliveryAddress.findOne({ _id: id });

    if (!findData) {
      return res.status(400).json({
        message: `Delivery Address dengan id ${id} tidak ditemukan`,
      });
    }

    const subjectAddress = subject("DeliveryAddress", {
      ...findData,
      user_id: findData.user,
    });
    const policy = policyFor(req.user);
    if (!policy.can("update", subjectAddress)) {
      return res.status(400).json({
        error: 1,
        message: "Youre not allowed to modify this resource",
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

const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const findData = await DeliveryAddress.findOne({ _id: id });

    if (!findData) {
      return res.status(400).json({
        message: `Delivery Address dengan id ${id} tidak ditemukan`,
      });
    }

    const subjectAddress = subject("DeliveryAddress", {
      ...findData,
      user_id: findData?.user,
    });
    const policy = policyFor(req.user);

    if (!policy.can("delete", subjectAddress)) {
      return res.status(400).json({
        error: 1,
        message: "Youre not allowed to modify this resource",
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

const getDelivery = async (req, res, next) => {
  try {
    const { skip = 0, limit = 10 } = req.query;
    const count = await DeliveryAddress.find({
      user: req.user?._id,
    }).countDocuments();

    const result = await DeliveryAddress.find({ user: req.user._id })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .sort("-createdAt");

    return res.json({ data: result, count });
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
