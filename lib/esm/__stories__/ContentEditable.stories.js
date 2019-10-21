import { State, Store } from '@sambego/storybook-state';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import ContentEditable from '../react-sane-contenteditable';
var stories = storiesOf('ContentEditable', module).addParameters({
  docs: null
});
var store = new Store({
  content: ''
});
stories.add('basic example', function () {
  return React.createElement(State, {
    store: store
  }, function (state) {
    return React.createElement(ContentEditable, {
      tagName: "h1",
      className: "my-class",
      content: state.content,
      editable: true,
      focus: true,
      maxLength: 140,
      multiLine: true,
      onChange: function onChange(content) {
        return store.set({
          content: content
        });
      },
      onBlur: action('onBlur', {
        depth: 1
      }),
      onFocus: action('onFocus', {
        depth: 1
      }),
      onKeyDown: action('onKeyDown', {
        depth: 1
      }),
      onKeyUp: action('onKeyUp', {
        depth: 1
      }),
      onPaste: action('onPaste', {
        depth: 1
      }),
      caretPosition: "end"
    });
  });
});