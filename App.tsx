import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { LogBox, StyleSheet, Text, View } from "react-native";
import Editor from "./components/editor";
import Home from "./components/home";
import { colors } from "./constante/colors";
import { AppProvider } from "./lib/appContext";
import { SQLiteProvider } from "expo-sqlite";
import { migrateDbIfNeeded } from "./lib/db";

SplashScreen.preventAutoHideAsync();
export default function App() {
  // LogBox.ignoreAllLogs()
  const [loaded, error] = useFonts({
    "Roboto-ExtraBold": require("./assets/fonts/Roboto-ExtraBold.ttf"),
    "Roboto-Medium": require("./assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Light": require("./assets/fonts/Roboto-Light.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  return (
    <SQLiteProvider databaseName="notes.db" onInit={migrateDbIfNeeded}>
      <AppProvider>
        <View style={styles.container}>
          <Home />
          <Editor />
        </View>
      </AppProvider>
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
});
