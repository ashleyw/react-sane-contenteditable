import _Object$defineProperty from "@babel/runtime-corejs2/core-js/object/define-property";
import _Object$defineProperties from "@babel/runtime-corejs2/core-js/object/define-properties";
import _Object$getOwnPropertyDescriptors from "@babel/runtime-corejs2/core-js/object/get-own-property-descriptors";
import _Object$getOwnPropertyDescriptor from "@babel/runtime-corejs2/core-js/object/get-own-property-descriptor";
import _Object$getOwnPropertySymbols from "@babel/runtime-corejs2/core-js/object/get-own-property-symbols";
import _defineProperty from "@babel/runtime-corejs2/helpers/defineProperty";
import _Object$keys from "@babel/runtime-corejs2/core-js/object/keys";

function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (_Object$getOwnPropertyDescriptors) { _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } } return target; }

function reduceTargetKeys() {
  var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var predicate = arguments.length > 1 ? arguments[1] : undefined;
  return _Object$keys(target).reduce(predicate, {});
}

export function omit(target) {
  var keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return reduceTargetKeys(target, function (acc, key) {
    if (keys.some(function (omitKey) {
      return omitKey === key;
    })) {
      return acc;
    } else {
      return _objectSpread({}, acc, _defineProperty({}, key, target[key]));
    }
  });
}
export function isFunction(fn) {
  return Object.prototype.toString.call(fn) === '[object Function]';
}