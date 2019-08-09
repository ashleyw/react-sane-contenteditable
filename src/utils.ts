function reduceTargetKeys(target: object = {}, predicate: (acc: object, val: any) => object) {
  return Object.keys(target).reduce(predicate, {});
}

export function omit<T extends {}>(target: T, keys: string[] = []): Partial<T> {
  return reduceTargetKeys(target, (acc, key) => {
    if (keys.some(omitKey => omitKey === key)) {
      return acc;
    } else {
      return { ...acc, [key]: target[key] };
    }
  });
}

export function isFunction(fn: any) {
  return Object.prototype.toString.call(fn) === '[object Function]';
}
