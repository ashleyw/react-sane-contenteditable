// SuT
import { isFunction, omit } from '../utils';

describe('isFunction', () => {
  it('returns true when value is a function', () => {
    expect(isFunction(jest.fn())).toEqual(true);
  });

  it('returns false when value is not a function', () => {
    expect(isFunction(undefined)).toEqual(false);
    expect(isFunction(null)).toEqual(false);
    expect(isFunction('')).toEqual(false);
    expect(isFunction(0)).toEqual(false);
    expect(isFunction([])).toEqual(false);
    expect(isFunction({})).toEqual(false);
  });
});

describe('omit', () => {
  it('returns object with omitted key/values', () => {
    const target = { foo: 'foo', bar: 'bar', baz: 'baz' };
    const keys = ['bar'];

    expect(omit(target, keys)).toEqual({ foo: 'foo', baz: 'baz' });
  });

  it('returns same object when omitted key are not present', () => {
    const target = { foo: 'foo', bar: 'bar', baz: 'baz' };
    const keys = ['qux'];

    expect(omit(target, keys)).toEqual(target);
  });

  it('returns same object when key argument is missing', () => {
    const target = { foo: 'foo', bar: 'bar', baz: 'baz' };

    expect(omit(target)).toEqual(target);
  });

  it('returns empty object literal when both arguments are missing', () => {
    expect(omit()).toEqual({});
  });
});
