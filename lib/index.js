'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ContentEditable = function (_Component) {
  _inherits(ContentEditable, _Component);

  function ContentEditable() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ContentEditable);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ContentEditable.__proto__ || Object.getPrototypeOf(ContentEditable)).call.apply(_ref, [this].concat(args))), _this), _this._onChange = function (ev) {
      var method = _this.getInnerMethod();
      var value = _this.refs.element[method];

      _this.props.onChange(ev, value);
    }, _this._onPaste = function (ev) {
      var _this$props = _this.props,
          maxLength = _this$props.maxLength,
          mode = _this$props.mode;


      if (mode === 'plaintext') {
        ev.preventDefault();
        var text = ev.clipboardData.getData('text').substr(0, maxLength);
        document.execCommand('insertText', false, text);
      }
    }, _this._onBlur = function (ev) {
      _this.props.onChange(ev, _this.sanatisedValue());
    }, _this._onKeyDown = function (ev) {
      var _this$props2 = _this.props,
          maxLength = _this$props2.maxLength,
          multiLine = _this$props2.multiLine;

      var method = _this.getInnerMethod();
      var value = _this.refs.element[method];

      // return key
      if (!multiLine && ev.keyCode === 13) {
        ev.preventDefault();
        ev.currentTarget.blur();
      }

      // Ensure we don't exceed `maxLength` (keycode 8 === backspace)
      if (maxLength && !ev.metaKey && ev.which !== 8 && value.replace(/\s\s/g, ' ').length >= maxLength) {
        ev.preventDefault();
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ContentEditable, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      var method = this.getInnerMethod();
      return nextProps.content !== this.refs.element[method];
    }
  }, {
    key: 'getInnerMethod',
    value: function getInnerMethod() {
      return this.props.mode === 'plaintext' ? 'innerText' : 'innerHTML';
    }
  }, {
    key: 'sanatisedValue',
    value: function sanatisedValue() {
      var _props = this.props,
          maxLength = _props.maxLength,
          multiLine = _props.multiLine;


      var method = this.getInnerMethod();
      var value = this.refs.element[method].replace(/&nbsp;/g, ' '); // replace encoded spaces

      if (multiLine) {
        value = value.replace(/[\t\v\f\r \u00a0\u2000-\u200b\u2028-\u2029\u3000]+/g, ' '); // replace any 2+ character whitespace (other than new lines) with a single space
      } else {
        value = value.replace(/\s+/g, ' ');
      }

      return value.split('\n').map(function (line) {
        return line.trim();
      }).join('\n').replace(/\n{3,}/g, '\n\n') // replace 3+ linebreaks with two
      .trim().substr(0, maxLength);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          Element = _props2.tagName,
          content = _props2.content,
          editable = _props2.editable,
          props = _objectWithoutProperties(_props2, ['tagName', 'content', 'editable']);

      return _react2.default.createElement(Element, _extends({}, props, {
        ref: 'element',
        style: _extends({ whiteSpace: 'pre-wrap' }, props.style),
        contentEditable: editable,
        dangerouslySetInnerHTML: { __html: content.replace(/[\t\v\f\r \u00a0\u2000-\u200b\u2028-\u2029\u3000]{2}/g, ' &nbsp;') },
        onBlur: this._onBlur,
        onInput: this._onChange,
        onKeyDown: this._onKeyDown,
        onPaste: this._onPaste
      }));
    }
  }]);

  return ContentEditable;
}(_react.Component);

ContentEditable.propTypes = {
  content: _propTypes2.default.string,
  editable: _propTypes2.default.bool,
  maxLength: _propTypes2.default.number,
  mode: _propTypes2.default.oneOf(['plaintext', 'html']),
  multiLine: _propTypes2.default.bool,
  onChange: _propTypes2.default.func,
  tagName: _propTypes2.default.string
};
ContentEditable.defaultProps = {
  editable: true,
  maxLength: Infinity,
  mode: 'plaintext',
  multiLine: false,
  tagName: 'div'
};
exports.default = ContentEditable;
