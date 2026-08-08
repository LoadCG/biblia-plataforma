const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);
config.resolver.assetExts.push("wasm"); // Adiciona suporte ao wasm do expo-sqlite

module.exports = withNativeWind(config, { input: "./global.css" });
