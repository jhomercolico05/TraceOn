import React from "react";
import { View, Text, ScrollView, Pressable, TextInput, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../../context/AuthProvider";

export default function HomeScreen({ navigation }) {
  const { profile, session } = useAuth();
  const fullName = profile?.full_name || session?.user?.user_metadata?.full_name || "";
  const firstName = fullName.trim().split(" ")[0] || "there";
  const initial = firstName.charAt(0).toUpperCase() || "T";

  return (
    <SafeAreaView className="flex-1 bg-[#F7F3EA]">
      <ScrollView className="px-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mt-4 flex-row items-center justify-between">
          <View>
            <Text className="text-[14px] text-gray-500">Good afternoon,</Text>
            <Text className="text-[24px] font-bold text-gray-900">{firstName}</Text>
            <Text className="text-[12px] text-gray-400">Wednesday, November 11 · CvSU Main Campus</Text>
          </View>
          <View className="flex-row items-center gap-3">
            <View className="relative">
              <Ionicons name="notifications-outline" size={24} color="#1F2937" />
              <View className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 items-center justify-center">
                <Text className="text-[9px] font-bold text-white">3</Text>
              </View>
            </View>
            <View className="h-10 w-10 rounded-full bg-primary items-center justify-center">
              <Text className="font-bold text-white">{initial}</Text>
            </View>
          </View>
        </View>

        {/* Search */}
        <View className="mt-6 h-12 flex-row items-center rounded-xl bg-white border border-gray-200 px-4">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput placeholder="Search items, locations, categories..." className="ml-3 flex-1 text-[14px]" />
          <Ionicons name="options-outline" size={20} color="#9CA3AF" />
        </View>

        {/* Action Banner */}
        <View className="mt-6 rounded-3xl bg-[#0E4A38] p-5">
          <View className="flex-row items-center bg-[#196B52] self-start px-2 py-1 rounded-full mb-3">
            <Ionicons name="flash" size={12} color="#F59E0B" />
            <Text className="text-[10px] font-bold text-white ml-1 uppercase">Report in under a minute</Text>
          </View>
          <Text className="text-[20px] font-bold text-white">Lost something on campus?</Text>
          <Text className="text-[13px] text-white/80 mt-1 mb-4">Post it with a photo and a pin on the campus map. We will alert you when a match appears.</Text>
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => navigation?.navigate("Report")}
              className="flex-1 bg-[#F59E0B] py-3 rounded-xl items-center flex-row justify-center"
            >
              <Ionicons name="add" size={18} color="#000" />
              <Text className="font-semibold text-black ml-1">Report lost</Text>
            </Pressable>
            <Pressable
              onPress={() => navigation?.navigate("Report")}
              className="flex-1 bg-white py-3 rounded-xl items-center flex-row justify-center"
            >
              <Ionicons name="heart-outline" size={18} color="#0E4A38" />
              <Text className="font-semibold text-[#0E4A38] ml-1">Post found</Text>
            </Pressable>
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row mt-6 gap-3">
          {[
            { label: "Lost", value: "5", icon: "alert-circle-outline", color: "#B42318" },
            { label: "Found", value: "4", icon: "checkmark-circle-outline", color: "#14614A" },
            { label: "Returned", value: "2", icon: "heart-outline", color: "#F59E0B" },
          ].map((stat, i) => (
            <View key={i} className="flex-1 bg-white p-4 rounded-2xl border border-gray-100">
              <Ionicons name={stat.icon} size={20} color={stat.color} />
              <Text className="text-[20px] font-bold mt-2">{stat.value}</Text>
              <Text className="text-[12px] text-gray-500">{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Community Wall */}
        <View className="mt-8 mb-20">
          <View className="flex-row justify-between items-end mb-4">
            <Text className="text-[18px] font-bold">Community wall</Text>
            <Pressable onPress={() => navigation?.navigate("Map")}>
              <Text className="text-primary font-semibold">Explore ↗</Text>
            </Pressable>
          </View>
          <Text className="text-gray-500 text-[12px] mb-4">15 reports · updated live</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            {['All 15', 'Lost', 'Found', 'Returned'].map((f, i) => (
              <Pressable key={i} className={`px-4 py-2 rounded-full mr-2 ${i === 0 ? 'bg-[#0E4A38]' : 'bg-white border border-gray-200'}`}>
                <Text className={i === 0 ? 'text-white' : 'text-gray-900'}>{f}</Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Sample Item Card */}
          <View className="bg-white p-4 rounded-2xl border border-gray-100">
            <View className="flex-row items-center mb-2">
              <View className="bg-red-100 px-2 py-0.5 rounded-full mr-2"><Text className="text-red-700 text-[10px] font-bold">LOST</Text></View>
              <Text className="text-gray-400 text-[12px]">2h ago</Text>
            </View>
            <Text className="text-[16px] font-bold">Navy blue Jansport backpack</Text>
            <View className="flex-row items-center mt-1"><Ionicons name="location-outline" size={14} color="#6B7280"/><Text className="text-gray-600 ml-1">Library · 2nd floor — study area</Text></View>
            <View className="bg-amber-50 border border-amber-100 p-2 rounded-lg mt-3 flex-row items-center">
              <Ionicons name="flash" size={14} color="#D97706" />
              <Text className="text-amber-800 text-[12px] font-semibold ml-1">2 possible matches nearby</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
