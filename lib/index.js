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

import React, { Component } from "react";
import PropTypes from "prop-types";
import { omit, isEqual, pick, without } from "lodash";
var propTypes = {
  content: PropTypes.string,
  editable: PropTypes.bool,
  focus: PropTypes.bool,
  maxLength: PropTypes.number,
  multiLine: PropTypes.bool,
  sanitise: PropTypes.bool,
  caretPosition: PropTypes.oneOf(['start', 'end']),
  tagName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  // The element to make contenteditable. Takes an element string ('div', 'span', 'h1') or a styled component
  innerRef: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  onPaste: PropTypes.func,
  onChange: PropTypes.func,
  styled: PropTypes.bool // If element is a styled component (uses innerRef instead of ref)

};
var defaultProps = {
  content: "",
  editable: true,
  focus: false,
  maxLength: Infinity,
  multiLine: false,
  sanitise: true,
  caretPosition: null,
  tagName: "div",
  innerRef: function innerRef() {},
  onBlur: function onBlur() {},
  onKeyDown: function onKeyDown() {},
  onPaste: function onPaste() {},
  onChange: function onChange() {},
  styled: false
};

var ContentEditable =
/*#__PURE__*/
function (_Component) {
  _inherits(ContentEditable, _Component);

  function ContentEditable(props) {
    var _this;

    _classCallCheck(this, ContentEditable);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ContentEditable).call(this, props));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "setFocus", function () {
      if (_this.props.focus && _this._element) {
        _this._element.focus();
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "setCaret", function () {
      var caretPosition = _this.props.caretPosition;

      if (caretPosition && _this._element) {
        var offset = caretPosition === 'end' ? 1 : 0;
        var range = document.createRange();
        var selection = window.getSelection();
        range.setStart(_this._element, offset);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onChange", function (ev) {
      var sanitise = _this.props.sanitise;
      var rawValue = _this._element.innerText;
      var value = sanitise ? _this.sanitiseValue(rawValue) : rawValue;

      if (_this.state.value !== value) {
        _this.setState({
          value: rawValue
        }, function () {
          _this.props.onChange(ev, value);
        });
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onPaste", function (ev) {
      var maxLength = _this.props.maxLength;
      ev.preventDefault();
      var text = ev.clipboardData.getData("text").substr(0, maxLength);
      document.execCommand("insertText", false, text);

      _this.props.onPaste(ev);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onBlur", function (ev) {
      var sanitise = _this.props.sanitise;
      var rawValue = _this._element.innerText;
      var value = sanitise ? _this.sanitiseValue(rawValue) : rawValue; // We finally set the state to the sanitised version (rather than the `rawValue`) because we're blurring the field.

      _this.setState({
        value: value
      }, function () {
        _this.props.onChange(ev, value);

        _this.forceUpdate();
      });

      _this.props.onBlur(ev);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onKeyDown", function (ev) {
      var _this$props = _this.props,
          maxLength = _this$props.maxLength,
          multiLine = _this$props.multiLine;
      var value = _this._element.innerText; // return key

      if (!multiLine && ev.keyCode === 13) {
        ev.preventDefault();
        ev.currentTarget.blur(); // Call onKeyUp directly as ev.preventDefault() means that it will not be called

        _this._onKeyUp(ev);
      } // Ensure we don't exceed `maxLength` (keycode 8 === backspace)


      if (maxLength && !ev.metaKey && ev.which !== 8 && value.replace(/\s\s/g, " ").length >= maxLength) {
        ev.preventDefault(); // Call onKeyUp directly as ev.preventDefault() means that it will not be called

        _this._onKeyUp(ev);
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onKeyUp", function (ev) {
      // Call prop.onKeyDown callback from the onKeyUp event to mitigate both of these issues:
      // Access to Synthetic event: https://github.com/ashleyw/react-sane-contenteditable/issues/14
      // Current value onKeyDown: https://github.com/ashleyw/react-sane-contenteditable/pull/6
      // this._onKeyDown can't be moved in it's entirety to onKeyUp as we lose the opportunity to preventDefault
      _this.props.onKeyDown(ev, _this._element.innerText);
    });

    _this.state = {
      value: props.content
    };
    return _this;
  }

  _createClass(ContentEditable, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setFocus();
      this.setCaret();
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.content !== this.sanitiseValue(this.state.value)) {
        this.setState({
          value: nextProps.content
        }, this.forceUpdate);
      }
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      var propKeys = without(Object.keys(nextProps), "content");
      return !isEqual(pick(nextProps, propKeys), pick(this.props, propKeys));
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.setFocus();
      this.setCaret();
    }
  }, {
    key: "sanitiseValue",
    value: function sanitiseValue(val) {
      var _this$props2 = this.props,
          maxLength = _this$props2.maxLength,
          multiLine = _this$props2.multiLine,
          sanitise = _this$props2.sanitise;

      if (!sanitise) {
        return val;
      } // replace encoded spaces


      var value = val.replace(/&nbsp;/g, " ");

      if (multiLine) {
        // replace any 2+ character whitespace (other than new lines) with a single space
        value = value.replace(/[\t\v\f\r \u00a0\u2000-\u200b\u2028-\u2029\u3000]+/g, " ");
      } else {
        value = value.replace(/\s+/g, " ");
      }

      return value.split("\n").map(function (line) {
        return line.trim();
      }).join("\n").replace(/\n{3,}/g, "\n\n") // replace 3+ line breaks with two
      .trim().substr(0, maxLength);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props3 = this.props,
          Element = _this$props3.tagName,
          content = _this$props3.content,
          editable = _this$props3.editable,
          styled = _this$props3.styled,
          props = _objectWithoutProperties(_this$props3, ["tagName", "content", "editable", "styled"]);

      return React.createElement(Element, _extends({}, omit(props, Object.keys(propTypes)), styled ? {
        innerRef: function innerRef(c) {
          _this2._element = c;
          props.innerRef(c);
        }
      } : {
        ref: function ref(c) {
          _this2._element = c;
          props.innerRef(c);
        }
      }, {
        style: _objectSpread({
          whiteSpace: "pre-wrap"
        }, props.style),
        contentEditable: editable,
        key: Date(),
        dangerouslySetInnerHTML: {
          __html: this.state.value
        },
        onBlur: this._onBlur,
        onInput: this._onChange,
        onKeyDown: this._onKeyDown,
        onKeyUp: this._onKeyUp,
        onPaste: this._onPaste
      }));
    }
  }]);

  return ContentEditable;
}(Component);

ContentEditable.propTypes = propTypes;
ContentEditable.defaultProps = defaultProps;
export default ContentEditable;
