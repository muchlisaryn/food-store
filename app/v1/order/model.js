const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const { model, Schema } = mongoose;
const Invoice = require("../invoice/model");

const orderSchema = Schema(
  {
    status: {
      type: String,
      enum: ["Waiting Payment", "processing", "In delivery", "delivered"],
      default: "Waiting Payment",
    },

    delivery_fee: {
      type: Number,
      default: 0,
    },

    delivery_address: {
      name: { type: String, required: [true, "Name harus diisi"] },
      no_telephone: {
        type: Number,
        required: [true, "no telephone harus diisi"],
      },
      provinsi: { type: String, required: [true, "provinsi harus diisi"] },
      kabupaten: { type: String, required: [true, "kabupaten harus diisi"] },
      kecamatan: { type: String, required: [true, "kecamatan harus diisi"] },
      kelurahan: { type: String, required: [true, "kelurahan harus diisi"] },
      detail: { type: String },
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },

    order_items: [{ type: Schema.Types.ObjectId, ref: "OrderItem" }],
  },
  { toJSON: { virtuals: true }, timestamps: true }
);

orderSchema.virtual("items_count").get(function () {
  return this.order_items.reduce((total, item) => total + item.qty, 0);
});

orderSchema.virtual("total").get(function () {
  return this.order_items.reduce(
    (total, item) => total + item.total + this.delivery_fee,
    0
  );
});

orderSchema.post("save", async function () {
  const sub_total = this.order_items.reduce(
    (total, item) => (total += item.price * item.qty),
    0
  );
  const invoice = new Invoice({
    user: this.user,
    order: this._id,
    order_items: this.order_items,
    sub_total: sub_total,
    delivery_fee: parseInt(this.delivery_fee),
    total: parseInt(sub_total + this.delivery_fee),
    delivery_address: this.delivery_address,
  });
  await invoice.save();
});

module.exports = model("Order", orderSchema);
