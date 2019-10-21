import _Object$defineProperty from "@babel/runtime-corejs2/core-js/object/define-property";
import _Object$defineProperties from "@babel/runtime-corejs2/core-js/object/define-properties";
import _Object$getOwnPropertyDescriptors from "@babel/runtime-corejs2/core-js/object/get-own-property-descriptors";
import _Object$getOwnPropertyDescriptor from "@babel/runtime-corejs2/core-js/object/get-own-property-descriptor";
import _Object$getOwnPropertySymbols from "@babel/runtime-corejs2/core-js/object/get-own-property-symbols";
import _extends from "@babel/runtime-corejs2/helpers/extends";
import _objectWithoutProperties from "@babel/runtime-corejs2/helpers/objectWithoutProperties";
import _classCallCheck from "@babel/runtime-corejs2/helpers/classCallCheck";
import _createClass from "@babel/runtime-corejs2/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime-corejs2/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime-corejs2/helpers/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime-corejs2/helpers/assertThisInitialized";
import _inherits from "@babel/runtime-corejs2/helpers/inherits";
import _defineProperty from "@babel/runtime-corejs2/helpers/defineProperty";
import _Object$keys from "@babel/runtime-corejs2/core-js/object/keys";

function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (_Object$getOwnPropertyDescriptors) { _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } } return target; }

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { isFunction, omit } from './utils';
var propTypes = {
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
  onFocus: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  onPaste: PropTypes.func,
  onChange: PropTypes.func
};

var propKeys = _Object$keys(propTypes); // eslint-disable-next-line import/no-default-export


