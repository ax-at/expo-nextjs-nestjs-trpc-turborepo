import type { ExpoConfig } from "expo/config";

const defineConfig = (): ExpoConfig => ({
  name: "expo",
  slug: "expo",
  scheme: "expo",
  owner: "acme",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/icon.png",
    resizeMode: "contain",
    backgroundColor: "#1F104A",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    bundleIdentifier: "com.acme",
    supportsTablet: true,
  },
  android: {
    package: "com.acme",
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#1F104A",
    },
  },
  extra: {
    eas: {
      projectId: "3224c01c-cc06-44c6-975c-76c43a423031",
    },
  },
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  plugins: ["expo-router"],
});

export default defineConfig;
