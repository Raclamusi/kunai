module.exports = {
  presets: [
    ["@babel/preset-env", {
      "modules": false
    }]
  ],
  plugins: [
    "@babel/plugin-transform-runtime",
    "@babel/plugin-transform-object-assign",
    "@babel/plugin-proposal-function-bind",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-transform-async-to-generator"
  ]
}

