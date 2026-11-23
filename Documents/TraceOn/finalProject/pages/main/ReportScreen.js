import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthProvider";

const CATEGORIES = [
  "Electronics",
  "IDs & Cards",
  "Wallets",
  "Bags",
  "Books",
  "Others",
];

export default function ReportScreen({ navigation }) {
  const { session } = useAuth();
  const [kind, setKind] = useState("lost");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [pin, setPin] = useState(null);
  const [error, setError] = useState("");
  const [posted, setPosted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);

  // Category ids live in the database; fall back to the local labels if the
  // lookup has not loaded yet.
  useEffect(() => {
    let active = true;
    supabase
      .from("categories")
      .select("id, slug, label")
      .order("id")
      .then(({ data }) => {
        if (active && data) setCategories(data);
      });
    return () => {
      active = false;
    };
  }, []);

  const accent = kind === "lost" ? "#B42318" : "#14614A";

  async function submit() {
    if (submitting) return;

    if (!title.trim()) {
      setError("Give the item a short name so people can recognise it.");
      return;
    }

    const titleTrimmed = title.trim()
    if (titleTrimmed.length < 3) {
      setError("Title must be at least 3 characters long");
      return;
    }
    if (titleTrimmed.length > 120) {
      setError("Title must be at most 120 characters long");
      return;
    }

    // Validate pin: must be an object with numeric lat/lng
    const hasValidPin = pin != null &&
      !isNaN(pin.lat) && !isNaN(pin.lng);

    if (!hasValidPin) {
      setError("Tap the campus map to drop a pin where it was lost or found.");
      return;
    }
    if (!session?.user?.id) {
      setError("Your session expired. Please sign in again.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      const categoryRow = categories.find((row) => row.label === category);

      const { error: insertError } = await supabase.from("reports").insert({
        reporter_id: session.user.id,
        type: kind,
        title: titleTrimmed,
        description: description.trim(),
        category_id: categoryRow?.id ?? null,
        lat: Number(pin.lat),
        lon: Number(pin.lng),
      });

      if (insertError) throw insertError;
      setPosted(true);
    } catch (err) {
      setError(err.message || "Could not post the report. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 28 }}
        >
          <View className="mt-3">
            <Text className="text-[11px] font-semibold tracking-widest text-primary">
              NEW REPORT
            </Text>
            <Text className="mt-1 text-[25px] font-bold text-gray-900">
              Report an item
            </Text>
          </View>

          {/* Form Card */}
          <View className="mt-5 rounded-2xl border border-[#E4E6D8] bg-white p-4">
            {/* Lost / Found toggle */}
            <View className="flex-row mb-4">
              <Pressable
                onPress={() => setKind("lost")}
                className={`flex-1 h-12 flex-row items-center justify-center rounded-xl font-semibold ${kind === "lost" ? "bg-[#E7F0EA] text-[#B42318]" : "bg-white text-gray-600 border border-gray-200"}`}
              >
                Lost
              </Pressable>
              <Pressable
                onPress={() => setKind("found")}
                className={`flex-1 h-12 flex-row items-center justify-center rounded-xl font-semibold ${kind === "found" ? "bg-[#E7F0EA] text-[#14614A]" : "bg-white text-gray-600 border border-gray-200"}`}
              >
                Found
              </Pressable>
            </View>

            {/* Title */}
            <View className="mb-3">
              <Text className="mb-1.5 text-[13px] font-medium text-gray-800">
                Item title
              </Text>
              <TextInput
                placeholder="e.g. Navy blue Jansport backpack"
                placeholderTextColor="#9CA3AF"
                className="h-14 rounded-xl border border-[#E4E6D8] bg-[#FBFBF6] px-4 text-[15px] font-medium text-gray-900"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* Description */}
            <View className="mb-3">
              <Text className="mb-1.5 text-[13px] font-medium text-gray-800">
                Description
              </Text>
              <TextInput
                placeholder="Where did you find it? Any identifying marks?"
                placeholderTextColor="#9CA3AF"
                className="h-28 rounded-xl border border-[#E4E6D8] bg-[#FBFBF6] px-4 py-3 text-[15px] font-medium text-gray-900"
                value={description}
                onChangeText={setDescription}
                multiline
              />
            </View>

            {/* Category */}
            <View className="mb-3">
              <Text className="mb-1.5 text-[13px] font-medium text-gray-800">
                Category
              </Text>
              <View className="h-14 rounded-xl border border-[#E4E6D8] bg-[#FBFBF6] px-4 flex-row items-center justify-between">
                <Text className="text-[15px] font-medium text-gray-900">{category}</Text>
                <Ionicons name="chevron-down-outline" size={20} color="#6B7280" />
              </View>
            </View>

            {/* Campus Map with pin dropping */}
            <CampusMap
              campus={CAMPUS}
              buildings={BUILDINGS}
              items={ITEMS}
              pickMode
              onPick={({ lat, lng }) => setPin({ lat: Number(lat), lng: Number(lng) })}
            />

            {/* Pin status */}
            {pin != null &&
            typeof pin.lat === "number" && typeof pin.lng === "number" ? (
              <View className="mb-3 p-3 rounded-xl bg-[#E7F0EA] border border-[#14614A] flex-row items-center gap-2">
                <Ionicons name="location-outline" size={18} color="#14614A" />
                <Text className="text-[12px] font-medium text-[#14614A]">
                  Pinned at {(Number(pin.lat)).toFixed(5)}, {(Number(pin.lng)).toFixed(5)}
                </Text>
                <Pressable
                  onPress={() => setPin(null)}
                  className="text-[#B42318]"
                >
                  <Text className="text-[12px] font-medium">Clear</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                onPress={() => navigation?.navigate("Map")}
                className="mb-3 h-12 flex-row items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-4"
              >
                <Ionicons name="map-outline" size={18} color="#6B7280" />
                <Text className="ml-2 text-[12px] font-medium text-gray-600">
                  Tap the map to drop a pin
                </Text>
              </Pressable>
            )}

            {error ? (
              <View className="mt-3 flex-row items-center rounded-xl bg-red-50 px-3 py-2.5">
                <Ionicons name="alert-circle" size={16} color="#B42318" />
                <Text className="ml-2 flex-1 text-[12px] text-red-700">
                  {error}
                </Text>
              </View>
            ) : null}

            {/* Submit */}
            <Pressable
              onPress={submit}
              disabled={submitting}
              accessibilityRole="button"
              className={`mt-5 h-14 flex-row items-center justify-center rounded-2xl bg-primary ${submitting ? "opacity-60" : "active:opacity-90"}`}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text className="text-[16px] font-semibold text-white">
                    Post Report
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color="#fff"
                    style={{ marginLeft: 6 }}
                  />
                </>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}