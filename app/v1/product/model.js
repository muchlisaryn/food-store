const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const productSchema = Schema(
  {
    name: {
      type: String,
      minLength: [3, "Panjang nama makanan minimal 3 karakter"],
      required: true,
    },
    description: {
      type: String,
      maxLength: [100, "Panjang deskripsi maksimal 1000 karakter"],
    },
    price: {
      type: Number,
      min: 0,
      default: 0,
    },
    current_price: {
      type: Number,
      min: 0,
      default: 0,
    },
    discount: {
      type: Number,
      min: 0,
      max: [100, "Discount max 100%"],
    },
    sold: {
      type: Number,
    },
    image_url: {
      type: String,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    tags: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Tag",
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("Product", productSchema);
