const express = require("express");
const router = express.Router();

const RecentlyViewed = require("../models/RecentlyViewed");

// Add / Update Recently Viewed
router.post("/", async (req, res) => {
  try {
    const { userId, productId } = req.body;

   await RecentlyViewed.findOneAndUpdate(
  {
    userId,
    productId,
  },
  {
    $set: {
      viewedAt: new Date(),
    },
  },
  {
    upsert: true,
    new: true,
  }
);
await RecentlyViewed.deleteMany({

  viewedAt: {

    $lt: new Date(
      Date.now() - 30 * 24 * 60 * 60 * 1000
    ),

  },

});
    const allItems = await RecentlyViewed.find({ userId })
      .sort({ viewedAt: -1 });

    if (allItems.length > 20) {
      const extraItems = allItems.slice(20);

      for (const item of extraItems) {
        await RecentlyViewed.findByIdAndDelete(item._id);
      }
    }

    res.status(200).json({
      message: "Recently viewed updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

// Get Recently Viewed
router.get("/:userId", async (req, res) => {
  try {
    const items = await RecentlyViewed.find({
      userId: req.params.userId,
    })
      .populate("productId")
      .sort({ viewedAt: -1 });

    res.status(200).json(items);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

module.exports = router;