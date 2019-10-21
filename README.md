# react-sane-contenteditable

[![npm version](https://badge.fury.io/js/react-sane-contenteditable.svg)](https://badge.fury.io/js/react-sane-contenteditable)

React component with sane defaults to make any element [`contentEditable`](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Editable_content).

## Installation

```bash
yarn add react-sane-contenteditable # or `npm install react-sane-contenteditable`
```

## Usage

```tsx
import React, { Component } from "react";
import ContentEditable from "react-sane-contenteditable";

class Project extends Component {
  state = {
    title: "Title here"
  }

  handleChange = (value: string) => {
    this.setState({ title: value });
  };

  render() {
    return (
      <div className="project-title">
        <ContentEditable
          tagName="h1"
          content={this.state.title}
          onChange={this.handleChange}
          editable={true}
          maxLength={140}
          multiLine={false}
        />
      </div>
    );
  }
}
```

## Scripts

| Command                | Description                                                               |
| ---------------------- | ------------------------------------------------------------------------- |
| `yarn storybook`       | Starts a Storybook server on [`localhost:6006`](http://localhost:6006)    |
| `yarn test`            | Runs test suite using Jest                                                |
| `yarn test:watch`      | Runs test suite using Jest in watch mode                                  |
| `yarn lint:prettier`   | Runs Prettier                                                             |
| `yarn lint:eslint`     | Runs ESLint                                                               |
| `yarn lint`            | Runs both Prettier and ESlint                                             |
| `yarn build`           | Builds project using Rollup                                               |


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)