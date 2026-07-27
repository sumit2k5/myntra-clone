const mongoose = require("mongoose");

const BagItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },

    size: String,

    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },

    // ✅ Correct place
    priceAtAdded: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bag", BagItemSchema);