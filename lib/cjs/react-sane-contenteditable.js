"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var propTypes = {
  content: _propTypes2.default.string,
  editable: _propTypes2.default.bool,
  focus: _propTypes2.default.bool,
  maxLength: _propTypes2.default.number,
  multiLine: _propTypes2.default.bool,
  sanitise: _propTypes2.default.bool,
  caretPosition: _propTypes2.default.oneOf(['start', 'end']),
  // The element to make contenteditable.
  // Takes an element string ('div', 'span', 'h1') or a styled component
  tagName: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]),
  innerRef: _propTypes2.default.func,
  onBlur: _propTypes2.default.func,
  onKeyDown: _propTypes2.default.func,
  onKeyUp: _propTypes2.default.func,
  onPaste: _propTypes2.default.func,
  onChange: _propTypes2.default.func,
  styled: _propTypes2.default.bool
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

      if ((0, _utils.isFunction)(onBlur)) {
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

        if ((0, _utils.isFunction)(onChange)) {
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

      if ((0, _utils.isFunction)(onKeyDown)) {
        onKeyDown(ev, value);
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onKeyUp", function (ev) {
      var innerText = ev.target.innerText;
      var onKeyUp = _this.props.onKeyUp;

      if ((0, _utils.isFunction)(onKeyUp)) {
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

        if ((0, _utils.isFunction)(onPaste)) {
          onPaste(value);
        }
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "setRef", function (ref) {
      var innerRef = _this.props.innerRef;
      _this.ref = ref;

      if ((0, _utils.isFunction)(innerRef)) {
        innerRef(ref);
      }
    });

    _this.state = {
      caretPosition: _this.getCaretPositionFromProps(props),
      value: _this.sanitiseValue(props.content, props)
    };
    _this.ref = null;
    return _this;
  }

  _createClass(ContentEditable, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var focus = this.props.focus;
      this.selection = document.getSelection();

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

      if ((0, _utils.isFunction)(sanitise)) {
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

      return _react2.default.createElement(Element, _extends({}, (0, _utils.omit)(props, Object.keys(propTypes)), styled ? {
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
}(_react.Component);

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

exports.default = ContentEditable;