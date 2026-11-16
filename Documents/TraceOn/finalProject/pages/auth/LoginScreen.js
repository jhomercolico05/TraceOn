import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen({ navigation }) {
  // Empty inputs. No real login logic yet.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="px-4 pb-8"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ---------- HEADER: logo + close ---------- */}
          <View className="mt-3 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="h-11 w-11 items-center justify-center rounded-xl bg-primary">
                <Ionicons name="location-outline" size={22} color="#fff" />
                <View className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-accent" />
              </View>
              <Text className="ml-3 text-[26px] font-semibold text-primary-dark">
                TraceOn
              </Text>
            </View>

            <Pressable
              onPress={() => navigation?.goBack()}
              className="h-11 w-11 items-center justify-center rounded-xl bg-black/5"
            >
              <Ionicons name="close" size={22} color="#1F2937" />
            </Pressable>
          </View>

          {/* ---------- TITLE ---------- */}
          <View className="mt-8">
            <Text className="text-[11px] font-semibold tracking-widest text-primary">
              WELCOME BACK
            </Text>
            <Text className="mt-2 text-[32px] font-bold leading-[38px] text-primary-dark">
              Sign in to TraceOn
            </Text>
            <Text className="mt-3 text-[14px] leading-5 text-gray-400">
              Keep track of your reports, possible matches, and claim updates.
            </Text>
          </View>

          {/* ---------- FORM CARD ---------- */}
          <View className="mt-5 rounded-2xl border border-[#E4E6D8] bg-white p-4">
            {/* Email */}
            <Text className="mb-1.5 text-[13px] font-medium text-gray-800">
              CvSU email
            </Text>
            <View className="h-14 flex-row items-center rounded-xl border border-[#E4E6D8] bg-[#FBFBF6] px-4">
              <Ionicons name="mail-outline" size={18} color="#6B7280" />
              <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="name@cvsu.edu.ph"
                placeholderTextColor="#9CA3AF"
                className="ml-3 flex-1 text-[15px] font-medium text-gray-900"
              />
            </View>

            {/* Password */}
            <Text className="mb-1.5 mt-4 text-[13px] font-medium text-gray-800">
              Password
            </Text>
            <View className="h-14 flex-row items-center rounded-xl border border-[#E4E6D8] bg-[#FBFBF6] px-4">
              <Ionicons name="lock-closed-outline" size={18} color="#6B7280" />
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                className="ml-3 flex-1 text-[15px] font-medium text-gray-900"
              />
            </View>

            {/* Forgot password */}
            <Pressable
              onPress={() => navigation?.navigate("ForgotPassword")}
              className="mt-3 self-end"
            >
              <Text className="text-[13px] font-semibold text-primary">
                Forgot password?
              </Text>
            </Pressable>

            {/* Sign in */}
            <Pressable
              onPress={() => navigation?.navigate("UserTabs")}
              className="mt-4 h-14 flex-row items-center justify-center rounded-2xl bg-primary active:opacity-90"
            >
              <Text className="text-[16px] font-semibold text-white">
                Sign in
              </Text>
              <Ionicons
                name="arrow-forward"
                size={18}
                color="#fff"
                style={{ marginLeft: 6 }}
              />
            </Pressable>
          </View>

          {/* ---------- DEMO SHORTCUTS ---------- */}
          <View className="mt-6 flex-row items-center">
            <View className="h-px flex-1 bg-gray-300" />
            <Text className="mx-3 text-[10px] font-medium tracking-widest text-gray-500">
              OR EXPLORE THE DEMO
            </Text>
            <View className="h-px flex-1 bg-gray-300" />
          </View>

          <View className="mt-4 flex-row">
            <Pressable
              onPress={() => navigation?.navigate("UserTabs")}
              className="mr-3 h-14 flex-1 flex-row items-center justify-center rounded-2xl bg-primary/10 active:opacity-90"
            >
              <Ionicons name="person-outline" size={18} color="#14614A" />
              <Text className="ml-2 text-[15px] font-semibold text-primary">
                Student view
              </Text>
            </Pressable>

            <Pressable
              onPress={() => navigation?.navigate("AdminTabs")}
              className="h-14 flex-1 flex-row items-center justify-center rounded-2xl bg-primary-dark active:opacity-90"
            >
              <Ionicons name="shield-outline" size={18} color="#fff" />
              <Text className="ml-2 text-[15px] font-semibold text-white">
                Admin console
              </Text>
            </Pressable>
          </View>

          {/* ---------- FOOTER ---------- */}
          <View className="mt-6 h-px bg-gray-300" />

          <Pressable
            onPress={() => navigation?.navigate("Register")}
            className="mt-4"
          >
            <Text className="text-[14px] text-gray-600">
              New to TraceOn?{" "}
              <Text className="font-semibold text-primary-dark">
                Create an account
              </Text>
            </Text>
          </Pressable>

          <View className="mt-5 flex-row items-start">
            <Ionicons
              name="shield-checkmark-outline"
              size={14}
              color="#6B7280"
              style={{ marginTop: 2 }}
            />
            <Text className="ml-2 flex-1 text-[11px] leading-4 text-gray-500">
              Your information is handled under the Data Privacy Act of 2012
              (RA 10173).
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}