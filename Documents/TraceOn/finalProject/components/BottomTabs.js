import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TABS = [
  { key: "Home", label: "Home", icon: "home-outline", activeIcon: "home" },
  { key: "Map", label: "Map", icon: "map-outline", activeIcon: "map" },
  { key: "Report", label: "Report" },
  {
    key: "Claims",
    label: "Claims",
    icon: "clipboard-outline",
    activeIcon: "clipboard",
  },
  { key: "Profile", label: "Profile", icon: "person-outline", activeIcon: "person" },
];

const GREEN = "#14614A";
const MUTED = "#8A938C";

export default function BottomTabs({ current, onNavigate }) {
  return (
    <View className="flex-row items-end justify-around border-t border-[#E4E6D8] bg-white px-1 pt-2">
      {TABS.map((tab) => {
        const active = tab.key === current;

        if (tab.key === "Report") {
          return (
            <Pressable
              key={tab.key}
              onPress={() => onNavigate(tab.key)}
              accessibilityRole="button"
              accessibilityLabel="Report an item"
              className="flex-1 items-center"
            >
              <View
                className="h-[50px] w-[50px] items-center justify-center rounded-2xl bg-primary"
                style={{
                  marginTop: -16,
                  shadowColor: "#14614A",
                  shadowOpacity: 0.28,
                  shadowRadius: 10,
                  shadowOffset: { width: 0, height: 5 },
                  elevation: 5,
                }}
              >
                <Ionicons name="add" size={30} color="#fff" />
              </View>
              <Text
                className={`mt-1 text-[11px] ${
                  active ? "font-semibold text-primary" : "text-gray-400"
                }`}
              >
                {tab.label}
              </Text>
              <View className="h-1.5" />
            </Pressable>
          );
        }

        return (
          <Pressable
            key={tab.key}
            onPress={() => onNavigate(tab.key)}
            accessibilityRole="button"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: active }}
            className="flex-1 items-center pb-1.5"
          >
            <View
              className={`h-9 items-center justify-center rounded-xl px-3.5 ${
                active ? "bg-[#E7F0EA]" : ""
              }`}
            >
              <Ionicons
                name={active ? tab.activeIcon : tab.icon}
                size={22}
                color={active ? GREEN : MUTED}
              />
            </View>
            <Text
              className={`mt-1 text-[11px] ${
                active ? "font-semibold text-primary" : "text-gray-400"
              }`}
            >
              {tab.label}
            </Text>
            <View
              className={`mt-1 h-1 w-1 rounded-full ${
                active ? "bg-primary" : "bg-transparent"
              }`}
            />
          </Pressable>
        );
      })}
    </View>
  );
}