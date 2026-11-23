import "./global.css";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { AuthProvider, useAuth } from "./context/AuthProvider";

import WelcomeScreen from "./pages/auth/WelcomeScreen";
import LoginScreen from "./pages/auth/LoginScreen";
import RegisterScreen from "./pages/auth/RegisterScreen";
import HomeScreen from "./pages/main/HomeScreen";
import ReportScreen from "./pages/main/ReportScreen";
import ClaimsScreen from "./pages/main/ClaimsScreen";
import ProfileScreen from "./pages/main/ProfileScreen";
import MapScreen from "./pages/MapScreen";
import BottomTabs from "./components/BottomTabs";

function Placeholder({ name, navigation }) {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-cream">
      <Text className="text-[22px] font-bold text-primary-dark">{name}</Text>
      <Text className="mt-2 text-gray-500">Coming soon</Text>
      <Pressable
        onPress={() => navigation.goBack()}
        className="mt-6 rounded-xl bg-primary px-6 py-3"
      >
        <Text className="font-semibold text-white">Go back</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const SCREENS = {
  Welcome: WelcomeScreen,
  Login: LoginScreen,
  Register: RegisterScreen,
  Home: HomeScreen,
  Map: MapScreen,
  Report: ReportScreen,
  Claims: ClaimsScreen,
  Profile: ProfileScreen,
};

// Tabs visible once signed in.
const TABS = ["Home", "Map", "Report", "Claims", "Profile"];

function Splash() {
  return (
    <View className="flex-1 items-center justify-center bg-cream">
      <Text className="text-[26px] font-semibold text-primary-dark">
        Trace<Text className="text-primary">On</Text>
      </Text>
      <ActivityIndicator className="mt-4" color="#14614A" />
    </View>
  );
}

function Shell() {
  const { session, loading } = useAuth();
  const signedIn = Boolean(session);

  const [stack, setStack] = useState(["Welcome"]);

  // Signing in opens the app; signing out drops back to Welcome.
  useEffect(() => {
    setStack(signedIn ? ["Home"] : ["Welcome"]);
  }, [signedIn]);

  const current = stack[stack.length - 1];
  const Screen = SCREENS[current];

  const navigation = {
    navigate: (name) => setStack((s) => [...s, name]),
    goBack: () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s)),
    // Resetting drops the rest of the stack.
    reset: (name) => setStack([name]),
  };

  // Switching tabs replaces the current tab in place, so the back stack does
  // not grow every time you tap between Home, Map, Report and so on.
  function openTab(tab) {
    setStack((s) => {
      for (let i = s.length - 1; i >= 0; i -= 1) {
        if (TABS.includes(s[i])) {
          return [...s.slice(0, i), tab];
        }
      }
      return [...s, tab];
    });
  }

  if (loading) return <Splash />;

  return (
    <View className="flex-1">
      {Screen ? (
        <Screen navigation={navigation} />
      ) : (
        <Placeholder name={current} navigation={navigation} />
      )}
      {signedIn && TABS.includes(current) && (
        <BottomTabs current={current} onNavigate={openTab} />
      )}
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Shell />
      </AuthProvider>
    </SafeAreaProvider>
  );
}