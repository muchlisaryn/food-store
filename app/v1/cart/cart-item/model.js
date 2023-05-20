const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const cartItemSchema = Schema(
  {
    qty: {
      type: Number,
      required: [true, `qty harus diisi`],
      min: [1, `minimal qty adalah 1`],
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

cartItemSchema.virtual("total").get(function () {
  return this.product.price * this.qty;
});

module.exports = model("CartItem", cartItemSchema);
