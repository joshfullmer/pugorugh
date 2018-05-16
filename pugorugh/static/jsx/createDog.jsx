class createDog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dogname: "",
            breed: "",
            age: "",
            gender: "",
            size: "",
        };
        this.csrftoken;

        this.handleDogNameChange = this.handleDogNameChange.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleBreedChange = this.handleBreedChange.bind(this);
        this.handleAgeChange = this.handleAgeChange.bind(this);
        this.handleGenderChange = this.handleGenderChange.bind(this);
        this.handleSizeChange = this.handleSizeChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleDogNameChange(event) {
        this.setState({dogname: event.target.value});
    }

    handleFileChange(event) {
        this.setState({file: event.target.files[0]});
    }

    handleBreedChange(event) {
        this.setState({breed: event.target.value});
    }

    handleAgeChange(event) {
        this.setState({age: event.target.value});
    }

    handleGenderChange(event) {
        this.setState({gender: event.target.value});
    }

    handleSizeChange(event) {
        this.setState({size: event.target.value});
    }
  
    handleSubmit(event) {
        var json = JSON.stringify({
            name: this.state.dogname,
            image_filename: this.state.file['name'],
            breed: this.state.breed,
            age: this.state.age,
            gender: this.state.gender,
            size: this.state.size,
        });
        $.ajax({
            url: "/api/dog/create/",
            method: "POST",
            dataType: "json",
            headers: $.extend({'Content-type': 'application/json', 'X-CSRFToken': this.csrftoken}, TokenAuth.getAuthHeader()),
            data: json,
            success: this.props.setView.bind(this, 'undecided'),
        });
        this.fileUpload();
        event.preventDefault();
    }

    fileUpload() {
        var data = new FormData();
        data.append('file', this.state.file);
        $.ajax({
            url: "/file/upload/",
            type: "POST",
            data: data,
            dataType: "JSON",
            processData: false,
            contentType: false,
            headers: TokenAuth.getAuthHeader(),
        });
    }

    getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
  
    render() {
        this.csrftoken = this.getCookie('csrftoken');

        return (
            <form onSubmit={this.handleSubmit}>
                <input type="hidden" name="csrfmiddlewaretoken" value={this.csrftoken} />
                <input type="text" placeholder="Dog Name" value={this.state.dogname} onChange={this.handleDogNameChange} />
                <input type="file" onChange={this.handleFileChange} />
                <input type="text" placeholder="Breed" value={this.state.breed} onChange={this.handleBreedChange} />
                <input type="number" placeholder="Age (in months)" value={this.state.age} onChange={this.handleAgeChange} />
                <select value={this.state.gender} onChange={this.handleGenderChange}>
                    <option>Please select one...</option>
                    <option value="f">Female</option>
                    <option value="m">Male</option>
                </select>
                <select value={this.state.size} onChange={this.handleSizeChange}>
                    <option>Please select one...</option>
                    <option value="s">Small</option>
                    <option value="m">Medium</option>
                    <option value="l">Large</option>
                    <option value="xl">Extra-large</option>
                </select>
                <input type="submit" value="Submit" />
            </form>
        );
    }
  }