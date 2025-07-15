import { ValueObject } from '../../../src/domain/_shared/value-object';

class SimpleValueObject extends ValueObject {
  constructor(private readonly value: string) {
    super();
  }
}
class ComplexValueObject extends ValueObject {
  constructor(
    readonly prop1: string,
    readonly prop2: number,
  ) {
    super();
  }
}

describe('ValueObject Unit Tests', () => {
  it('should return true for equal value objects', () => {
    const vo1 = new SimpleValueObject('test');
    const vo2 = new SimpleValueObject('test');

    expect(vo1.equals(vo2)).toBe(true);
  });

  it('should return false for different value objects', () => {
    const vo1 = new SimpleValueObject('test1');
    const vo2 = new SimpleValueObject('test2');

    expect(vo1.equals(vo2)).toBe(false);
  });

  it('should return false for null or undefined comparison', () => {
    const vo = new SimpleValueObject('test');

    //@ts-expect-error // Testing with null
    expect(vo.equals(null)).toBe(false);
    //@ts-expect-error // Testing with undefined
    expect(vo.equals(undefined)).toBe(false);
  });

  it('should return false for different constructors', () => {
    const vo1 = new SimpleValueObject('test');
    const vo2 = new ComplexValueObject('test', 123);

    //@ts-expect-error // Testing with different constructor
    expect(vo1.equals(vo2)).toBe(false);
  });

  it('should handle complex value objects', () => {
    const vo1 = new ComplexValueObject('test', 123);
    const vo2 = new ComplexValueObject('test', 123);
    const vo3 = new ComplexValueObject('test', 456);

    expect(vo1.equals(vo2)).toBe(true);
    expect(vo1.equals(vo3)).toBe(false);
  });
});
