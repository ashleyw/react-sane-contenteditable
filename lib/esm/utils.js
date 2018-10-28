import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _objectSpread from "@babel/runtime/helpers/objectSpread";

var reduceTargetKeys = function reduceTargetKeys(target, keys, predicate) {
  return Object.keys(target).reduce(predicate, {});
};

export var omit = function omit() {
  var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return reduceTargetKeys(target, keys, function (acc, key) {
    return keys.some(function (omitKey) {
      return omitKey === key;
    }) ? acc : _objectSpread({}, acc, _defineProperty({}, key, target[key]));
  });
};
export var isFunction = function isFunction(fn) {
  return Object.prototype.toString.call(fn) === '[object Function]';
};