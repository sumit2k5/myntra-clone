const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Register Expo Push Token

router.post("/register", async (req, res) => {
  try {
    const { userId, expoPushToken } = req.body;

    await User.findByIdAndUpdate(userId, {
      expoPushToken,
    });

    res.status(200).json({
      message: "Push token registered successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

module.exports = router;