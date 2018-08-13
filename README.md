# react-sane-contenteditable

[![npm version](https://badge.fury.io/js/react-sane-contenteditable.svg)](https://badge.fury.io/js/react-sane-contenteditable)

React component with sane defaults to make any element contentEditable

### **DEMO:** https://jsfiddle.net/zp2v824s/show

## Why?

ContentEditable has some well known issues, and the purpose of this component is to deal with them in a sane manner so we don't have to continue re-inventing the wheel! 🔥

* Clean and sanitise the output
* Remove rich text formatting when pasting
* Prevent the cursor from jumping around

## Example

```jsx
import React, { Component } from "react";
import ContentEditable from "react-sane-contenteditable";

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
          onChange={this.handleChange}
        />
      </div>
    );
  }
}
```

### Develop

### Tests
`yarn test`

### Linting
`yarn run lint`

### Dev
Runs the rollup dev server with file watching on both the src and demo

`yarn run dev`
