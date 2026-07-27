import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MapPin } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import { useThemeContext } from "@/context/ThemeContext";

export default function Addresses() {
  const { theme } = useThemeContext();
  const colors = Colors[theme];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <MapPin size={70} color={colors.primary} />

      <Text
        style={[
          styles.title,
          { color: colors.text },
        ]}
      >
        Addresses
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: colors.text },
        ]}
      >
        You haven't added any address yet.
      </Text>

      <Text
        style={[
          styles.note,
          { color: colors.primary },
        ]}
      >
        Coming Soon 🚀
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
  note: {
    fontSize: 18,
    marginTop: 20,
    fontWeight: "bold",
  },
});