import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import CampusMap from "../../components/CampusMap";
import { BUILDINGS, CAMPUS, ITEMS } from "../../data/campusMap";

const CATEGORIES = [
  "Electronics",
  "IDs & Cards",
  "Wallets",
  "Bags",
  "Books",
  "Others",
];

export default function ReportScreen({ navigation }) {
  const [kind, setKind] = useState("lost");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [pin, setPin] = useState(null);
  const [error, setError] = useState("");
  const [posted, setPosted] = useState(false);

  const accent = kind === "lost" ? "#B42318" : "#14614A";

  function submit() {
    if (!title.trim()) {
      setError("Give the item a short name so people can recognise it.");
      return;
    }
    if (!pin) {
      setError("Tap the campus map to drop a pin where it was lost or found.");
      return;
    }
    setError("");
    setPosted(true);
  }

  function reset() {
    setTitle("");
    setDescription("");
    setCategory("Electronics");
    setPin(null);
    setError("");
    setPosted(false);
  }

  if (posted) {
    return (
      <SafeAreaView className="flex-1 bg-[#F7F3EA]">
        <View className="flex-1 items-center justify-center px-6">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Ionicons name="checkmark-circle" size={38} color="#14614A" />
          </View>
          <Text className="mt-4 text-[22px] font-bold text-gray-900">
            Report posted
          </Text>
          <Text className="mt-2 text-center text-[13px] leading-5 text-gray-500">
            {title.trim()} is now on the community wall. We will alert you when a
            possible match appears.
          </Text>
          <View className="mt-6 w-full flex-row gap-3">
            <Pressable
              onPress={() => navigation?.navigate("Map")}
              className="h-12 flex-1 flex-row items-center justify-center rounded-2xl bg-primary"
            >
              <Ionicons name="map-outline" size={18} color="#fff" />
              <Text className="ml-2 font-semibold text-white">View on map</Text>
            </Pressable>
            <Pressable
              onPress={reset}
              className="h-12 flex-1 items-center justify-center rounded-2xl border border-[#E4E6D8] bg-white"
            >
              <Text className="font-semibold text-gray-700">Report another</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F7F3EA]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          className="px-4"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 28 }}
        >
          <View className="mt-3">
            <Text className="text-[11px] font-semibold tracking-widest text-primary">
              NEW REPORT
            </Text>
            <Text className="mt-1 text-[25px] font-bold text-gray-900">
              Report an item
            </Text>
            <Text className="mt-1 text-[13px] text-gray-500">
              Pin the place on the campus map so people nearby can find it.
            </Text>
          </View>

          {/* Lost / Found toggle */}
          <View className="mt-5 flex-row rounded-2xl bg-black/5 p-1">
            {["lost", "found"].map((option) => {
              const active = kind === option;
              return (
                <Pressable
                  key={option}
                  onPress={() => setKind(option)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  className={`h-11 flex-1 flex-row items-center justify-center rounded-xl ${
                    active ? "bg-white" : ""
                  }`}
                >
                  <Ionicons
                    name={option === "lost" ? "alert-circle" : "checkmark-circle"}
                    size={17}
                    color={active ? accent : "#8A938C"}
                  />
                  <Text
                    className={`ml-2 text-[14px] font-semibold ${
                      active ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {option === "lost" ? "I lost it" : "I found it"}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Item details */}
          <View className="mt-4 rounded-2xl border border-[#E4E6D8] bg-white p-4">
            <Text className="mb-1.5 text-[13px] font-medium text-gray-800">
              Item name
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Navy blue backpack"
              placeholderTextColor="#9CA3AF"
              className="h-12 rounded-xl border border-[#E4E6D8] bg-[#FBFBF6] px-3 text-[15px] text-gray-900"
            />

            <Text className="mb-1.5 mt-4 text-[13px] font-medium text-gray-800">
              Description
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Colour, brand, marks, what was inside..."
              placeholderTextColor="#9CA3AF"
              multiline
              className="min-h-[76px] rounded-xl border border-[#E4E6D8] bg-[#FBFBF6] px-3 py-2 text-[15px] text-gray-900"
              style={{ textAlignVertical: "top" }}
            />

            <Text className="mb-2 mt-4 text-[13px] font-medium text-gray-800">
              Category
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {CATEGORIES.map((item) => {
                const active = item === category;
                return (
                  <Pressable
                    key={item}
                    onPress={() => setCategory(item)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    className={`rounded-full border px-3 py-1.5 ${
                      active
                        ? "border-primary-dark bg-primary-dark"
                        : "border-[#E4E6D8] bg-white"
                    }`}
                  >
                    <Text
                      className={`text-[12px] ${
                        active ? "font-semibold text-white" : "text-gray-700"
                      }`}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable className="mt-4 h-20 items-center justify-center rounded-xl border border-dashed border-[#C9CCBF] bg-[#FBFBF6]">
              <Ionicons name="camera-outline" size={22} color="#8A938C" />
              <Text className="mt-1 text-[12px] text-gray-500">Add a photo</Text>
            </Pressable>
          </View>

          {/* Location picker */}
          <View className="mt-4 rounded-2xl border border-[#E4E6D8] bg-white p-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-[13px] font-medium text-gray-800">
                Where on campus?
              </Text>
              {pin ? (
                <Text className="text-[11px] font-medium text-primary">
                  Pin dropped
                </Text>
              ) : (
                <Text className="text-[11px] text-gray-400">Required</Text>
              )}
            </View>

            <View className="mt-3 h-[210px] overflow-hidden rounded-xl border border-[#E4E6D8]">
              <CampusMap
                campus={CAMPUS}
                buildings={BUILDINGS}
                items={ITEMS}
                pickMode
                pin={pin}
                onPick={setPin}
              />
            </View>

            <View className="mt-2 flex-row items-center">
              <Ionicons name="location-outline" size={14} color="#8A938C" />
              <Text className="ml-1 flex-1 text-[11px] text-gray-500">
                {pin
                  ? `Pinned at ${pin.lat.toFixed(5)}, ${pin.lng.toFixed(5)}`
                  : "Tap the map to drop a pin on the exact spot."}
              </Text>
              {pin ? (
                <Pressable onPress={() => setPin(null)} hitSlop={8}>
                  <Text className="text-[11px] font-semibold text-primary">
                    Clear
                  </Text>
                </Pressable>
              ) : null}
            </View>
          </View>

          {error ? (
            <View className="mt-4 flex-row items-center rounded-xl bg-red-50 px-3 py-2.5">
              <Ionicons name="alert-circle" size={16} color="#B42318" />
              <Text className="ml-2 flex-1 text-[12px] text-red-700">{error}</Text>
            </View>
          ) : null}

          <Pressable
            onPress={submit}
            accessibilityRole="button"
            className="mt-4 h-14 flex-row items-center justify-center rounded-2xl bg-primary active:opacity-90"
          >
            <Ionicons name="send" size={17} color="#fff" />
            <Text className="ml-2 text-[16px] font-semibold text-white">
              Post {kind} report
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}