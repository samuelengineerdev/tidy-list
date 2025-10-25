module.exports = function (api) {
    api.cache(true);
    return {
      presets: [
        ["babel-preset-expo", { jsxImportSource: "nativewind" }],
        "nativewind/babel",
      ],
      plugins: [
        // otros plugins si tienes (ej: nativewind)
        // 'nativewind/babel',
        'react-native-reanimated/plugin', // ⚠️ siempre al final
      ],
    };
  };