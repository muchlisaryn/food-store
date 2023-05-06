const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const deliveryAddressSchema = Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: [255, "Panjang maksimal nama alamat adalah 255 karakter"],
    },
    no_telephone: {
      type: Number,
      required: true,
      maxLength: [10, "Panjang maksimal nomor telephone adalah 10 digit"],
    },
    kelurahan: {
      type: String,
      required: true,
      maxLength: [255, "Panjang maksimal nama alamat adalah 255 karakter"],
    },
    kecamatan: {
      type: String,
      required: true,
      maxLength: [255, "Panjang maksimal nama alamat adalah 255 karakter"],
    },
    kabupaten: {
      type: String,
      required: true,
      maxLength: [255, "Panjang maksimal nama alamat adalah 255 karakter"],
    },
    provinsi: {
      type: String,
      required: true,
      maxLength: [255, "Panjang maksimal nama alamat adalah 255 karakter"],
    },
    detail: {
      type: String,
      required: true,
      maxLength: [1000, "Panjang maksimal nama alamat adalah 255 karakter"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = model("DeliveryAddress", deliveryAddressSchema);
