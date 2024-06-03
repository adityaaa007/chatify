import React, { useEffect, useState } from "react";
import { config } from "../tamagui.config";
import { TamaguiProvider } from "tamagui";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { View } from "tamagui";
import { AppState, AppStateStatus, useColorScheme } from "react-native";
import Friends from "./pages/friends";
import GetStarted from "./pages/getStarted";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import { storage } from "./utils/Storage";
import SocketManager from "./controller/SocketManager";
import {SERVER_URL} from '@env'

export default function NameScreen() {
  useEffect(() => {
    
    //connecting to server only if not connected
    if(!SocketManager.isConnected()) SocketManager.connect(SERVER_URL); // TODO: add dot env variable

    const socket = SocketManager.getSocket()!;
    // const name = storage.getString("name");
    // const id = storage.getString("id");

    // socket.emit("user-connect", {
    //   name,
    //   id,
    //   active: true,
    // });

    // Add event listener when component mounts
    // const handleAppStateChange = (nextAppState: AppStateStatus) => {
    //   if (nextAppState === 'background') {
    //     console.log('unmounting index...............');

    //     if (socket) {
    //       const name = storage.getString("name");
    //       const id = storage.getString("id");

    //       console.log("Disconnecting from socket server...");
    //       socket.emit("user-connect", { name: name, id: id, active: false });

    //       socket.disconnect();
    //     }

    //   }
    // };
  
    // AppState.addEventListener('change', handleAppStateChange);
  
    // return () => {
    //   if (socket) {
    //     const name = storage.getString("name");
    //     const id = storage.getString("id");

    //     console.log("Disconnecting from socket server...");
    //     socket.emit("user-connect", { name: name, id: id, active: false });

    //     socket.disconnect();
    //   }
    // };

  }, []);

  const colorScheme = useColorScheme();

  const [fontsLoaded, fontError] = useFonts({
    "Helvetica-Bold": require("../assets/fonts/helvetica-bold.ttf"),
    Helvetica: require("../assets/fonts/helvetica.ttf"),
    "Helvetica-Light": require("../assets/fonts/helvetica-light.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <TamaguiProvider config={config} defaultTheme={colorScheme as any}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        {storage.getString("name") ? (
          <View flex={1} onLayout={onLayoutRootView}>
            <Friends></Friends>
          </View>
        ) : (
          <View flex={1} onLayout={onLayoutRootView}>
            <GetStarted></GetStarted>
          </View>
        )}
      </ThemeProvider>
    </TamaguiProvider>
  );
}
