import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const STORAGE_KEY = "guestHistory";

export const mergeGuestHistory = async (userId: string) => {
  try {
    // Guest history
    const localData = await AsyncStorage.getItem(STORAGE_KEY);
    const guestHistory = localData ? JSON.parse(localData) : [];

    if (guestHistory.length === 0) return;

    // Server history
    const res = await axios.get(
      `http://localhost:5000/recently-viewed/${userId}`
    );

    const serverHistory = res.data;

    // Merge without duplicates
    const merged = [...serverHistory];

    guestHistory.forEach((guestItem: any) => {
      const exists = merged.find(
        (item: any) =>
          item.productId?._id === guestItem._id
      );

      if (!exists) {
        merged.unshift({
          productId: guestItem,
        });
      }
    });

    // Keep latest 20
    const latest20 = merged.slice(0, 20);

    // Upload missing guest items
    for (const item of latest20) {
      await axios.post(
        "http://localhost:5000/recently-viewed",
        {
          userId,
          productId: item.productId._id,
        }
      );
    }

    // Clear guest history
    await AsyncStorage.removeItem(STORAGE_KEY);

  } catch (error) {
    console.log("Merge Error:", error);
  }
};