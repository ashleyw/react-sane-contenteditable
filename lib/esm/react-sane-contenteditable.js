import _extends from "@babel/runtime/helpers/extends";
import _objectSpread from "@babel/runtime/helpers/objectSpread";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isFunction, omit } from './utils';
var propTypes = {
  content: PropTypes.string,
  editable: PropTypes.bool,
  focus: PropTypes.bool,
  maxLength: PropTypes.number,
  multiLine: PropTypes.bool,
  sanitise: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
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
  styled: PropTypes.bool
};

var ContentEditable =
/*#__PURE__*/
function (_Component) {
  _inherits(ContentEditable, _Component);

  function ContentEditable(props) {
    var _this;

    _classCallCheck(this, ContentEditable);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ContentEditable).call(this));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "insertAtCaret", function (prevValue, valueToInsert) {
      var _this$getRange = _this.getRange(),
          startOffset = _this$getRange.startOffset,
          endOffset = _this$getRange.endOffset;

      var prefix = prevValue.slice(0, startOffset);
      var suffix = prevValue.slice(endOffset);
      return [prefix, valueToInsert, suffix].join('');
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onBlur", function (ev) {
      var value = _this.state.value;
      var onBlur = _this.props.onBlur;

      if (isFunction(onBlur)) {
        onBlur(ev, value);
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onInput", function (ev) {
      var maxLength = _this.props.maxLength;
      var innerText = ev.target.innerText;

      if (innerText.length >= maxLength) {
        return;
      }

      _this.setState({
        caretPosition: _this.getCaret(),
        value: _this.sanitiseValue(innerText)
      }, function () {
        var onChange = _this.props.onChange;

        if (isFunction(onChange)) {
          var value = _this.state.value;
          onChange(ev, value);
        }
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onKeyDown", function (ev) {
      var innerText = ev.target.innerText;
      var _this$props = _this.props,
          maxLength = _this$props.maxLength,
          multiLine = _this$props.multiLine,
          onKeyDown = _this$props.onKeyDown;
      var value = innerText; // Return key

      if (ev.keyCode === 13) {
        ev.preventDefault();

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
          ev.currentTarget.blur();
        }
      } // Ensure we don't exceed `maxLength` (keycode 8 === backspace)


      if (maxLength && !ev.metaKey && ev.which !== 8 && innerText.length >= maxLength) {
        ev.preventDefault();
      }

      if (isFunction(onKeyDown)) {
        onKeyDown(ev, value);
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onKeyUp", function (ev) {
      var innerText = ev.target.innerText;
      var onKeyUp = _this.props.onKeyUp;

      if (isFunction(onKeyUp)) {
        onKeyUp(ev, innerText);
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onPaste", function (ev) {
      ev.preventDefault();
      var pastedValue = ev.clipboardData.getData('text');

      var value = _this.insertAtCaret(_this.ref.innerText, pastedValue);

      var _this$getRange2 = _this.getRange(),
          startOffset = _this$getRange2.startOffset;

      _this.setState({
        caretPosition: _this.getSafeCaretPosition(startOffset + pastedValue.length, value),
        value: _this.sanitiseValue(value)
      }, function () {
        var onPaste = _this.props.onPaste;

        if (isFunction(onPaste)) {
          onPaste(value);
        }
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "setRef", function (ref) {
      var innerRef = _this.props.innerRef;
      _this.ref = ref;

      if (isFunction(innerRef)) {
        innerRef(ref);
      }
    });

    _this.state = {
      caretPosition: _this.getCaretPositionFromProps(props),
      value: _this.sanitiseValue(props.content, props)
    };
    _this.ref = null;
    _this.selection = document.getSelection();
    return _this;
  }

  _createClass(ContentEditable, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var focus = this.props.focus;

      if (focus && this.ref) {
        this.setCaretPosition();
        this.ref.focus();
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var _this2 = this;

      var _this$props2 = this.props,
          caretPosition = _this$props2.caretPosition,
          content = _this$props2.content,
          focus = _this$props2.focus;
      var updateCaretPosition = prevProps.caretPosition !== caretPosition || prevProps.focus !== focus;
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
      if (!this.selection) {
        return null;
      }

      return this.selection.rangeCount ? this.selection.getRangeAt(0) : document.createRange();
    }
  }, {
    key: "getCaret",
    value: function getCaret() {
      var originalRange = this.getRange();
      var range = originalRange.cloneRange();
      range.selectNodeContents(this.ref);
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
      var range = this.getRange();
      range.setStart(this.ref.childNodes[0] || this.ref, this.getSafeCaretPosition());
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
      .replace(/[ \u00a0\u2000-\u200b\u2028-\u2029\u202e-\u202f\u3000]/g, ' ') // Remove multiple whitespace chars and if not multiLine, remove lineBreaks
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

      return nextValue // Ensure maxLength not exceeded
      .substr(0, maxLength);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          Element = _this$props3.tagName,
          editable = _this$props3.editable,
          styled = _this$props3.styled,
          props = _objectWithoutProperties(_this$props3, ["tagName", "editable", "styled"]);

      return React.createElement(Element, _extends({}, omit(props, Object.keys(propTypes)), styled ? {
        innerRef: this.setRef
      } : {
        ref: this.setRef
      }, {
        style: _objectSpread({
          whiteSpace: 'pre-wrap'
        }, props.style),
        contentEditable: editable,
        dangerouslySetInnerHTML: {
          __html: this.state.value
        },
        onBlur: this.onBlur,
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
  innerRef: null,
  onBlur: null,
  onKeyDown: null,
  onKeyUp: null,
  onPaste: null,
  onChange: null,
  styled: false
});

export default ContentEditable;