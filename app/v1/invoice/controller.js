const { subject } = require("@casl/ability");
const Invoice = require("../invoice/model");
const { policyFor } = require("../../../utils");

const getInvoice = async (req, res, next) => {
  try {
    const { order_id } = req.params;
    let invoice = await Invoice.findOne({ order: order_id })
      .populate("order_items")
      .populate("user");

    let policy = policyFor(req.user);
    let subjectInvoice = subject("Invoice", {
      ...invoice,
      user_id: invoice.user._id,
    });

    if (!policy.can("read", subjectInvoice)) {
      return res.json({
        error: 1,
        message: `Anda tidak memiliki akses untuk melihat invoice ini`,
      });
    }

    if (!policy.can("read", "Invoice")) {
      return res.json({
        error: 1,
        message: "you're not allowed to perform this action",
      });
    }
    return res.json(invoice);
  } catch (error) {
    return res.status(400).json({
      error: 1,
      message: "Error when getting invoice",
    });
  }
};

module.exports = getInvoice;
