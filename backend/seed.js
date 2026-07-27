const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/Product");
const Category = require("./models/Category");

const products = require("./product.json");
const categories = require("./category.json");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");
    
console.log("DB Name:", mongoose.connection.name);
    await Product.deleteMany({});
    await Category.deleteMany({});

    await Product.insertMany(products);
    await Category.insertMany(categories);

    console.log("Data Imported Successfully");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();