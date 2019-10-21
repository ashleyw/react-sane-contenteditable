"use strict";

var _storybookState = require("@sambego/storybook-state");

var _addonActions = require("@storybook/addon-actions");

var _react = require("@storybook/react");

var _react2 = require("react");

var _react3 = _interopRequireDefault(_react2);

var _reactSaneContenteditable = require("../react-sane-contenteditable");

var _reactSaneContenteditable2 = _interopRequireDefault(_reactSaneContenteditable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stories = (0, _react.storiesOf)('ContentEditable', module).addParameters({
  docs: null
});
var store = new _storybookState.Store({
  content: ''
});
stories.add('basic example', function () {
  return _react3.default.createElement(_storybookState.State, {
    store: store
  }, function (state) {
    return _react3.default.createElement(_reactSaneContenteditable2.default, {
      tagName: "h1",
      className: "my-class",
      content: state.content,
      editable: true,
      focus: true,
      maxLength: 140,
      multiLine: true,
      onChange: function onChange(content) {
        return store.set({
          content: content
        });
      },
      onBlur: (0, _addonActions.action)('onBlur', {
        depth: 1
      }),
      onFocus: (0, _addonActions.action)('onFocus', {
        depth: 1
      }),
      onKeyDown: (0, _addonActions.action)('onKeyDown', {
        depth: 1
      }),
      onKeyUp: (0, _addonActions.action)('onKeyUp', {
        depth: 1
      }),
      onPaste: (0, _addonActions.action)('onPaste', {
        depth: 1
      }),
      caretPosition: "end"
    });
  });
});