const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { model, Schema } = mongoose;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const userSchema = Schema(
  {
    first_name: {
      type: String,
      minLength: [3, "Panjang first name harus 3 - 30 karakter"],
      maxLength: [30, "Panjang first name 3 - 30 karakter"],
      required: [true, "First Name Harus diisi"],
    },
    last_name: {
      type: String,
      minLength: [3, "Panjang last name harus 3 - 30 karakter"],
      maxLength: [30, "Panjang last name harus 3 - 30 karakter"],
      required: [true, "Last Name Harus diisi"],
    },
    full_name: {
      type: String,
      required: [true, "Last Name Harus diisi"],
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
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    token: [String],
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

userSchema.pre("save", function (next) {
  const HASH_ROUND = 10;
  this.password = bcrypt.hashSync(this.password, HASH_ROUND);
  next();
});

userSchema.plugin(AutoIncrement, {
  inc_field: "customer_id",
  disable_hooks: true,
});

module.exports = model("user", userSchema);
