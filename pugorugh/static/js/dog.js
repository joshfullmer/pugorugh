"use strict";

var Dog = React.createClass({
  displayName: "Dog",

  getInitialState: function getInitialState() {
    return { filter: this.props.filter };
  },
  componentDidMount: function componentDidMount() {
    this.getFirst();
  },
  componentWillUnmount: function componentWillUnmount() {
    this.serverRequest.abort();
  },
  componentWillReceiveProps: function componentWillReceiveProps(props) {
    this.setState({ details: undefined, message: undefined, filter: props.filter }, this.getNext);
  },
  getNext: function getNext() {
    this.serverRequest = $.ajax({
      url: "api/dog/" + (this.state.details ? this.state.details.id : -1) + "/" + this.state.filter + "/next/",
      method: "GET",
      dataType: "json",
      headers: TokenAuth.getAuthHeader()
    }).done(function (data) {
      this.setState({ details: data, message: undefined });
    }.bind(this)).fail(function (response) {
      var message = null;
      if (response.status == 404) {
        if (this.state.filter == "undecided") {
          message = "No dogs matched your preferences.";
        } else {
          message = "You don't have any " + this.state.filter + " dogs.";
        }
      } else {
        message = response.error;
      }
      this.setState({ message: message, details: undefined });
    }.bind(this));
  },
  changeDogStatus: function changeDogStatus(newStatus) {
    this.serverRequest = $.ajax({
      url: "api/dog/" + this.state.details.id + "/" + newStatus + "/",
      method: "PUT",
      dataType: "json",
      headers: TokenAuth.getAuthHeader()
    }).done(function (data) {
      this.getNext();
    }.bind(this)).fail(function (response) {
      this.setState({ message: response.error });
    }.bind(this));
  },
  getFirst: function getFirst() {
    this.getNext();
  },
  handlePreferencesClick: function handlePreferencesClick(event) {
    this.props.setView("preferences");
  },
  deleteDog: function deleteDog() {
    if (this.state.details) {
      this.serverRequest = $.ajax({
        url: "api/dog/" + this.state.details.id + "/delete/",
        method: "DELETE",
        dataType: "json",
        headers: TokenAuth.getAuthHeader()
      }).done(function (data) {
        this.getNext();
      }.bind(this)).fail(function (response) {
        this.setState({ message: response.error });
      }.bind(this));
    }
  },
  genderLookup: { m: 'Male', f: 'Female' },
  sizeLookup: { s: 'Small', m: 'Medium', l: 'Large', xl: 'Extra Large' },
  dogControls: function dogControls() {
    var like = React.createElement(
      "a",
      { onClick: this.changeDogStatus.bind(this, 'liked') },
      React.createElement("img", { src: "static/icons/liked.svg", height: "45px" })
    );
    var dislike = React.createElement(
      "a",
      { onClick: this.changeDogStatus.bind(this, 'disliked') },
      React.createElement("img", { src: "static/icons/disliked.svg", height: "45px" })
    );
    var undecide = React.createElement(
      "a",
      { onClick: this.changeDogStatus.bind(this, 'undecided') },
      React.createElement("img", { src: "static/icons/undecided.svg", height: "45px" })
    );
    var next = React.createElement(
      "a",
      { onClick: this.getNext },
      React.createElement("img", { src: "static/icons/next.svg", height: "45px" })
    );
    var deleteDog = React.createElement(
      "a",
      { onClick: this.deleteDog },
      React.createElement("img", { src: "static/icons/delete.svg", height: "45px" })
    );

    switch (this.state.filter) {
      case "liked":
        return React.createElement(
          "p",
          { className: "text-centered dog-controls" },
          dislike,
          undecide,
          next,
          deleteDog
        );
      case "disliked":
        return React.createElement(
          "p",
          { className: "text-centered dog-controls" },
          like,
          undecide,
          next,
          deleteDog
        );
      case "undecided":
        return React.createElement(
          "p",
          { className: "text-centered dog-controls" },
          dislike,
          like,
          next,
          deleteDog
        );
    }
  },
  contents: function contents() {
    if (this.state.message !== undefined) {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "p",
          { className: "text-centered" },
          this.state.message
        )
      );
    }

    if (this.state.details === undefined) {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "p",
          { className: "text-centered" },
          "Retrieving dog details..."
        )
      );
    }

    if (!this.state.details) {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "p",
          { className: "text-centered" },
          "There are no more dogs to view. Please come back later."
        ),
        React.createElement(
          "p",
          { className: "text-centered" },
          React.createElement(
            "a",
            { onClick: this.getFirst },
            "Start from beginning"
          )
        )
      );
    }

    return React.createElement(
      "div",
      null,
      React.createElement("img", { src: "static/images/dogs/" + this.state.details.image_filename }),
      React.createElement(
        "p",
        { className: "dog-card" },
        this.state.details.name,
        "\u2022",
        this.state.details.breed,
        "\u2022",
        this.state.details.age,
        " Months\u2022",
        this.genderLookup[this.state.details.gender],
        "\u2022",
        this.sizeLookup[this.state.details.size]
      ),
      this.dogControls()
    );
  },
  render: function render() {
    return React.createElement(
      "div",
      null,
      this.contents(),
      React.createElement(
        "p",
        { className: "text-centered" },
        React.createElement(
          "a",
          { onClick: this.handlePreferencesClick },
          "Set Preferences"
        )
      )
    );
  }
});