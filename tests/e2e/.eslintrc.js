module.exports = {
  plugins: [
    'cypress'
  ],
  env: {
    mocha: true,
    'cypress/globals': true
  },
  rules: {
    strict: 'off',
    "no-unused-vars": 'warn',
    "vue/no-unused-vars": "off",
    "vue/multi-word-component-names": ['error', { ignores: ['index'] }]
  }
}
