const cron = require("node-cron");
const Bag = require("../models/Bag");
const User = require("../models/User");
const { sendNotification } = require("../services/NotificationService");

cron.schedule("* * * * *", async () => {
  console.log("Checking abandoned carts...");

  const bags = await Bag.find().populate("userId");

  for (const item of bags) {
    const user = await User.findById(item.userId);

    if (!user) continue;

    if (!user.notificationEnabled) continue;

    if (!user.expoPushToken) continue;
if (
  user.lastNotification &&
  Date.now() -
    new Date(user.lastNotification).getTime() <
    60 * 60 * 1000
) {
  continue;
}
    await sendNotification(
      user.expoPushToken,
      "Items waiting in your Bag 🛍️",
      "Complete your purchase before the products sell out!"
    );

    user.lastNotification = new Date();
    await user.save();
  }
});