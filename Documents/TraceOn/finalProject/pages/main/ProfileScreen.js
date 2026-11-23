import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const MENU = [
  { key: "reports", label: "My reports", icon: "list-outline", hint: "12" },
  { key: "saved", label: "Saved items", icon: "bookmark-outline", hint: "3" },
  {
    key: "notifications",
    label: "Notifications",
    icon: "notifications-outline",
    hint: "On",
  },
  {
    key: "privacy",
    label: "Privacy & safety",
    icon: "shield-checkmark-outline",
  },
  { key: "help", label: "Help center", icon: "help-circle-outline" },
];

export default function ProfileScreen({ navigation }) {
  return (
    <SafeAreaView className="flex-1 bg-[#F7F3EA]">
      <ScrollView
        className="px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28 }}
      >
        <View className="mt-3">
          <Text className="text-[11px] font-semibold tracking-widest text-primary">
            ACCOUNT
          </Text>
          <Text className="mt-1 text-[25px] font-bold text-gray-900">Profile</Text>
        </View>

        {/* Identity card */}
        <View className="mt-4 rounded-2xl bg-primary-dark p-5">
          <View className="flex-row items-center">
            <View className="h-14 w-14 items-center justify-center rounded-full bg-white/15">
              <Text className="text-[22px] font-bold text-white">D</Text>
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-[18px] font-bold text-white">
                Darrelle Santos
              </Text>
              <Text className="mt-0.5 text-[12px] text-white/70">
                darrelle.santos@cvsu.edu.ph
              </Text>
            </View>
            <Pressable
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Edit profile"
              className="h-9 w-9 items-center justify-center rounded-full bg-white/15"
            >
              <Ionicons name="pencil" size={15} color="#fff" />
            </Pressable>
          </View>

          <View className="mt-4 flex-row items-center rounded-xl bg-white/10 px-3 py-2">
            <Ionicons name="school-outline" size={15} color="#D9E6DF" />
            <Text className="ml-2 text-[12px] text-white/80">
              CvSU Main Campus · BS Computer Science
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View className="mt-3 flex-row gap-3">
          {[
            { label: "Reports", value: "12" },
            { label: "Returned", value: "4" },
            { label: "Trust score", value: "98" },
          ].map((stat) => (
            <View
              key={stat.label}
              className="flex-1 items-center rounded-2xl border border-[#E4E6D8] bg-white py-3"
            >
              <Text className="text-[18px] font-bold text-gray-900">
                {stat.value}
              </Text>
              <Text className="mt-0.5 text-[11px] text-gray-500">
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Menu */}
        <View className="mt-4 overflow-hidden rounded-2xl border border-[#E4E6D8] bg-white">
          {MENU.map((item, index) => (
            <Pressable
              key={item.key}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              className={`flex-row items-center px-4 py-3.5 ${
                index < MENU.length - 1 ? "border-b border-[#F0EFE7]" : ""
              }`}
            >
              <View className="h-9 w-9 items-center justify-center rounded-xl bg-[#F2F0E8]">
                <Ionicons name={item.icon} size={18} color="#14614A" />
              </View>
              <Text className="ml-3 flex-1 text-[14px] font-medium text-gray-800">
                {item.label}
              </Text>
              {item.hint ? (
                <Text className="mr-2 text-[12px] text-gray-400">
                  {item.hint}
                </Text>
              ) : null}
              <Ionicons name="chevron-forward" size={16} color="#C2C7C3" />
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={() => navigation?.reset("Welcome")}
          accessibilityRole="button"
          className="mt-4 h-12 flex-row items-center justify-center rounded-2xl border border-[#E4E6D8] bg-white"
        >
          <Ionicons name="log-out-outline" size={18} color="#B42318" />
          <Text className="ml-2 text-[14px] font-semibold text-[#B42318]">
            Sign out
          </Text>
        </Pressable>

        <Text className="mt-4 text-center text-[11px] text-gray-400">
          TraceOn · CvSU Main Campus
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}