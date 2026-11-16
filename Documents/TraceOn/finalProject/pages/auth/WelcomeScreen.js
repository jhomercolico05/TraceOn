import React from "react";
import { View, Text, Pressable, ImageBackground, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const SCHOOL_BG = require("../../assets/images/cvsu.png");

const FEATURES = [
  {
    icon: "people-outline",
    title: "Community wall",
    desc: "Every lost & found post in one feed.",
  },
  {
    icon: "location-outline",
    title: "2D campus map",
    desc: "Pin the exact building or room.",
  },
  {
    icon: "shield-checkmark-outline",
    title: "Verified claims",
    desc: "Proof of ownership before release.",
  },
];

export default function WelcomeScreen({ navigation }) {
  return (
    <View className="flex-1 bg-primary-dark">
      <StatusBar barStyle="light-content" />

      {/* Background photo + green overlay so the white text stays readable */}
      <ImageBackground source={SCHOOL_BG} resizeMode="cover" className="flex-1">
        <View className="absolute inset-0 bg-primary-dark/85" />

        {/* ---------- TOP SECTION ---------- */}
        <SafeAreaView edges={["top"]} className="flex-1">
          <View className="flex-1 px-6 pt-4">
            {/* Logo row + campus pill */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="h-11 w-11 items-center justify-center rounded-xl bg-primary">
                  <Ionicons name="location-outline" size={22} color="#fff" />
                  <View className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-accent" />
                </View>
                <Text className="ml-3 text-[26px] font-semibold text-white">
                  Trace<Text className="text-accent">On</Text>
                </Text>
              </View>

              <View className="flex-row items-center rounded-full border border-white/30 px-3 py-1.5">
                <Ionicons name="school-outline" size={14} color="#fff" />
                <Text className="ml-1.5 text-[11px] font-medium text-white">
                  CvSU MAIN
                </Text>
              </View>
            </View>

            {/* Hero text */}
            <View className="mt-8">
              <Text className="text-[11px] font-semibold tracking-widest text-accent">
                CAMPUS LOST & FOUND
              </Text>
              <Text className="mt-3 text-[38px] font-bold leading-[44px] text-white">
                Lost it?{"\n"}Trace it back.
              </Text>
              <Text className="mt-4 text-[14px] leading-5 text-white/80">
                One app for reporting, tracking, and claiming lost items across
                the CvSU Main Campus.
              </Text>
            </View>
          </View>
        </SafeAreaView>

        {/* ---------- BOTTOM SHEET ---------- */}
        <View className="rounded-t-[28px] bg-cream px-6 pt-6">
          <Text className="text-[22px] font-bold text-primary-dark">
            Find it. Claim it. Move on.
          </Text>
          <Text className="mt-1 text-[13px] text-gray-500">
            Built for the CvSU Main Campus community.
          </Text>

          <View className="mt-5">
            {FEATURES.map((f) => (
              <View key={f.title} className="mb-4 flex-row items-center">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Ionicons name={f.icon} size={20} color="#14614A" />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-[14px] font-semibold text-gray-900">
                    {f.title}
                  </Text>
                  <Text className="text-[12px] text-gray-500">{f.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          <SafeAreaView edges={["bottom"]}>
            <Pressable
              onPress={() => navigation?.navigate("Login")}
              className="mt-1 flex-row items-center justify-center rounded-2xl bg-primary py-4 active:opacity-90"
            >
              <Text className="text-[16px] font-semibold text-white">
                Get started
              </Text>
              <Ionicons
                name="arrow-forward"
                size={18}
                color="#fff"
                style={{ marginLeft: 6 }}
              />
            </Pressable>

            <Pressable
              onPress={() => navigation?.navigate("Register")}
              className="items-center py-4"
            >
              <Text className="text-[13px] text-gray-500">
                New here?{" "}
                <Text className="font-semibold text-primary">
                  Create an account
                </Text>
              </Text>
            </Pressable>
          </SafeAreaView>
        </View>
      </ImageBackground>
    </View>
  );
}