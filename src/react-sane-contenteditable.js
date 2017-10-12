import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ContentEditable extends Component {
  static propTypes = {
    content: PropTypes.string,
    editable: PropTypes.bool,
    maxLength: PropTypes.number,
    mode: PropTypes.oneOf(['plaintext', 'html']),
    multiLine: PropTypes.bool,
    onChange: PropTypes.func,
    tagName: PropTypes.string,
  }

  static defaultProps = {
    editable: true,
    maxLength: Infinity,
    mode: 'plaintext',
    multiLine: false,
    tagName: 'div',
  }

  shouldComponentUpdate(nextProps) {
    const method = this.getInnerMethod();
    return nextProps.content !== this.refs.element[method];
  }


  getInnerMethod() {
    return this.props.mode === 'plaintext' ? 'innerText' : 'innerHTML';
  }

  _onChange = (ev) => {
    const method = this.getInnerMethod();
    const value = this.refs.element[method];

    this.props.onChange(ev, value);
  }

  sanatisedValue() {
    const { maxLength, multiLine } = this.props;

    const method = this.getInnerMethod();
    
    // replace encoded spaces
    let value = this.refs.element[method].replace(/&nbsp;/g, ' ');

    if (multiLine) {
      // replace any any number of whitespace characters (other than new lines!) with a single space
      value = value.replace(/[\t\v\f\r \u00a0\u2000-\u200b\u2028-\u2029\u3000]+/g, ' ');
    } else {
      // replace any number of whitespace characters with a single space
      value = value.replace(/\s+/g, ' ');
    }

    return value.split('\n')
      .map(line => line.trim())
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
      .substr(0, maxLength);
  }

  _onPaste = (ev) => {
    const { maxLength, mode } = this.props;

    if (mode === 'plaintext') {
      ev.preventDefault();
      const text = ev.clipboardData.getData('text').substr(0, maxLength);
      document.execCommand('insertText', false, text);
    }
  }

  _onBlur = (ev) => {
    this.props.onChange(ev, this.sanatisedValue());
  }

  _onKeyDown = (ev) => {
    const { maxLength, multiLine } = this.props;
    const method = this.getInnerMethod();
    const value = this.refs.element[method];

    // keyCode 13 === return key
    if (!multiLine && ev.keyCode === 13) {
      ev.preventDefault();
      ev.currentTarget.blur();
    }

    // Ensure we don't exceed `maxLength` (keyCode 8 === backspace)
    if (maxLength && !ev.metaKey && ev.which !== 8 && value.replace(/\s\s/g, ' ').length >= maxLength) {
      ev.preventDefault();
    }
  }

  render() {
    const { tagName: Element, content, editable, ...props } = this.props;

    return (
      <Element
        {...props}
        ref="element"
        style={{ whiteSpace: 'pre-wrap', ...props.style }}
        contentEditable={editable}
        dangerouslySetInnerHTML={{ __html: content.replace(/[\t\v\f\r \u00a0\u2000-\u200b\u2028-\u2029\u3000]{2}/g, ' &nbsp;') }}
        onBlur={this._onBlur}
        onInput={this._onChange}
        onKeyDown={this._onKeyDown}
        onPaste={this._onPaste}
      />
    );
  }
}
