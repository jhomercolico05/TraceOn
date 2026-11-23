import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

import { useAuth } from "../../context/AuthProvider";

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSignIn() {
    if (submitting) return;

    if (!email.trim() || !password) {
      setError("Enter your CvSU email and password.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      await signIn(email, password);
      // App.js switches to the signed-in stack once the session exists.
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

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
              onPress={() =>
                Alert.alert(
                  "Password reset",
                  "Password reset is not available yet. Ask an admin to reset it for now.",
                )
              }
              className="mt-3 self-end"
            >
              <Text className="text-[13px] font-semibold text-primary">
                Forgot password?
              </Text>
            </Pressable>

            {error ? (
              <View className="mt-3 flex-row items-center rounded-xl bg-red-50 px-3 py-2.5">
                <Ionicons name="alert-circle" size={16} color="#B42318" />
                <Text className="ml-2 flex-1 text-[12px] text-red-700">
                  {error}
                </Text>
              </View>
            ) : null}

            {/* Sign in */}
            <Pressable
              onPress={handleSignIn}
              disabled={submitting}
              accessibilityRole="button"
              className={`mt-4 h-14 flex-row items-center justify-center rounded-2xl bg-primary ${
                submitting ? "opacity-60" : "active:opacity-90"
              }`}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text className="text-[16px] font-semibold text-white">
                    Sign in
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