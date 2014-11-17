var UI = require('./index');

module.exports = function(name) {
  return {
    componentWillMount() {
      var theme = UI.getTheme();
      var styles = {};
      var propStyles = this.props.styles;

      Object.keys(theme[name]).forEach(key => {
        styles[key] = [theme[name][key]];
      });

      propStyles &&
        Object.keys(propStyles).forEach(key => {
          styles[key] = (styles[key] || []).concat(propStyles[key]);
        });

      // we remove the styles from props
      // to prevent accidental passing down to children
      // if you want, just use this.styles
      delete this.props.styles;

      this.styles = styles;
    },

    getStyles(elName, extras) {
      elName = elName === name ? 'self' : elName || 'self';
      return (!extras) ? this.styles[elName] : [].concat(this.styles[elName], extras);
    },

    addStyles(elName, styles) {
      this.styles = [].concat(this.getStyles(elName), styles);
    },

    getStyleVal(elName, prop) {
      // if no elName given, we just grab off the "self" styles
      if (typeof prop === 'undefined') {
        prop = elName;
        elName = name;
      }

      var styles = this.getStyles(elName);
      if (!styles) return null;

      var stylesForProp = styles
        .map(style => style.style[prop])
        .filter(x => typeof x !== 'undefined');

      return stylesForProp[stylesForProp.length - 1];
    }
  };
};