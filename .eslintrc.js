module.exports = {
    parser: '@typescript-eslint/parser',
    env: {
        node: true,
        browser: true,
        es2021: true,
    },
    extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:@typescript-eslint/recommended'],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['react'],
    rules: {
        'react/prop-types': 0,
        'no-unused-vars': 'off',
        'react/react-in-jsx-scope': 'off',
    },
};
