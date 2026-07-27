const Product = require("../models/Product");
const express = require("express");
const Bag = require("../models/Bag");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userId, productId, size, quantity } = req.body;
    const product = await Product.findById(productId);

if (!product) {
  return res.status(404).json({
    message: "Product not found",
  });
}

if (!product.isAvailable) {
  return res.status(400).json({
    message: "This product is no longer available.",
  });
}

if (product.stock < quantity) {
  return res.status(400).json({
    message: `Only ${product.stock} items left in stock.`,
  });
}

    const bagItem = await Bag.findOneAndUpdate(
  {
    userId,
    productId,
    size,
  },
  {
    $inc: {
      quantity: quantity,
    },

    $setOnInsert: {
      priceAtAdded: product.price,
    },
  },
  {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  }
);

    res.status(200).json(bagItem);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

router.get("/:userid", async (req, res) => {
  try {
    const bag = await Bag.find({
      userId: req.params.userid,
    }).populate("productId");

    const validBag = bag.filter(
      (item) => item.productId !== null
    );

    res.status(200).json(validBag);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
});
router.put("/quantity/:itemid", async (req, res) => {
  try {
    const { action } = req.body;

    const value = action === "increase" ? 1 : -1;

    const item = await Bag.findById(req.params.itemid);

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    if (action === "decrease" && item.quantity <= 1) {
      return res.status(200).json(item);
    }

    const updated = await Bag.findByIdAndUpdate(
      req.params.itemid,
      {
        $inc: {
          quantity: value,
        },
      },
      {
        new: true,
      }
    );

    res.status(200).json(updated);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
});
router.delete("/:itemid", async (req, res) => {
  try {
    await Bag.findByIdAndDelete(req.params.itemid);
    res.status(200).json({ message: "Item removed from bag" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error removing item from bag" });
  }
});
module.exports = router;
