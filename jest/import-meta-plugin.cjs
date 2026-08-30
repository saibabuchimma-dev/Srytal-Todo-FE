/**
 * Babel plugin (Jest-only): rewrites `import.meta` to `globalThis.__viteMeta__`
 * so Vite's `import.meta.env` works under Jest's CJS transform. The value is
 * defined in jest/setup.tsx. This plugin is referenced only by babel.jest.cjs,
 * so it never touches the real Vite build.
 */
module.exports = function importMetaToGlobal({ types: t }) {
  return {
    name: 'import-meta-to-global',
    visitor: {
      MetaProperty(path) {
        path.replaceWith(
          t.memberExpression(t.identifier('globalThis'), t.identifier('__viteMeta__')),
        );
      },
    },
  };
};
