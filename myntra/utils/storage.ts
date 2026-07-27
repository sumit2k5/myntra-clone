import { Platform } from "react-native";

let SecureStore: any = null;

if (Platform.OS !== "web") {
  SecureStore = require("expo-secure-store");
}


export const saveUserData = async (
  _id: string,
  name: string,
  email: string
) => {
  try {
    if (Platform.OS === "web") {
      localStorage.setItem("userid", _id);
      localStorage.setItem("userName", name);
      localStorage.setItem("userEmail", email);
      return;
    }

    await SecureStore.setItemAsync("userid", _id);
    await SecureStore.setItemAsync("userName", name);
    await SecureStore.setItemAsync("userEmail", email);
  } catch (error) {
    console.log("Save Error:", error);
  }
};

export const getUserData = async () => {
  try {
    if (Platform.OS === "web") {
      return {
        _id: localStorage.getItem("userid"),
        name: localStorage.getItem("userName"),
        email: localStorage.getItem("userEmail"),
      };
    }

    return {
      _id: await SecureStore.getItemAsync("userid"),
      name: await SecureStore.getItemAsync("userName"),
      email: await SecureStore.getItemAsync("userEmail"),
    };
  } catch (error) {
    console.log("Get Error:", error);

    return {
      _id: null,
      name: null,
      email: null,
    };
  }
};

export const clearUserData = async () => {
  try {
    if (Platform.OS === "web") {
      localStorage.removeItem("userid");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      return;
    }

    await SecureStore.deleteItemAsync("userid");
    await SecureStore.deleteItemAsync("userName");
    await SecureStore.deleteItemAsync("userEmail");
  } catch (error) {
    console.log("Delete Error:", error);
  }
};