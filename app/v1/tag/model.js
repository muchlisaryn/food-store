const mongoose = require("mongoose");
const { model, Schema } = mongoose;

let tagSchema = Schema({
  name: {
    type: String,
    minLength: [3, "Panjang nama kategori minimal 3 karakter"],
    maxLength: [20, "Panjang nama kategori maksimal 20 karakter"],
    required: [true, "Nama Kategori harus diisi"],
  },
  tag: {
    type: String,
    minLength: [3, "Panjang nama kategori minimal 3 karakter"],
    maxLength: [20, "Panjang nama kategori maksimal 20 karakter"],
  },
});

module.exports = model("Tag", tagSchema);
