/**
 * Babel config used ONLY by Jest (referenced explicitly from jest.config.cjs).
 * It is intentionally NOT named babel.config.* so that Vite / @vitejs/plugin-react
 * never picks it up — the app build keeps using esbuild/SWC as before.
 */
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ],
  plugins: [require.resolve('./jest/import-meta-plugin.cjs')],
};
