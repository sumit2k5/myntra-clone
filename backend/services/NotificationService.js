const { Expo } = require("expo-server-sdk");

const expo = new Expo();

async function sendNotification(pushToken, title, body) {
  try {
    if (!pushToken) {
      return;
    }

    if (!Expo.isExpoPushToken(pushToken)) {
      console.log("Invalid Expo Push Token");
      return;
    }

    const messages = [
      {
        to: pushToken,
        sound: "default",
        title,
        body,
      },
    ];

    const chunks = expo.chunkPushNotifications(messages);

    for (const chunk of chunks) {
      try {
        let success = false;
let attempts = 0;

while (!success && attempts < 3) {
  try {
    await expo.sendPushNotificationsAsync(chunk);
    success = true;
  } catch (error) {
    attempts++;

    console.log(
      `Notification retry ${attempts}`
    );

    if (attempts === 3) {
      console.log(
        "Notification failed permanently"
      );
    }
  }
}
      } catch (error) {
        console.log(error);
      }
    }

  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  sendNotification,
};