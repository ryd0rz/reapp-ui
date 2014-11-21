var ReactStyle = require('react-style');

// overrides format example for component "button":
// button: {
//   self: { // ... },
//   subEl: { // ... }
// }

module.exports = getStylesObject(
  'block',
  'button',
  'container',
  'titlebar',
  'list',
  'listitem',
  'listtitle',
  'menu',
  'modal',
  'pad',
  'popover',
  'viewmain',
  'viewleft'
);

function getStyles(name) {
  var styles = Object.assign({}, require('./ios/styles/' + name));

  Object.keys(styles).forEach(key => {
    styles[key] = ReactStyle(styles[key]);
  });

  return styles;
}

function getStylesObject() {
  var styles = {};

  Array.prototype.slice.call(arguments).forEach(name => {
    styles[name] = getStyles(name);
  });

  return styles;
}