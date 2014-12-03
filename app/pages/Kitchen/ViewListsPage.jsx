var React = require('react');
var ViewList = require('ui/views/ViewList');
var Drawer = require('ui/views/Drawer');
var Button = require('ui/components/Button');
var BackButton = require('ui/components/buttons/BackButton');
var { Container } = require('ui/components/Grid');

module.exports = React.createClass({
  render() {
    return (
      <Drawer>
        <ViewList>
          <View title={[<BackButton />, 'One', <a href="#two">Two</a>]}>
            <Container>
              Example of a deeply nested thing
              <Button href="#two">Button</Button>
            </Container>
          </View>

          <View title={[<a href="#one">One</a>, 'Two', <a href="#three">Three</a>]}>
            <Container>
              This is the first nested drawer
            </Container>
          </View>
        </ViewList>
      </Drawer>
    );
  }
});