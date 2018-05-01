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
  babelHelpers.inherits(ContentEditable, _Component);

  function ContentEditable(props) {
    babelHelpers.classCallCheck(this, ContentEditable);

    var _this = babelHelpers.possibleConstructorReturn(this, (ContentEditable.__proto__ || Object.getPrototypeOf(ContentEditable)).call(this, props));

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

  babelHelpers.createClass(ContentEditable, [{
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
          props = babelHelpers.objectWithoutProperties(_props2, ["tagName", "content", "editable", "styled"]);


      return React.createElement(Element, babelHelpers.extends({}, omit(props, Object.keys(propTypes)), styled ? {
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
        style: babelHelpers.extends({ whiteSpace: "pre-wrap" }, props.style),
        contentEditable: editable,
        key: Date(),
        dangerouslySetInnerHTML: { __html: this.state.value },
        onBlur: this._onBlur,
        onInput: this._onChange,
        onKeyDown: this._onKeyDown,
        onPaste: this._onPaste
      }));
    }
  }]);
  return ContentEditable;
}(Component);

ContentEditable.propTypes = propTypes;
ContentEditable.defaultProps = defaultProps;

export default ContentEditable;
