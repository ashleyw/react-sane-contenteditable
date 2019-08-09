import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import ContentEditable from '../src/react-sane-contenteditable';

class App extends Component {
  state = {
    title: 'foo',
  };

  handleChange = (value: string) => {
    console.log('change', value);
    this.setState({ title: value });
  };

  handlePaste = (value: string) => console.log('paste', value);

  handleEvent = (event: React.KeyboardEvent, value: string) => {
    event.persist();
    console.log(event.type, event, value);
  };

  handleBlur = (event: React.FormEvent<HTMLInputElement>, value: string) => {
    console.log('input blurred', event);
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
          maxLength={50}
          multiLine
          onBlur={this.handleBlur}
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
            fontFamily: "'Courier New', Courier, 'Lucida Sans Typewriter', 'Lucida Typewriter', monospace",
          }}
        >
          {this.state.title}
        </pre>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
