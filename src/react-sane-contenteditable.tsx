import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyledComponent } from 'styled-components';

import { isFunction, omit } from './utils';

type SanitiseFn = (value: string, range: Range) => string;

type InputEvent = React.KeyboardEvent<HTMLInputElement> & { target: HTMLInputElement };

interface ContentEditableProps {
  content: string;
  onChange: (value: string) => void;
  focus?: boolean;
  onBlur?: (event: React.FormEvent<HTMLInputElement>, value: string) => void;
  maxLength?: number;
  multiLine?: boolean;
  onKeyDown?: (event: React.KeyboardEvent, value: string) => void;
  caretPosition?: number | 'start' | 'end';
  onKeyUp?: (event: React.KeyboardEvent, value: string) => void;
  onPaste?: (value: string) => void;
  tagName?: string | StyledComponent<any, any>;
  editable?: boolean;
  sanitise?: boolean | SanitiseFn;
  style?: React.CSSProperties;
  [attr: string]: any;
}

interface ContentEditableState {
  value: string;
  caretPosition: number;
}

const propTypes = {
  content: PropTypes.string,
  editable: PropTypes.bool,
  focus: PropTypes.bool,
  maxLength: PropTypes.number,
  multiLine: PropTypes.bool,
  sanitise: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  caretPosition: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['start', 'end'])]),
  // The element to make contenteditable.
  // Takes an element string ('div', 'span', 'h1') or a styled component
  tagName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  onPaste: PropTypes.func,
  onChange: PropTypes.func,
};

const propKeys = Object.keys(propTypes);

// eslint-disable-next-line import/no-default-export
export default class ContentEditable extends Component<ContentEditableProps, ContentEditableState> {
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
    onBlur: null,
    onKeyDown: null,
    onKeyUp: null,
    onPaste: null,
    onChange: null,
  };

  public ref: React.RefObject<HTMLInputElement>;
  private selection: Selection;

  constructor(props: ContentEditableProps) {
    super(props);

    this.state = {
      caretPosition: this.getCaretPositionFromProps(props),
      value: this.sanitiseValue(props.content, props),
    };

    this.ref = React.createRef();
    this.selection = document.getSelection();
  }

  componentDidMount() {
    const { focus } = this.props;

    if (focus && this.ref.current) {
      this.setCaretPosition();
      this.ref.current.focus();
    }
  }

  componentDidUpdate(prevProps: ContentEditableProps, prevState: ContentEditableState) {
    const { caretPosition, content, focus } = this.props;
    const updateCaretPosition = prevProps.caretPosition !== caretPosition || prevProps.focus !== focus; // prettier-ignore
    const updateContent = prevProps.content !== content;

    if (updateCaretPosition || updateContent) {
      this.setState(
        {
          caretPosition: updateCaretPosition ? this.getCaretPositionFromProps() : prevState.caretPosition,
          value: updateContent ? this.sanitiseValue(content) : prevState.value,
        },
        () => {
          this.setCaretPosition();
        },
      );
    }
  }

  getRange(): Range {
    return this.selection.rangeCount ? this.selection.getRangeAt(0) : document.createRange();
  }

  getCaret() {
    const originalRange = this.getRange();
    const range = originalRange.cloneRange();

    range.selectNodeContents(this.ref.current);
    range.setEnd(originalRange.endContainer, originalRange.endOffset);

    return range.toString().length;
  }

  getSafeCaretPosition(position: number, nextValue: string) {
    const { caretPosition, value } = this.state;

    const val = nextValue || value;
    const pos = position || caretPosition;

    return Math.min(pos, val.length);
  }

  setCaretPosition() {
    const range = this.getRange();

    // @ts-ignore
    range.setStart(this.ref.current.childNodes[0] || this.ref.current, this.getSafeCaretPosition());
    range.collapse();
    this.selection.removeAllRanges();
    this.selection.addRange(range);
  }

  getCaretPositionFromProps(props: ContentEditableProps = this.props) {
    const caretPosition = props.caretPosition === 'end' ? props.content.length : 0;
    return props.focus ? caretPosition : null;
  }

  insertAtCaret = (prevValue: string, valueToInsert: string) => {
    const { startOffset, endOffset } = this.getRange();

    const prefix = prevValue.slice(0, startOffset);
    const suffix = prevValue.slice(endOffset);

    return [prefix, valueToInsert, suffix].join('');
  };

  sanitiseValue(value: string, props: ContentEditableProps = this.props): string {
    const { maxLength, multiLine, sanitise } = props;

    if (!sanitise) {
      return value;
    }

    if (isFunction(sanitise)) {
      return (sanitise as SanitiseFn)(value, this.getRange());
    }

    let nextValue = value
      // Normalise whitespace
      .replace(/[ \u00A0\u2000-\u200B\u2028-\u2029\u202E-\u202F\u3000]/g, ' ')
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
        .split('\n')
        .map(line => line.trim())
        .join('\n');
    }

    return (
      // Ensure maxLength not exceeded
      nextValue.substr(0, maxLength)
    );
  }

  onBlur = (event: React.FormEvent<HTMLInputElement>) => {
    const { value } = this.state;
    const { onBlur } = this.props;

    if (isFunction(onBlur)) {
      onBlur(event, value);
    }
  };

  onInput = (event: InputEvent) => {
    const { maxLength } = this.props;
    const { innerText } = event.target;

    if (innerText.length >= maxLength) {
      return;
    }

    this.setState(
      {
        caretPosition: this.getCaret(),
        value: this.sanitiseValue(innerText),
      },
      () => {
        const { onChange } = this.props;

        if (isFunction(onChange)) {
          const { value } = this.state;

          onChange(value);
        }
      },
    );
  };

  onKeyDown = (event: InputEvent) => {
    const { innerText } = event.target;
    const { maxLength, multiLine, onKeyDown } = this.props;
    let value = innerText;

    // Return key
    if (event.keyCode === 13) {
      event.preventDefault();

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
        event.currentTarget.blur();
      }
    }

    // Ensure we don't exceed `maxLength` (keycode 8 === backspace)
    if (maxLength && !event.metaKey && event.which !== 8 && innerText.length >= maxLength) {
      event.preventDefault();
    }

    if (isFunction(onKeyDown)) {
      onKeyDown(event, value);
    }
  };

  onKeyUp = (event: InputEvent) => {
    const { innerText } = event.target;
    const { onKeyUp } = this.props;

    if (isFunction(onKeyUp)) {
      onKeyUp(event, innerText);
    }
  };

  onPaste = (event: React.ClipboardEvent) => {
    event.preventDefault();

    const pastedValue = event.clipboardData.getData('text');
    const value = this.insertAtCaret(this.ref.current.textContent, pastedValue);
    const { startOffset } = this.getRange();

    this.setState(
      {
        caretPosition: this.getSafeCaretPosition(startOffset + pastedValue.length, value),
        value: this.sanitiseValue(value),
      },
      () => {
        const { onPaste, onChange } = this.props;

        if (isFunction(onPaste)) {
          onPaste(value);
        }

        if (isFunction(onChange)) {
          onChange(value);
        }
      },
    );
  };

  render() {
    const { tagName: Element, editable, ...props } = this.props;

    return (
      <Element
        {...omit(props, propKeys)}
        ref={this.ref}
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
