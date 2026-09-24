module.exports = function importMetaToGlobal({ types: t }) {
  return {
    name: 'import-meta-to-global',
    visitor: {
      MetaProperty(path) {
        path.replaceWith(
          t.memberExpression(
            t.identifier('globalThis'),
            t.identifier('__viteMeta__'),
          ),
        );
      },
    },
  };
};
