/**
 * exported HelloWorld
 *
 * Note how I have the global statement in this comment block - limitation of JSX compiler.
 *
 * @jsx React.DOM
 * */
var ReactBlog = React.createClass({displayName: 'ReactBlog',
    render: function () {
        return (
          React.DOM.h2(null, 'React ' + (this.props.name || 'Blog') + '!')
        );
    }
});
