const express = require("express");
const router = express.Router();

const Bag = require("../models/Bag");
const SavedItem = require("../models/SavedItem");

// =========================
// Save Item For Later
// =========================

router.post("/", async (req, res) => {
  try {
    const { bagItemId } = req.body;

    const bagItem = await Bag.findById(bagItemId);

    if (!bagItem) {
      return res.status(404).json({
        message: "Bag item not found",
      });
    }

    const alreadySaved = await SavedItem.findOne({
      userId: bagItem.userId,
      productId: bagItem.productId,
      size: bagItem.size,
    });

    if (!alreadySaved) {
      await SavedItem.create({
        userId: bagItem.userId,
        productId: bagItem.productId,
        size: bagItem.size,
        quantity: bagItem.quantity,
      });
    }

    await Bag.findByIdAndDelete(bagItemId);

    res.json({
      message: "Saved for later",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

// =========================
// Get Saved Items
// =========================

router.get("/:userid", async (req, res) => {
  try {

    const items = await SavedItem.find({
      userId: req.params.userid,
    }).populate("productId");

    res.json(items);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

// =========================
// Move Back To Bag
// =========================

router.post("/move", async (req, res) => {
  try {

    const { savedItemId } = req.body;

    const saved = await SavedItem.findById(savedItemId);

    if (!saved) {
      return res.status(404).json({
        message: "Saved item not found",
      });
    }

    const existingBag = await Bag.findOne({
      userId: saved.userId,
      productId: saved.productId,
      size: saved.size,
    });

    if (existingBag) {
      existingBag.quantity += saved.quantity;
      await existingBag.save();
    } else {
      await Bag.create({
        userId: saved.userId,
        productId: saved.productId,
        size: saved.size,
        quantity: saved.quantity,
      });
    }

    await SavedItem.findByIdAndDelete(savedItemId);

    res.json({
      message: "Moved to bag",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

// =========================
// Delete Saved Item
// =========================

router.delete("/:id", async (req, res) => {

  try {

    await SavedItem.findByIdAndDelete(req.params.id);

    res.json({
      message: "Deleted",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });

  }

});

module.exports = router;