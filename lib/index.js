"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _defaultProps;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var propTypes = {
  content: _propTypes2.default.string,
  editable: _propTypes2.default.bool,
  maxLength: _propTypes2.default.number,
  multiLine: _propTypes2.default.bool,
  onChange: _propTypes2.default.func,
  sanitise: _propTypes2.default.bool,
  /** The element to make contenteditable. Takes an element string ('div', 'span', 'h1') or a styled component */
  tagName: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]),
  innerRef: _propTypes2.default.func,
  onBlur: _propTypes2.default.func,
  onKeyDown: _propTypes2.default.func,
  onPaste: _propTypes2.default.func,
  /** tagName is a styled component (uses innerRef instead of ref) */
  styled: _propTypes2.default.bool
};

var defaultProps = (_defaultProps = {
  content: "",
  editable: true,
  maxLength: Infinity,
  multiLine: false,
  sanitise: true,
  tagName: "div",
  innerRef: function innerRef() {},
  onBlur: function onBlur() {},
  onKeyDown: function onKeyDown() {},
  onPaste: function onPaste() {}
}, _defineProperty(_defaultProps, "tagName", "div"), _defineProperty(_defaultProps, "innerRef", _propTypes2.default.func), _defineProperty(_defaultProps, "styled", false), _defaultProps);

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
        _this.forceUpdate();
        _this.props.onChange(ev, value);
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
      }

      // Ensure we don't exceed `maxLength` (keycode 8 === backspace)
      if (maxLength && !ev.metaKey && ev.which !== 8 && value.replace(/\s\s/g, " ").length >= maxLength) {
        ev.preventDefault();
      }

      setTimeout(function () {
        _this.props.onKeyDown(ev, _this._element.innerText);
      }, 0);
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
      var propKeys = (0, _lodash.without)(Object.keys(propTypes), ["content"]);

      return !(0, _lodash.isEqual)((0, _lodash.pick)(nextProps, propKeys), (0, _lodash.pick)(this.props, propKeys));
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

      return _react2.default.createElement(Element, _extends({}, (0, _lodash.omit)(props, Object.keys(propTypes)), styled ? {
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
        dangerouslySetInnerHTML: { __html: this.state.value },
        onBlur: this._onBlur,
        onInput: this._onChange,
        onKeyDown: this._onKeyDown,
        onPaste: this._onPaste
      }));
    }
  }]);

  return ContentEditable;
}(_react.Component);

ContentEditable.propTypes = propTypes;
ContentEditable.defaultProps = defaultProps;

exports.default = ContentEditable;
