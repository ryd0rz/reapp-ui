var React = require('react');
var Component = require('../component');
var TitleBar = require('../components/TitleBar');
var StaticContainer = require('../helpers/StaticContainer');
var ScrollTopable = require('../mixins/ScrollTopable');
var AnimatedScrollToTop = require('../mixins/AnimatedScrollToTop');
var ScrollState = require('../mixins/ScrollState');

module.exports = Component({
  name: 'View',

  mixins: [
    ScrollState,
    ScrollTopable('inner'),
    AnimatedScrollToTop
  ],

  propTypes: {
    title: React.PropTypes.node,
    index: React.PropTypes.number,
    width: React.PropTypes.number,
    height: React.PropTypes.number,

    // offset of inner scroll area from top
    offsetTop: React.PropTypes.number,

    // offset of inner scroll area from bottom
    offsetBottom: React.PropTypes.number,

    animations: React.PropTypes.object,

    // pass inner div props (scrollable content)
    innerProps: React.PropTypes.object,

    // pass titlebar props
    titleBarProps: React.PropTypes.object,

    // pass overlay div props
    overlayProps: React.PropTypes.object,

    // place a node outside the inner pane
    after: React.PropTypes.node,

    // disable pointer events
    inactive: React.PropTypes.bool,

    // make the StaticContainer inside fullscreen
    fullscreen: React.PropTypes.bool,

    // see scrollTopable
    scrollTop: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ])
  },

  getInitialState() {
    return {
      isScrolling: false
    };
  },

  animationSource: 'viewList',

  componentWillMount() {
    this.setClipStyles(this.props);
  },

  componentDidMount() {
    this.scrollListener(this.refs.inner.getDOMNode());

    if (this.props.onComponentMounted)
      this.props.onComponentMounted();
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.width !== this.props.width ||
      nextProps.height !== this.props.height)
      this.setClipStyles(nextProps);
  },

  getTitleBarHeight() {
    return (
      this.props.titleBarProps && this.props.titleBarProps.height ||
      this.getConstant('titleBarHeight')
    );
  },

  setClipStyles(props) {
    if (props && props.width && props.height)
      this.clipStyles = {
        clip: `rect(0px, ${props.width}px, ${props.height}px, -10px)`
      };
  },

  handleDoubleTap() {
    if (this.refs.inner)
      this.animatedScrollToTop(this.refs.inner.getDOMNode(), 300, this.getScrollTop());
  },

  hasOverlay() {
    return this.props.animations && this.props.animations.overlay;
  },

  render() {
    var {
      animations,
      animationState,
      children,
      title,
      index,
      width,
      height,
      innerProps,
      titleBarProps,
      overlayProps,
      viewList,
      viewListType,
      inactive,
      fullscreen,
      after,
      offsetTop,
      offsetBottom,
      ...props
    } = this.props;

    // add double tap event
    titleBarProps = titleBarProps || {};
    titleBarProps.onDoubleTap = titleBarProps.onDoubleTap || this.handleDoubleTap;
    titleBarProps.animationState = animationState;

    var titleBarHeight = this.getTitleBarHeight();

    if (this.state.isScrolling)
      this.addClass('inner', 'isScrolling');

    if (this.isAnimating('viewList')) {
      this.addStyles('inner', this.clipStyles);
      this.addStyles('inner', 'innerInactive');
    }

    if (title)
      this.addStyles('inner', { top: titleBarHeight });

    if (offsetTop)
      this.addStyles('inner', { top: offsetBottom });

    if (offsetBottom)
      this.addStyles('inner', { bottom: offsetBottom });

    if (this.hasOverlay())
      this.addStyles('overlay', {
        display: inactive ? 'block' : 'none',
        top: titleBarHeight
      });

    return (
      <div {...this.componentProps()} {...props}>
        {title && (
          <TitleBar {...titleBarProps}>{title}</TitleBar>
        )}

        <div {...this.componentProps('inner')} {...innerProps}>
          <StaticContainer
            fullscreen={fullscreen}
            shouldUpdate={!animations || !inactive}>
            {children}
          </StaticContainer>
        </div>

        {after}

        {this.hasOverlay() && (
          <div {...this.componentProps('overlay')} {...overlayProps} />
        )}
      </div>
    );
  }
});