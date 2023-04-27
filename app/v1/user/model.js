const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const userSchema = Schema(
  {
    full_name: {
      type: String,
      minLength: [3, "Panjang nama harus 3 - 255 karakter"],
      maxLength: [255, "Panjang nama harus 3 - 255 karakter"],
      required: [true, "Nama Panjang Harus diisi"],
    },
    customer_id: {
      type: Number,
    },
    email: {
      type: String,
      required: [true, "Email harus diisi"],
      maxLength: [255, "Panjang email maksimal 255 karakter"],
    },
    password: {
      type: String,
      required: [true, "Password harus diisi"],
      maxLength: [255, "Panjang password maksimal 255 karakter"],
    },
    password: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    token: String,
  },
  { timestamps: true }
);

userSchema.path("email").validate(
  function (value) {
    const EMAIL_RE = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return EMAIL_RE.test(value);
  },
  (attr) => `${attr.value} harus merupakan email yang valid!`
);

userSchema.path(`email`).validate(
  async function (value) {
    try {
      const count = await this.model("user").count({ email: value });
      return !count;
    } catch (err) {
      throw err;
    }
  },
  (attr) => `email ${attr.value} sudah terdaftar !`
);
module.exports = model("user", userSchema);
