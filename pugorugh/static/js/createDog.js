"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var createDog = function (_React$Component) {
    _inherits(createDog, _React$Component);

    function createDog(props) {
        _classCallCheck(this, createDog);

        var _this = _possibleConstructorReturn(this, (createDog.__proto__ || Object.getPrototypeOf(createDog)).call(this, props));

        _this.state = {
            dogname: "",
            breed: "",
            age: "",
            gender: "",
            size: ""
        };
        _this.csrftoken;

        _this.handleDogNameChange = _this.handleDogNameChange.bind(_this);
        _this.handleFileChange = _this.handleFileChange.bind(_this);
        _this.handleBreedChange = _this.handleBreedChange.bind(_this);
        _this.handleAgeChange = _this.handleAgeChange.bind(_this);
        _this.handleGenderChange = _this.handleGenderChange.bind(_this);
        _this.handleSizeChange = _this.handleSizeChange.bind(_this);
        _this.handleSubmit = _this.handleSubmit.bind(_this);
        return _this;
    }

    _createClass(createDog, [{
        key: "handleDogNameChange",
        value: function handleDogNameChange(event) {
            this.setState({ dogname: event.target.value });
        }
    }, {
        key: "handleFileChange",
        value: function handleFileChange(event) {
            this.setState({ file: event.target.files[0] });
        }
    }, {
        key: "handleBreedChange",
        value: function handleBreedChange(event) {
            this.setState({ breed: event.target.value });
        }
    }, {
        key: "handleAgeChange",
        value: function handleAgeChange(event) {
            this.setState({ age: event.target.value });
        }
    }, {
        key: "handleGenderChange",
        value: function handleGenderChange(event) {
            this.setState({ gender: event.target.value });
        }
    }, {
        key: "handleSizeChange",
        value: function handleSizeChange(event) {
            this.setState({ size: event.target.value });
        }
    }, {
        key: "handleSubmit",
        value: function handleSubmit(event) {
            var json = JSON.stringify({
                name: this.state.dogname,
                image_filename: this.state.file['name'],
                breed: this.state.breed,
                age: this.state.age,
                gender: this.state.gender,
                size: this.state.size
            });
            $.ajax({
                url: "/api/dog/create/",
                method: "POST",
                dataType: "json",
                headers: $.extend({ 'Content-type': 'application/json', 'X-CSRFToken': this.csrftoken }, TokenAuth.getAuthHeader()),
                data: json,
                success: this.props.setView.bind(this, 'undecided')
            });
            this.fileUpload();
            event.preventDefault();
        }
    }, {
        key: "fileUpload",
        value: function fileUpload() {
            var data = new FormData();
            data.append('file', this.state.file);
            $.ajax({
                url: "/file/upload/",
                type: "POST",
                data: data,
                dataType: "JSON",
                processData: false,
                contentType: false,
                headers: TokenAuth.getAuthHeader()
            });
        }
    }, {
        key: "getCookie",
        value: function getCookie(name) {
            var cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    if (cookie.substring(0, name.length + 1) === name + '=') {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
    }, {
        key: "render",
        value: function render() {
            this.csrftoken = this.getCookie('csrftoken');

            return React.createElement(
                "form",
                { onSubmit: this.handleSubmit },
                React.createElement("input", { type: "hidden", name: "csrfmiddlewaretoken", value: this.csrftoken }),
                React.createElement("input", { type: "text", placeholder: "Dog Name", value: this.state.dogname, onChange: this.handleDogNameChange }),
                React.createElement("input", { type: "file", onChange: this.handleFileChange }),
                React.createElement("input", { type: "text", placeholder: "Breed", value: this.state.breed, onChange: this.handleBreedChange }),
                React.createElement("input", { type: "number", placeholder: "Age (in months)", value: this.state.age, onChange: this.handleAgeChange }),
                React.createElement(
                    "select",
                    { value: this.state.gender, onChange: this.handleGenderChange },
                    React.createElement(
                        "option",
                        null,
                        "Please select one..."
                    ),
                    React.createElement(
                        "option",
                        { value: "f" },
                        "Female"
                    ),
                    React.createElement(
                        "option",
                        { value: "m" },
                        "Male"
                    )
                ),
                React.createElement(
                    "select",
                    { value: this.state.size, onChange: this.handleSizeChange },
                    React.createElement(
                        "option",
                        null,
                        "Please select one..."
                    ),
                    React.createElement(
                        "option",
                        { value: "s" },
                        "Small"
                    ),
                    React.createElement(
                        "option",
                        { value: "m" },
                        "Medium"
                    ),
                    React.createElement(
                        "option",
                        { value: "l" },
                        "Large"
                    ),
                    React.createElement(
                        "option",
                        { value: "xl" },
                        "Extra-large"
                    )
                ),
                React.createElement("input", { type: "submit", value: "Submit" })
            );
        }
    }]);

    return createDog;
}(React.Component);