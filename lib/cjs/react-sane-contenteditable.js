"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var reduceTargetKeys = function reduceTargetKeys(target, keys, predicate) {
  return Object.keys(target).reduce(predicate, {});
};

var omit = function omit() {
  var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return reduceTargetKeys(target, keys, function (acc, key) {
    return keys.some(function (omitKey) {
      return omitKey === key;
    }) ? acc : _objectSpread({}, acc, _defineProperty({}, key, target[key]));
  });
};

var pick = function pick() {
  var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return reduceTargetKeys(target, keys, function (acc, key) {
    return keys.some(function (pickKey) {
      return pickKey === key;
    }) ? _objectSpread({}, acc, _defineProperty({}, key, target[key])) : acc;
  });
};

var isEqual = function isEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
};

var propTypes = {
  content: _propTypes2.default.string,
  editable: _propTypes2.default.bool,
  focus: _propTypes2.default.bool,
  maxLength: _propTypes2.default.number,
  multiLine: _propTypes2.default.bool,
  sanitise: _propTypes2.default.bool,
  caretPosition: _propTypes2.default.oneOf(['start', 'end']),
  tagName: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]),
  // The element to make contenteditable. Takes an element string ('div', 'span', 'h1') or a styled component
  innerRef: _propTypes2.default.func,
  onBlur: _propTypes2.default.func,
  onKeyDown: _propTypes2.default.func,
  onPaste: _propTypes2.default.func,
  onChange: _propTypes2.default.func,
  styled: _propTypes2.default.bool // If element is a styled component (uses innerRef instead of ref)

};
var defaultProps = {
  content: '',
  editable: true,
  focus: false,
  maxLength: Infinity,
  multiLine: false,
  sanitise: true,
  caretPosition: null,
  tagName: 'div',
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

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ContentEditable).call(this));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "setFocus", function () {
      if (_this.props.focus && _this._element) {
        _this._element.focus();
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "setCaret", function () {
      var caretPosition = _this.props.caretPosition;

      if (caretPosition && _this._element) {
        var value = _this.state.value;
        var offset = value.length && caretPosition === 'end' ? 1 : 0;
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
      var text = ev.clipboardData.getData('text').substr(0, maxLength);
      document.execCommand('insertText', false, text);

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


      if (maxLength && !ev.metaKey && ev.which !== 8 && value.replace(/\s\s/g, ' ').length >= maxLength) {
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
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.content !== this.sanitiseValue(this.state.value)) {
        this.setState({
          value: nextProps.content
        });
      }
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      var propKeys = Object.keys(nextProps).filter(function (key) {
        return key !== 'content';
      });
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


      var value = val.replace(/&nbsp;/, ' ').replace(/[\u00a0\u2000-\u200b\u2028-\u2029\u202e-\u202f\u3000]/g, ' ');

      if (multiLine) {
        // replace any 2+ character whitespace (other than new lines) with a single space
        value = value.replace(/[\t\v\f\r ]+/g, ' ');
      } else {
        value = value.replace(/\s+/g, ' ');
      }

      return value.split('\n').map(function (line) {
        return line.trim();
      }).join('\n').replace(/\n{3,}/g, '\n\n') // replace 3+ line breaks with two
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

      return _react2.default.createElement(Element, _extends({}, omit(props, Object.keys(propTypes)), styled ? {
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
          whiteSpace: 'pre-wrap'
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
}(_react.Component);

ContentEditable.defaultProps = defaultProps;
exports.default = ContentEditable;