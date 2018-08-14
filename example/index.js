import ReactDOM from "react-dom";
import React, { Component } from "react";
import ContentEditable from "../src/react-sane-contenteditable";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "Title here"
    };
  }

  handleChange = (ev, value) => {
    this.setState({ title: value });
  };

  handleKeyDown = (ev, value) => {
    this.setState({ title: value });
  };

  render() {
    return (
      <div className="App">
        <ContentEditable
          tagName="h1"
          className="my-class"
          content={this.state.title}
          editable={true}
          maxLength={140}
          multiLine={true}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
        />

        <b>Value:</b>
        <pre
          style={{
            fontSize: 14,
            fontFamily:
              '\'Courier New\', Courier, \'Lucida Sans Typewriter\', \'Lucida Typewriter\', monospace'
          }}
        >
          {this.state.title}
        </pre>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
