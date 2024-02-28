import React, { Component } from "react";
import Select from "react-select";

export default class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [
        { value: "Camera", label: "Camera" },
        { value: "Lamp", label: "Lamp" },
        { value: "Computer", label: "Computer" },
        { value: "Books", label: "Books" },
        { value: "Flowers", label: "Flowers" },
      ],
      selected: "",
      inputText: "",
    };
  }

  handleChange = (e) => {
    this.setState({ selected: e.value });
    const { onChange } = this.props;
    const v = e.value;
    onChange(v);
  };

  handleChangeFun = (e) => {
    const { onChange } = this.props;
    const v = e;
    onChange(v);
  };
  handleInputTextChange = (e) => {
    this.setState({ inputText: e.target.value });
  };

  handleInputSubmit = () => {
    this.handleChangeFun(this.state.inputText);
    // Clear the input text
    this.setState({ inputText: "" });
  };

  render() {
    return (
      <div className="custom-dropdown">
        {/* {this.state.selected !== "Others" ? ( */}
          <div className="select-container">
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChange}
              options={this.state.options}
            />
          </div>
        {/* ) : (
          <div className="input-container">
            <input
              type="text"
              placeholder="Enter Text"
              value={this.state.inputText}
              onChange={this.handleInputTextChange}
            />
            <button onClick={this.handleInputSubmit}>Submit</button>
          </div> */}
        {/* )} */}
      </div>
    );
  }
}
