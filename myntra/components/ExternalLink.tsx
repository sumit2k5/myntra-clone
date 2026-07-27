import React from "react";
import { Link } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { Platform } from "react-native";

type Props = {
  href: string;
  children?: React.ReactNode;
};

export function ExternalLink({ href, children }: Props) {
  return (
    <Link
      href={href as any}
      target="_blank"
      onPress={async (event) => {
        if (Platform.OS !== "web") {
          event.preventDefault();
          await openBrowserAsync(href);
        }
      }}
    >
      {children}
    </Link>
  );
}