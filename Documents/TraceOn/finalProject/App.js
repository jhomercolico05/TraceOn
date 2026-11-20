import "./global.css";
import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import WelcomeScreen from "./pages/auth/WelcomeScreen";
import LoginScreen from "./pages/auth/LoginScreen";
import RegisterScreen from "./pages/auth/RegisterScreen";
import HomeScreen from "./pages/main/HomeScreen";
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
  Report: Placeholder,
  Claims: Placeholder,
  Profile: Placeholder,
};

// Tabs visible once signed in.
const TABS = ["Home", "Map", "Report", "Claims", "Profile"];

export default function App() {
  const [stack, setStack] = useState(["Welcome"]);
  const current = stack[stack.length - 1];

  const navigation = {
    navigate: (name) => setStack((s) => [...s, name]),
    goBack: () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s)),
  };

  const Screen = SCREENS[current];

  return (
    <SafeAreaProvider>
      <View className="flex-1">
        {Screen ? (
          <Screen navigation={navigation} />
        ) : (
          <Placeholder name={current} navigation={navigation} />
        )}
        {TABS.includes(current) && (
          <BottomTabs
            current={current}
            onNavigate={(tab) => setStack((s) => [...s, tab])}
          />
        )}
      </View>
    </SafeAreaProvider>
  );
}