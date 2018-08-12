module.exports = {
  extends: ['airbnb-base', 'plugin:import/errors', 'prettier'],
  rules: {
    radix: 0,
    'no-restricted-syntax': 0,
    'no-param-reassign': 0,
    'no-console': 0,
  },
  plugins: ['screeps'],
  env: {
    'screeps/screeps': true,
  },
  parserOptions: {
    // ecmaVersion: 6,
  },
}
