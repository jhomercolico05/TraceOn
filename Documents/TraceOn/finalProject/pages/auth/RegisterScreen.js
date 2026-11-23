import React, { useState } from "react";
import {
  ActivityIndicator,
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

// Reusable input row (icon + text field). Move to components/common/ later.
function FormField({ label, icon, ...inputProps }) {
  return (
    <View className="mb-3">
      <Text className="mb-1.5 text-[13px] font-medium text-gray-800">
        {label}
      </Text>
      <View className="h-14 flex-row items-center rounded-xl border border-[#E4E6D8] bg-[#FBFBF6] px-4">
        <Ionicons name={icon} size={18} color="#6B7280" />
        <TextInput
          placeholderTextColor="#9CA3AF"
          className="ml-3 flex-1 text-[15px] font-medium text-gray-900"
          {...inputProps}
        />
      </View>
    </View>
  );
}

export default function RegisterScreen({ navigation }) {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [program, setProgram] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  async function handleCreate() {
    if (submitting) return;

    if (!agreed) {
      setError("Please accept the privacy notice to continue.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      const result = await signUp({ fullName, email, program, password });
      // With email confirmation off, App.js switches to the signed-in stack
      // as soon as the session appears. Otherwise we explain what happens next.
      if (result.needsConfirmation) setNeedsConfirmation(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (needsConfirmation) {
    return (
      <SafeAreaView className="flex-1 bg-cream">
        <View className="flex-1 items-center justify-center px-6">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Ionicons name="mail-open-outline" size={32} color="#14614A" />
          </View>
          <Text className="mt-4 text-[22px] font-bold text-primary-dark">
            Check your email
          </Text>
          <Text className="mt-2 text-center text-[13px] leading-5 text-gray-500">
            We sent a confirmation link to {email.trim()}. Open it, then sign in
            with your password.
          </Text>
          <Pressable
            onPress={() => navigation?.navigate("Login")}
            className="mt-6 h-12 w-full items-center justify-center rounded-2xl bg-primary"
          >
            <Text className="font-semibold text-white">Go to sign in</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
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
                Trace<Text className="text-primary">On</Text>
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
          <View className="mt-7">
            <Text className="text-[11px] font-semibold tracking-widest text-primary">
              JOIN TRACEON
            </Text>
            <Text className="mt-2 text-[32px] font-bold leading-[38px] text-primary-dark">
              Create your account
            </Text>
            <Text className="mt-3 text-[14px] leading-5 text-gray-500">
              Use your CvSU details so the campus can verify you.
            </Text>
          </View>

          {/* ---------- FORM CARD ---------- */}
          <View className="mt-5 rounded-2xl border border-[#E4E6D8] bg-white p-4">
            <FormField
              label="Full name"
              icon="person-outline"
              value={fullName}
              onChangeText={setFullName}
              placeholder="Juan Dela Cruz"
            />

            <FormField
              label="CvSU email"
              icon="mail-outline"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="name@cvsu.edu.ph"
            />

            <FormField
              label="Program / department"
              icon="school-outline"
              value={program}
              onChangeText={setProgram}
              placeholder="e.g. BS Information Technology"
            />

            <FormField
              label="Password"
              icon="lock-closed-outline"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Create a password"
            />

            {/* Agreement checkbox */}
            <Pressable
              onPress={() => setAgreed(!agreed)}
              className="mt-1 flex-row items-center"
            >
              <View
                className={`h-6 w-6 items-center justify-center rounded-md ${
                  agreed ? "bg-primary" : "border border-gray-300 bg-white"
                }`}
              >
                {agreed && <Ionicons name="checkmark" size={16} color="#fff" />}
              </View>
              <Text className="ml-3 flex-1 text-[11px] leading-4 text-gray-600">
                I agree to the Data Privacy Act (RA 10173) notice and the
                campus lost & found policy.
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

            {/* Create account */}
            <Pressable
              onPress={handleCreate}
              disabled={submitting}
              accessibilityRole="button"
              className={`mt-5 h-14 flex-row items-center justify-center rounded-2xl bg-primary ${
                submitting ? "opacity-60" : "active:opacity-90"
              }`}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text className="text-[16px] font-semibold text-white">
                    Create account
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
          <Pressable
            onPress={() => navigation?.navigate("Login")}
            className="mt-6"
          >
            <Text className="text-[14px] text-gray-600">
              Already have an account?{" "}
              <Text className="font-semibold text-primary-dark">Sign in</Text>
            </Text>
          </Pressable>

          <Text className="mt-3 text-[11px] text-gray-500">
            Accounts are limited to @cvsu.edu.ph email addresses.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}