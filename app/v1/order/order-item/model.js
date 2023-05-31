const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const orderItemSchema = Schema(
  {
    image: {
      type: String,
      required: [true, "image must be filled"],
    },
    name: {
      type: String,
      required: [true, "Nama must be filled"],
    },
    price: {
      type: Number,
      required: [true, "Harga item harus diisi"],
    },
    qty: {
      type: Number,
      required: [true, "qty required"],
      min: [1, "minimal qty 1"],
    },

    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },

    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  },
  { toJSON: { virtuals: true } }
);

orderItemSchema.virtual("total").get(function () {
  return this.price * this.qty;
});

module.exports = model("OrderItem", orderItemSchema);