var ContentEditable =
/*#__PURE__*/
function (_Component) {
  _inherits(ContentEditable, _Component);

  function ContentEditable(props) {
    var _this;

    _classCallCheck(this, ContentEditable);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ContentEditable).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "ref", void 0);

    _defineProperty(_assertThisInitialized(_this), "selection", void 0);

    _defineProperty(_assertThisInitialized(_this), "insertAtCaret", function (prevValue, valueToInsert) {
      var _this$getRange = _this.getRange(),
          startOffset = _this$getRange.startOffset,
          endOffset = _this$getRange.endOffset;

      var prefix = prevValue.slice(0, startOffset);
      var suffix = prevValue.slice(endOffset);
      return [prefix, valueToInsert, suffix].join('');
    });

    _defineProperty(_assertThisInitialized(_this), "onBlur", function (event) {
      var value = _this.state.value;
      var onBlur = _this.props.onBlur;

      _this.setState({
        isFocused: false
      });

      if (isFunction(onBlur)) {
        onBlur(event, value);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onFocus", function (event) {
      var onFocus = _this.props.onFocus;

      _this.setState({
        isFocused: true
      });

      if (isFunction(onFocus)) {
        onFocus(event);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onInput", function (event) {
      var maxLength = _this.props.maxLength;
      var innerText = event.target.innerText;

      if (innerText.length >= maxLength) {
        return;
      }

      _this.setState({
        caretPosition: _this.getCaret(),
        value: _this.sanitiseValue(innerText)
      }, function () {
        var onChange = _this.props.onChange;

        if (isFunction(onChange)) {
          var _value = _this.state.value;
          onChange(_value);
        }
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onKeyDown", function (event) {
      var innerText = event.target.innerText;
      var _this$props = _this.props,
          maxLength = _this$props.maxLength,
          multiLine = _this$props.multiLine,
          onKeyDown = _this$props.onKeyDown;
      var value = innerText; // Return key

      if (event.keyCode === 13) {
        event.preventDefault();

        if (multiLine) {
          var caretPosition = _this.getCaret();

          var hasLineBreak = /\r|\n/g.test(innerText.charAt(caretPosition));
          var hasCharAfter = !!innerText.charAt(caretPosition);
          value = _this.insertAtCaret(innerText, hasLineBreak || hasCharAfter ? '\n' : '\n\n');

          _this.setState({
            caretPosition: caretPosition + 1,
            value: value
          });
        } else {
          event.currentTarget.blur();
        }
      } // Ensure we don't exceed `maxLength` (keycode 8 === backspace)


      if (maxLength && !event.metaKey && event.which !== 8 && innerText.length >= maxLength) {
        event.preventDefault();
      }

      if (isFunction(onKeyDown)) {
        onKeyDown(event, value);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onKeyUp", function (event) {
      var innerText = event.target.innerText;
      var onKeyUp = _this.props.onKeyUp;

      if (isFunction(onKeyUp)) {
        onKeyUp(event, innerText);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onPaste", function (event) {
      event.preventDefault();
      var pastedValue = event.clipboardData.getData('text');

      var value = _this.insertAtCaret(_this.ref.current.textContent, pastedValue);

      var _this$getRange2 = _this.getRange(),
          startOffset = _this$getRange2.startOffset;

      _this.setState({
        caretPosition: _this.getSafeCaretPosition(startOffset + pastedValue.length, value),
        value: _this.sanitiseValue(value)
      }, function () {
        var _this$props2 = _this.props,
            onPaste = _this$props2.onPaste,
            onChange = _this$props2.onChange;

        if (isFunction(onPaste)) {
          onPaste(value);
        }

        if (isFunction(onChange)) {
          onChange(value);
        }
      });
    });

    _this.state = {
      caretPosition: _this.getCaretPositionFromProps(props),
      value: _this.sanitiseValue(props.content, props),
      isFocused: false
    };
    _this.ref = React.createRef();
    _this.selection = document.getSelection();
    return _this;
  }

  _createClass(ContentEditable, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var focus = this.props.focus;

      if (focus && this.ref.current) {
        this.setCaretPosition();
        this.ref.current.focus();
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var _this2 = this;

      var _this$props3 = this.props,
          caretPosition = _this$props3.caretPosition,
          content = _this$props3.content,
          focus = _this$props3.focus;
      var updateCaretPosition = prevProps.caretPosition !== caretPosition || prevProps.focus !== focus; // prettier-ignore

      var updateContent = prevProps.content !== content;

      if (updateCaretPosition || updateContent) {
        this.setState({
          caretPosition: updateCaretPosition ? this.getCaretPositionFromProps() : prevState.caretPosition,
          value: updateContent ? this.sanitiseValue(content) : prevState.value
        }, function () {
          _this2.setCaretPosition();
        });
      }
    }
  }, {
    key: "getRange",
    value: function getRange() {
      return this.selection.rangeCount ? this.selection.getRangeAt(0) : document.createRange();
    }
  }, {
    key: "getCaret",
    value: function getCaret() {
      var originalRange = this.getRange();
      var range = originalRange.cloneRange();
      range.selectNodeContents(this.ref.current);
      range.setEnd(originalRange.endContainer, originalRange.endOffset);
      return range.toString().length;
    }
  }, {
    key: "getSafeCaretPosition",
    value: function getSafeCaretPosition(position, nextValue) {
      var _this$state = this.state,
          caretPosition = _this$state.caretPosition,
          value = _this$state.value;
      var val = nextValue || value;
      var pos = position || caretPosition;
      return Math.min(pos, val.length);
    }
  }, {
    key: "setCaretPosition",
    value: function setCaretPosition() {
      var range = this.getRange(); // @ts-ignore

      range.setStart(this.ref.current.childNodes[0] || this.ref.current, this.getSafeCaretPosition());
      range.collapse();
      this.selection.removeAllRanges();
      this.selection.addRange(range);
    }
  }, {
    key: "getCaretPositionFromProps",
    value: function getCaretPositionFromProps() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
      var caretPosition = props.caretPosition === 'end' ? props.content.length : 0;
      return props.focus ? caretPosition : null;
    }
  }, {
    key: "sanitiseValue",
    value: function sanitiseValue(value) {
      var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.props;
      var maxLength = props.maxLength,
          multiLine = props.multiLine,
          sanitise = props.sanitise;

      if (!sanitise) {
        return value;
      }

      if (isFunction(sanitise)) {
        return sanitise(value, this.getRange());
      }

      var nextValue = value // Normalise whitespace
      .replace(/[ \u00A0\u2000-\u200B\u2028-\u2029\u202E-\u202F\u3000]/g, ' ') // Remove multiple whitespace chars and if not multiLine, remove lineBreaks
      // FIXME This causes an issue when setting caret position
      .replace(multiLine ? /[\t\v\f\r ]+/g : /\s+/g, ' ');

      if (multiLine) {
        nextValue = nextValue // Replace 3+ line breaks with two
        // FIXME This causes an issue when setting caret position
        .replace(/\r|\n{3,}/g, '\n\n') // Remove leading & trailing whitespace
        // FIXME This causes an issue when setting caret position
        .split('\n').map(function (line) {
          return line.trim();
        }).join('\n');
      }

      return (// Ensure maxLength not exceeded
        nextValue.substr(0, maxLength)
      );
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          Element = _this$props4.tagName,
          editable = _this$props4.editable,
          props = _objectWithoutProperties(_this$props4, ["tagName", "editable"]);

      return React.createElement(Element, _extends({}, omit(props, propKeys), {
        ref: this.ref,
        style: _objectSpread({
          whiteSpace: 'pre-wrap'
        }, props.style),
        contentEditable: editable,
        dangerouslySetInnerHTML: {
          __html: this.state.value
        },
        onBlur: this.onBlur,
        onFocus: this.onFocus,
        onInput: this.onInput,
        onKeyDown: this.onKeyDown,
        onKeyUp: this.onKeyUp,
        onPaste: this.onPaste
      }));
    }
  }]);

  return ContentEditable;
}(Component);

_defineProperty(ContentEditable, "defaultProps", {
  content: '',
  editable: true,
  focus: false,
  maxLength: Infinity,
  multiLine: false,
  sanitise: true,
  caretPosition: null,
  tagName: 'div',
  onBlur: null,
  onFocus: null,
  onKeyDown: null,
  onKeyUp: null,
  onPaste: null,
  onChange: null
});

export { ContentEditable as default };