const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const cartItemSchema = Schema({
  name: {
    type: String,
    required: [true, `name mus be filled`],
  },
  qty: {
    type: Number,
    required: [true, `qty harus diisi`],
    min: [1, `minimal qty adalah 1`],
  },
  price: {
    type: Number,
    default: 0,
  },

  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = model("CartItem", cartItemSchema);
