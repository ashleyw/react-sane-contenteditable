import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { isFunction, omit } from './utils';

const propTypes = {
  content: PropTypes.string,
  editable: PropTypes.bool,
  focus: PropTypes.bool,
  maxLength: PropTypes.number,
  multiLine: PropTypes.bool,
  sanitise: PropTypes.bool,
  caretPosition: PropTypes.oneOf(['start', 'end']),
  // The element to make contenteditable.
  // Takes an element string ('div', 'span', 'h1') or a styled component
  tagName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  innerRef: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  onPaste: PropTypes.func,
  onChange: PropTypes.func,
  styled: PropTypes.bool,
};

class ContentEditable extends Component {
  static propTypes = propTypes;

  static defaultProps = {
    content: '',
    editable: true,
    focus: false,
    maxLength: Infinity,
    multiLine: false,
    sanitise: true,
    caretPosition: null,
    tagName: 'div',
    innerRef: null,
    onBlur: null,
    onKeyDown: null,
    onKeyUp: null,
    onPaste: null,
    onChange: null,
    styled: false,
  };

  constructor(props) {
    super();

    this.state = {
      caretPosition: this.getCaretPositionFromProps(props),
      value: this.sanitiseValue(props.content, props),
    };

    this.ref = null;
  }

  componentDidMount() {
    this.selection = document.getSelection();
    
    const { focus } = this.props;

    if (focus && this.ref) {
      this.setCaretPosition();
      this.ref.focus();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { caretPosition, content, focus } = this.props;
    const updateCaretPosition = prevProps.caretPosition !== caretPosition
      || prevProps.focus !== focus;
    const updateContent = prevProps.content !== content;

    if (updateCaretPosition || updateContent) {
      this.setState({
        caretPosition: updateCaretPosition
          ? this.getCaretPositionFromProps() : prevState.caretPosition,
        value: updateContent
          ? this.sanitiseValue(content) : prevState.value,
      }, () => {
        this.setCaretPosition();
      });
    }
  }

  getRange () {
    return this.selection.rangeCount ? this.selection.getRangeAt(0) : document.createRange();
  }

  getCaret() {
    const originalRange = this.getRange();
    const range = originalRange.cloneRange();

    range.selectNodeContents(this.ref);
    range.setEnd(originalRange.endContainer, originalRange.endOffset);

    return range.toString().length;
  }

  getSafeCaretPosition(position, nextValue) {
    const { caretPosition, value } = this.state;

    const val = nextValue || value;
    let pos = position || caretPosition;

    return Math.min(pos, val.length);
  }

  setCaretPosition() {
    let range = this.getRange();

    range.setStart(this.ref.childNodes[0] || this.ref, this.getSafeCaretPosition());
    range.collapse();
    this.selection.removeAllRanges();
    this.selection.addRange(range);
  }

  getCaretPositionFromProps(props = this.props) {
    const caretPosition = props.caretPosition === 'end' ? props.content.length : 0;

    return props.focus ? caretPosition : null;
  }

  insertAtCaret = (prevValue, valueToInsert) => {
    const { startOffset, endOffset } = this.getRange();

    const prefix = prevValue.slice(0, startOffset);
    const suffix = prevValue.slice(endOffset);

    return [prefix, valueToInsert, suffix].join('')
  };

  sanitiseValue(value, props = this.props) {
    const { maxLength, multiLine, sanitise } = props;

    if (!sanitise) {
      return value;
    }

    if (isFunction(sanitise)) {
      return sanitise(value, this.getRange());
    }

    let nextValue = value
      // Normalise whitespace
      .replace(/[ \u00a0\u2000-\u200b\u2028-\u2029\u202e-\u202f\u3000]/g, ' ')
      // Remove multiple whitespace chars and if not multiLine, remove lineBreaks
      // FIXME This causes an issue when setting caret position
      .replace(multiLine ? /[\t\v\f\r ]+/g : /\s+/g, ' ');

    if (multiLine) {
      nextValue = nextValue
        // Replace 3+ line breaks with two
        // FIXME This causes an issue when setting caret position
        .replace(/\r|\n{3,}/g, '\n\n')
        // Remove leading & trailing whitespace
        // FIXME This causes an issue when setting caret position
        .split('\n').map(line => line.trim()).join('\n');
    }

    return nextValue
      // Ensure maxLength not exceeded
      .substr(0, maxLength);
  }

  onBlur = (ev) => {
    const { value } = this.state;
    const { onBlur } = this.props;

    if (isFunction(onBlur)) {
      onBlur(ev, value);
    }
  };

  onInput = (ev) => {
    const { maxLength } = this.props;
    const { innerText } = ev.target;

    if (innerText.length >= maxLength) {
      return;
    }

    this.setState({
      caretPosition: this.getCaret(),
      value: this.sanitiseValue(innerText),
    }, () => {
      const { onChange } = this.props;

      if (isFunction(onChange)) {
        const { value } = this.state;

        onChange(ev, value);
      }
    });
  };

  onKeyDown = (ev) => {
    const { innerText } = ev.target;
    const { maxLength, multiLine, onKeyDown } = this.props;
    let value = innerText;

    // Return key
    if (ev.keyCode === 13) {
      ev.preventDefault();

      if (multiLine) {
        const caretPosition = this.getCaret();
        const hasLineBreak = /\r|\n/g.test(innerText.charAt(caretPosition));
        const hasCharAfter = !!innerText.charAt(caretPosition);
        value = this.insertAtCaret(innerText, hasLineBreak || hasCharAfter ? '\n' : '\n\n');

        this.setState({
          caretPosition: caretPosition + 1,
          value,
        });
      } else {
        ev.currentTarget.blur();
      }
    }

    // Ensure we don't exceed `maxLength` (keycode 8 === backspace)
    if (maxLength && !ev.metaKey && ev.which !== 8 && innerText.length >= maxLength) {
      ev.preventDefault();
    }

    if (isFunction(onKeyDown)) {
      onKeyDown(ev, value);
    }
  };

  onKeyUp = (ev) => {
    const { innerText } = ev.target;
    const { onKeyUp } = this.props;

    if (isFunction(onKeyUp)) {
      onKeyUp(ev, innerText);
    }
  };

  onPaste = ev => {
    ev.preventDefault();

    const pastedValue = ev.clipboardData.getData('text');
    const value = this.insertAtCaret(this.ref.innerText, pastedValue);
    const { startOffset } = this.getRange();

    this.setState({
      caretPosition: this.getSafeCaretPosition(startOffset + pastedValue.length, value),
      value: this.sanitiseValue(value),
    }, () => {
      const { onPaste } = this.props;

      if (isFunction(onPaste)) {
        onPaste(value);
      }
    });
  };

  setRef = (ref) => {
    const { innerRef } = this.props;
    this.ref = ref;

    if (isFunction(innerRef)) {
      innerRef(ref);
    }
  };

  render() {
    const { tagName: Element, editable, styled, ...props } = this.props;

    return (
      <Element
        {...omit(props, Object.keys(propTypes))}
        {...(styled ? { innerRef: this.setRef } : { ref: this.setRef })}
        style={{ whiteSpace: 'pre-wrap', ...props.style }}
        contentEditable={editable}
        dangerouslySetInnerHTML={{ __html: this.state.value }}
        onBlur={this.onBlur}
        onInput={this.onInput}
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}
        onPaste={this.onPaste}
      />
    );
  }
}

export default ContentEditable;
