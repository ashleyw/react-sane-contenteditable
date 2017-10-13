# react-sane-contenteditable
React component with sane defaults to make any element contentEditable

Based on [react-simple-contenteditable](https://github.com/raphasilvac/react-simple-contenteditable).

## Why?
ContentEditable has some well known issues, and the purpose of this component is to deal with them so you don't have to! 🔥

* Clean and sanitise the output
* Remove rich text formatting when pasting
* Prevent the cursor from jumping around

## Example
```jsx
import React, { Component } from 'react';
import ContentEditable from 'react-sane-contenteditable';

class App extends Component {
  constructor (props) {
    super(props);

    this.state = {
      title: "Title here"
    }
  }

  handleChange = (ev, value) => {
    this.setState({ title: value });
  }

  render() {
    return (
      <div className="App">
        <ContentEditable
          tagName="h1"
          className="my-class"
          content={this.state.title}
          editable={true}
          maxLength={140}
          multiLine={false}
          onChange={ this.handleChange }
        />
      </div>
    );
  }
}

```
