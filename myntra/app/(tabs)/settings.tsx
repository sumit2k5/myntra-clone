import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Settings } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import { useThemeContext } from "@/context/ThemeContext";

export default function SettingsPage() {
  const { theme } = useThemeContext();
  const colors = Colors[theme];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <Settings size={70} color={colors.primary} />

      <Text
        style={[
          styles.title,
          { color: colors.text },
        ]}
      >
        Settings
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: colors.text },
        ]}
      >
        More settings will be available in future updates.
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