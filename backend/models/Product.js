const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    brand: String,
    category: String,

    price: {
      type: Number,
      required: true,
    },

    discount: String,

    description: String,

    sizes: [String],

    images: [String],

    // NEW
    stock: {
      type: Number,
      default: 20,
    },

    // NEW
    isAvailable: {
      type: Boolean,
      default: true,
    },
    popularity: {
  type: Number,
  default: 0,
},
  },
  {
    timestamps: true,
  }
);
ProductSchema.index({ category: 1 });

ProductSchema.index({ popularity: -1 });

ProductSchema.index({
  category: 1,
  popularity: -1,
});
module.exports = mongoose.model("Product", ProductSchema);