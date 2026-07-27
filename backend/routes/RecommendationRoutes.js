const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const RecentlyViewed = require("../models/RecentlyViewed");
const Wishlist = require("../models/Wishlist");
router.get("/:userId", async (req, res) => {
  try {

    const userId = req.params.userId;

    let recommendations = [];
    // Get last 50 viewed products

const history = await RecentlyViewed.find({
  userId,
})
  .populate("productId")
  .sort({ viewedAt: -1 })
  .limit(50);
  // Categories from browsing history

const categories = [
  ...new Set(
    history.map(
      (item) => item.productId?.category
    )
  ),
];
const viewedIds = history.map(
  (item) => item.productId._id
);
const historyRecommendations =
  await Product.find({

    category: {
      $in: categories,
    },

    _id: {
      $nin: viewedIds,
    },

    isAvailable: true,

  })
    .sort({
      popularity: -1,
    })
    .limit(10);

recommendations.push(
  ...historyRecommendations
);
// Get Wishlist

const wishlist = await Wishlist.find({
  userId,
}).populate("productId");
const wishlistCategories = [
  ...new Set(
    wishlist.map(
      (item) => item.productId?.category
    )
  ),
];
const wishlistIds = wishlist.map(
  (item) => item.productId._id
);
const wishlistRecommendations =
  await Product.find({

    category: {
      $in: wishlistCategories,
    },

    _id: {
      $nin: [
        ...viewedIds,
        ...wishlistIds,
      ],
    },

    isAvailable: true,

  })
    .sort({
      popularity: -1,
    })
    .limit(10);

recommendations.push(
  ...wishlistRecommendations
);

    // We'll build this step by step
recommendations = [
  ...new Map(
    recommendations.map((item) => [
      item._id.toString(),
      item,
    ])
  ).values(),
];
recommendations = recommendations.slice(0, 10);
// If recommendations are less than 10,
// fill remaining with most popular products

if (recommendations.length < 10) {

  const existingIds = recommendations.map(
    (item) => item._id
  );

  const popularProducts = await Product.find({

    _id: {
      $nin: existingIds,
    },

    isAvailable: true,

  })
    .sort({
      popularity: -1,
    })
    .limit(10 - recommendations.length);

  recommendations.push(...popularProducts);

}
    res.status(200).json(recommendations);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });

  }
});
module.exports = router;