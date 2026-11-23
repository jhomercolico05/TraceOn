import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const CLAIMS = [
  {
    id: "c1",
    title: "Navy blue backpack",
    place: "Library · 2nd floor",
    when: "Today, 9:12 AM",
    status: "review",
    note: "Possible match found nearby",
  },
  {
    id: "c2",
    title: "Student ID card",
    place: "Canteen · front lobby",
    when: "Yesterday, 4:40 PM",
    status: "pending",
    note: "Waiting for the finder to confirm",
  },
  {
    id: "c3",
    title: "Scientific calculator",
    place: "CAS · room 118",
    when: "Nov 19, 1:05 PM",
    status: "done",
    note: "Returned to owner",
  },
];

const STATUS = {
  review: { label: "REVIEW", bg: "#FDF3E3", color: "#B45309", icon: "sparkles" },
  pending: { label: "PENDING", bg: "#E7F0EA", color: "#14614A", icon: "time" },
  done: { label: "RETURNED", bg: "#EEF1F0", color: "#4B554E", icon: "checkmark" },
};

export default function ClaimsScreen() {
  const [tab, setTab] = useState("active");

  const visible = CLAIMS.filter((claim) =>
    tab === "active" ? claim.status !== "done" : claim.status === "done",
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F7F3EA]">
      <ScrollView
        className="px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28 }}
      >
        <View className="mt-3">
          <Text className="text-[11px] font-semibold tracking-widest text-primary">
            YOUR MATCHES
          </Text>
          <Text className="mt-1 text-[25px] font-bold text-gray-900">Claims</Text>
          <Text className="mt-1 text-[13px] text-gray-500">
            Confirm a match to get your item back safely.
          </Text>
        </View>

        <View className="mt-5 flex-row rounded-2xl bg-black/5 p-1">
          {[
            { key: "active", label: "Active" },
            { key: "completed", label: "Completed" },
          ].map((option) => {
            const active = tab === option.key;
            return (
              <Pressable
                key={option.key}
                onPress={() => setTab(option.key)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                className={`h-11 flex-1 items-center justify-center rounded-xl ${
                  active ? "bg-white" : ""
                }`}
              >
                <Text
                  className={`text-[14px] font-semibold ${
                    active ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {visible.length === 0 ? (
          <View className="mt-16 items-center px-6">
            <View className="h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Ionicons name="documents-outline" size={26} color="#14614A" />
            </View>
            <Text className="mt-3 text-[16px] font-semibold text-gray-800">
              Nothing here yet
            </Text>
            <Text className="mt-1 text-center text-[12px] text-gray-500">
              Claims you open or complete will show up in this list.
            </Text>
          </View>
        ) : (
          <View className="mt-4 gap-3">
            {visible.map((claim) => {
              const meta = STATUS[claim.status];
              return (
                <View
                  key={claim.id}
                  className="rounded-2xl border border-[#E4E6D8] bg-white p-4"
                >
                  <View className="flex-row items-center justify-between">
                    <View
                      className="flex-row items-center rounded-full px-2 py-0.5"
                      style={{ backgroundColor: meta.bg }}
                    >
                      <Ionicons name={meta.icon} size={11} color={meta.color} />
                      <Text
                        className="ml-1 text-[9px] font-bold tracking-wide"
                        style={{ color: meta.color }}
                      >
                        {meta.label}
                      </Text>
                    </View>
                    <Text className="text-[11px] text-gray-400">{claim.when}</Text>
                  </View>

                  <Text className="mt-2 text-[15px] font-bold text-gray-900">
                    {claim.title}
                  </Text>

                  <View className="mt-1 flex-row items-center">
                    <Ionicons name="location-outline" size={13} color="#8A938C" />
                    <Text className="ml-1 text-[12px] text-gray-500">
                      {claim.place}
                    </Text>
                  </View>

                  <View className="mt-3 flex-row items-center rounded-xl bg-[#FBFBF6] px-3 py-2">
                    <Ionicons name="information-circle-outline" size={15} color="#8A938C" />
                    <Text className="ml-2 flex-1 text-[12px] text-gray-600">
                      {claim.note}
                    </Text>
                  </View>

                  {claim.status !== "done" ? (
                    <Pressable className="mt-3 h-11 flex-row items-center justify-center rounded-xl bg-primary active:opacity-90">
                      <Text className="text-[13px] font-semibold text-white">
                        Review claim
                      </Text>
                    </Pressable>
                  ) : (
                    <View className="mt-3 h-11 flex-row items-center justify-center rounded-xl bg-[#EEF1F0]">
                      <Ionicons name="checkmark-circle" size={16} color="#4B554E" />
                      <Text className="ml-1.5 text-[13px] font-semibold text-[#4B554E]">
                        Completed
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}