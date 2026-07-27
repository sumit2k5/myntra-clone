const express = require("express");
const Wishlist = require("../models/Wishlist");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const existingItem = await Wishlist.findOne({
      userId,
      productId,
    });

    if (existingItem) {
      return res.status(200).json({
        message: "Already in wishlist",
        item: existingItem,
      });
    }

    const wishlistItem = new Wishlist({
      userId,
      productId,
    });

    await wishlistItem.save();

    res.status(201).json(wishlistItem);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

router.get("/:userid", async (req, res) => {
  try {
    const bag = await Wishlist.find({ userId: req.params.userid }).populate(
      "productId"
    );
    res.status(200).json(bag);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

router.delete("/:itemid", async (req, res) => {
  try {
    await Wishlist.findByIdAndDelete(req.params.itemid);
    res.status(200).json({ message: "Item removed from Wishlist" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error removing item from Wishlist" });
  }
});
module.exports = router;
