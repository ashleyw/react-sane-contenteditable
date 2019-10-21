import { State, Store } from '@sambego/storybook-state';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import ContentEditable from '../react-sane-contenteditable';

const stories = storiesOf('ContentEditable', module).addParameters({ docs: null });

const store = new Store({
  content: '',
});

stories.add('basic example', () => (
  <State store={store}>
    {state => (
      <ContentEditable
        tagName="h1"
        className="my-class"
        content={state.content}
        editable
        focus
        maxLength={140}
        multiLine
        onChange={content => store.set({ content })}
        onBlur={action('onBlur', { depth: 1 })}
        onFocus={action('onFocus', { depth: 1 })}
        onKeyDown={action('onKeyDown', { depth: 1 })}
        onKeyUp={action('onKeyUp', { depth: 1 })}
        onPaste={action('onPaste', { depth: 1 })}
        caretPosition="end"
      />
    )}
  </State>
));
