/**
 * exported HelloWorld
 *
 * Note how I have the global statement in this comment block - limitation of JSX compiler.
 *
 * @jsx React.DOM
 * */
var HelloWorld = React.createClass({
    render: function () {
        return (
          <h2>{'Hello ' + (this.props.name || 'World') + '!'}</h2>
        );
    }
});
