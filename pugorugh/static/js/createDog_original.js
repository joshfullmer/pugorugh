var createDog = React.createClass({
    displayName: 'CreateDog',

    render: function () {
        return React.createElement(
            'div',
            null,
            React.createElement(
                'h4',
                null,
                'Add Dog'
            ),
            React.createElement(
                'input',
                { type: 'text', placeholder: 'Dog'}
            ),
            React.createElement('hr', null),
            React.createElement(
                'button',
                { className: 'button', onClick: this.save },
                'Save'
            )
        );
    }
});