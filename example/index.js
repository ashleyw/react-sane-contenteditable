import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import ContentEditable from '../src/react-sane-contenteditable';

class App extends Component {
  state = {
    title: 'foo',
  };

  handleChange = (value) => {
    console.log('change', value);
    this.setState({ title: value });
  };

  handlePaste = (value) => console.log('paste', value);

  handleEvent = (ev, value) => {
    ev.persist();
    console.log(ev.type, ev, value);
  };

  render() {
    return (
      <div className="App">
        <ContentEditable
          tagName="h1"
          className="my-class"
          content={this.state.title}
          editable
          focus
          maxLength={140}
          multiLine
          onBlur={this.handleEvent}
          onChange={this.handleChange}
          onKeyDown={this.handleEvent}
          onKeyUp={this.handleEvent}
          onPaste={this.handlePaste}
          caretPosition="end"
        />

        <b>Value:</b>
        <pre
          style={{
            fontSize: 14,
            fontFamily: '\'Courier New\', Courier, \'Lucida Sans Typewriter\', \'Lucida Typewriter\', monospace',
          }}
        >
          {this.state.title}
        </pre>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
