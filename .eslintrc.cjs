module.exports = {
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
  },
  extends: ["plugin:@next/next/recommended"],
  parser: "@babel/eslint-parser",
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      babelrc: false,
      configFile: false,
      presets: ["@babel/preset-env"],
    },
  },
};
