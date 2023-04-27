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
      default: 0,
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
