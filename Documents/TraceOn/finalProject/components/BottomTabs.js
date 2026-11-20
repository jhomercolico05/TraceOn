import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TABS = [
  { key: "Home", label: "Home", icon: "home" },
  { key: "Map", label: "Map", icon: "map" },
  { key: "Report", label: "Report", icon: "add-circle" },
  { key: "Claims", label: "Claims", icon: "document-text" },
  { key: "Profile", label: "Profile", icon: "person" },
];

export default function BottomTabs({ current, onNavigate }) {
  return (
    <View className="flex-row items-center justify-around border-t border-[#E4E6D8] bg-white pb-2 pt-2">
      {TABS.map((tab) => {
        const active = tab.key === current;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onNavigate(tab.key)}
            className="flex-1 flex-col items-center justify-center"
          >
            <View
              className={
                tab.key === "Report"
                  ? "h-11 w-11 items-center justify-center rounded-full bg-primary"
                  : "items-center justify-center"
              }
            >
              <Ionicons
                name={tab.key === "Report" ? "add-circle" : tab.icon}
                size={24}
                color={active ? "#14614A" : "#9CA3AF"}
              />
            </View>
            <Text
              className={`mt-0.5 text-[11px] font-medium ${
                active ? "text-primary" : "text-gray-400"
              }`}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}