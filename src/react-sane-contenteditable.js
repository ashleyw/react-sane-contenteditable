import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { omit, isEqual, pick } from 'lodash';

const propTypes = {
  content: PropTypes.string,
  editable: PropTypes.bool,
  maxLength: PropTypes.number,
  multiLine: PropTypes.bool,
  onChange: PropTypes.func,
  sanitise: PropTypes.bool,
  /** The element to make contenteditable. Takes an element string ('div', 'span', 'h1') or a styled component */
  tagName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  innerRef: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  onPaste: PropTypes.func,
  /** tagName is a styled component (uses innerRef instead of ref) */
  styled: PropTypes.bool,
};

const defaultProps = {
  content: '',
  editable: true,
  maxLength: Infinity,
  multiLine: false,
  sanitise: true,
  tagName: 'div',
  innerRef: () => {},
  onBlur: () => {},
  onKeyDown: () => {},
  onPaste: () => {},
  styled: false,
};

class ContentEditable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.content,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.content !== this.sanitiseValue(this.state.value)) {
      this.setState({ value: nextProps.content }, this.forceUpdate);
    }
  }

  shouldComponentUpdate(nextProps) {
    const propKeys = omit(Object.keys(propTypes), ['content']);

    return !isEqual(
      pick(nextProps, propKeys),
      pick(this.props, propKeys)
    );
  }

  sanitiseValue(val) {
    const { maxLength, multiLine, sanitise } = this.props;

    if (!sanitise) {
      return val;
    }

    // replace encoded spaces
    let value = val.replace(/&nbsp;/g, ' ');

    if (multiLine) {
      // replace any 2+ character whitespace (other than new lines) with a single space
      value = value.replace(/[\t\v\f\r \u00a0\u2000-\u200b\u2028-\u2029\u3000]+/g, ' ');
    } else {
      value = value.replace(/\s+/g, ' ');
    }

    return value.split('\n')
      .map(line => line.trim())
      .join('\n')
      .replace(/\n{3,}/g, '\n\n') // replace 3+ linebreaks with two
      .trim()
      .substr(0, maxLength);
  }

  _onChange = (ev) => {
    const { sanitise } = this.props;
    const rawValue = this._element.innerText;
    const value = sanitise ? this.sanitiseValue(rawValue) : rawValue;

    if (this.state.value !== value) {
      this.setState({ value: rawValue }, () => {
        this.props.onChange(ev, value);
      });
    }
  }

  _onPaste = (ev) => {
    const { maxLength } = this.props;

    ev.preventDefault();
    const text = ev.clipboardData.getData('text').substr(0, maxLength);
    document.execCommand('insertText', false, text);

    this.props.onPaste(ev);
  }

  _onBlur = (ev) => {
    const { sanitise } = this.props;
    const rawValue = this._element.innerText;
    const value = sanitise ? this.sanitiseValue(rawValue) : rawValue;

    // We finally set the state to the sanitised version (rather than the `rawValue`) because we're blurring the field.
    this.setState({ value }, () => {
      this.forceUpdate();
      this.props.onChange(ev, value);
    });

    this.props.onBlur(ev);
  }

  _onKeyDown = (ev) => {
    const { maxLength, multiLine } = this.props;
    const value = this._element.innerText;

    // return key
    if (!multiLine && ev.keyCode === 13) {
      ev.preventDefault();
      ev.currentTarget.blur();
    }

    // Ensure we don't exceed `maxLength` (keycode 8 === backspace)
    if (maxLength && !ev.metaKey && ev.which !== 8 && value.replace(/\s\s/g, ' ').length >= maxLength) {
      ev.preventDefault();
    }

    this.props.onKeyDown(ev);
  }

  render() {
    const { tagName: Element, content, editable, styled, ...props } = this.props;

    return (
      <Element
        {...omit(props, Object.keys(propTypes))}
        {...(styled
            ? {
                innerRef: (c) => {
                  this._element = c;
                  props.innerRef(c);
                },
              }
            : {
                ref: (c) => {
                  this._element = c;
                  props.innerRef(c);
                },
        })}
        style={{ whiteSpace: 'pre-wrap', ...props.style }}
        contentEditable={editable}
        dangerouslySetInnerHTML={{ __html: this.state.value }}
        onBlur={this._onBlur}
        onInput={this._onChange}
        onKeyDown={this._onKeyDown}
        onPaste={this._onPaste}
      />
    );
  }
}

ContentEditable.propTypes = propTypes;
ContentEditable.defaultProps = defaultProps;

export default ContentEditable;
