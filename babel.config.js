module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: [
    "babel-plugin-jsx-remove-data-test-id",
    {
      attributes: "selenium-id"
    }
  ]
}
