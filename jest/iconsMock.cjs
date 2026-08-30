// Lightweight stub for @tabler/icons-react: every named icon export resolves to
// a trivial <svg> component. Avoids loading the huge icon barrel under Jest.
const React = require('react');

const Icon = (props) =>
  React.createElement('svg', { 'data-icon': 'stub', 'aria-hidden': true, ...props });

module.exports = new Proxy(
  { __esModule: true, default: Icon },
  {
    get(target, prop) {
      if (prop in target) return target[prop];
      return Icon;
    },
  },
);
