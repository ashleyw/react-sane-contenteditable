var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";
import { omit, isEqual, pick, without } from "lodash";

var propTypes = {
  content: PropTypes.string,
  editable: PropTypes.bool,
  maxLength: PropTypes.number,
  multiLine: PropTypes.bool,
  sanitise: PropTypes.bool,
  tagName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]), // The element to make contenteditable. Takes an element string ('div', 'span', 'h1') or a styled component
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
  maxLength: Infinity,
  multiLine: false,
  sanitise: true,
  tagName: "div",
  innerRef: function innerRef() {},
  onBlur: function onBlur() {},
  onKeyDown: function onKeyDown() {},
  onPaste: function onPaste() {},
  onChange: function onChange() {},
  styled: false
};

var ContentEditable = function (_Component) {
  _inherits(ContentEditable, _Component);

  function ContentEditable(props) {
    _classCallCheck(this, ContentEditable);

    var _this = _possibleConstructorReturn(this, (ContentEditable.__proto__ || Object.getPrototypeOf(ContentEditable)).call(this, props));

    _this._onChange = function (ev) {
      var sanitise = _this.props.sanitise;

      var rawValue = _this._element.innerText;
      var value = sanitise ? _this.sanitiseValue(rawValue) : rawValue;

      if (_this.state.value !== value) {
        _this.setState({ value: rawValue }, function () {
          _this.props.onChange(ev, value);
        });
      }
    };

    _this._onPaste = function (ev) {
      var maxLength = _this.props.maxLength;


      ev.preventDefault();
      var text = ev.clipboardData.getData("text").substr(0, maxLength);
      document.execCommand("insertText", false, text);

      _this.props.onPaste(ev);
    };

    _this._onBlur = function (ev) {
      var sanitise = _this.props.sanitise;

      var rawValue = _this._element.innerText;
      var value = sanitise ? _this.sanitiseValue(rawValue) : rawValue;

      // We finally set the state to the sanitised version (rather than the `rawValue`) because we're blurring the field.
      _this.setState({ value: value }, function () {
        _this.props.onChange(ev, value);
        _this.forceUpdate();
      });

      _this.props.onBlur(ev);
    };

    _this._onKeyDown = function (ev) {
      var _this$props = _this.props,
          maxLength = _this$props.maxLength,
          multiLine = _this$props.multiLine;

      var value = _this._element.innerText;

      // return key
      if (!multiLine && ev.keyCode === 13) {
        ev.preventDefault();
        ev.currentTarget.blur();
        // Call onKeyUp directly as ev.preventDefault() means that it will not be called
        _this._onKeyUp(ev);
      }

      // Ensure we don't exceed `maxLength` (keycode 8 === backspace)
      if (maxLength && !ev.metaKey && ev.which !== 8 && value.replace(/\s\s/g, " ").length >= maxLength) {
        ev.preventDefault();
        // Call onKeyUp directly as ev.preventDefault() means that it will not be called
        _this._onKeyUp(ev);
      }
    };

    _this._onKeyUp = function (ev) {
      // Call prop.onKeyDown callback from the onKeyUp event to mitigate both of these issues:
      // Access to Synthetic event: https://github.com/ashleyw/react-sane-contenteditable/issues/14
      // Current value onKeyDown: https://github.com/ashleyw/react-sane-contenteditable/pull/6
      // this._onKeyDown can't be moved in it's entirety to onKeyUp as we lose the opportunity to preventDefault
      _this.props.onKeyDown(ev, _this._element.innerText);
    };

    _this.state = {
      value: props.content
    };
    return _this;
  }

  _createClass(ContentEditable, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.content !== this.sanitiseValue(this.state.value)) {
        this.setState({ value: nextProps.content }, this.forceUpdate);
      }
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      var propKeys = without(Object.keys(propTypes), "content");
      return !isEqual(pick(nextProps, propKeys), pick(this.props, propKeys));
    }
  }, {
    key: "sanitiseValue",
    value: function sanitiseValue(val) {
      var _props = this.props,
          maxLength = _props.maxLength,
          multiLine = _props.multiLine,
          sanitise = _props.sanitise;


      if (!sanitise) {
        return val;
      }

      // replace encoded spaces
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

      var _props2 = this.props,
          Element = _props2.tagName,
          content = _props2.content,
          editable = _props2.editable,
          styled = _props2.styled,
          props = _objectWithoutProperties(_props2, ["tagName", "content", "editable", "styled"]);

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
        style: _extends({ whiteSpace: "pre-wrap" }, props.style),
        contentEditable: editable,
        key: Date(),
        dangerouslySetInnerHTML: { __html: this.state.value },
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
