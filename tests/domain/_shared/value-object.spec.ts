import isEqual from 'lodash/isEqual';
import { ValueObject } from '../../../src/domain/_shared/value-object';

jest.mock('lodash/isEqual');
const mockedIsEqual = isEqual as jest.Mock;

class StubValueObject extends ValueObject {
  constructor(public value: any) {
    super();
  }
}

class OtherValueObject extends ValueObject {
  constructor(public value: any) {
    super();
  }
}

describe('ValueObject.equals', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('invalid inputs', () => {
    it('should return false when comparing with null or undefined', () => {
      const vo = new StubValueObject('test');
      expect(vo.equals(null as any)).toBe(false);
      expect(vo.equals(undefined as any)).toBe(false);
    });

    it('should return false when comparing with falsey but non-null values (e.g., 0, empty string)', () => {
      const vo = new StubValueObject('test');
      expect(vo.equals(0 as any)).toBe(false);
      expect(vo.equals('' as any)).toBe(false);
    });

    it('should return false when comparing with completely different object types', () => {
      const vo = new StubValueObject({ a: 1 });
      expect(vo.equals({} as any)).toBe(false);
      expect(vo.equals('string' as any)).toBe(false);
    });
  });

  it('should return false when constructor names differ', () => {
    const vo1 = new StubValueObject('test');
    const vo2 = new OtherValueObject('test');
    expect(vo1.equals(vo2 as any)).toBe(false);
  });

  describe('valid comparisons', () => {
    it('should delegate to lodash.isEqual when same class', () => {
      const vo1 = new StubValueObject({ a: 1 });
      const vo2 = new StubValueObject({ a: 1 });
      mockedIsEqual.mockReturnValue(true);
      expect(vo1.equals(vo2)).toBe(true);
      expect(mockedIsEqual).toHaveBeenCalledWith(vo2, vo1);
    });

    it('should return false if lodash.isEqual returns false', () => {
      const vo1 = new StubValueObject({ a: 1 });
      const vo2 = new StubValueObject({ a: 2 });
      mockedIsEqual.mockReturnValue(false);
      expect(vo1.equals(vo2)).toBe(false);
      expect(mockedIsEqual).toHaveBeenCalledWith(vo2, vo1);
    });

    it('should be symmetric when comparing equal objects', () => {
      const vo1 = new StubValueObject({ a: 1 });
      const vo2 = new StubValueObject({ a: 1 });
      mockedIsEqual.mockReturnValue(true);

      const res1 = vo1.equals(vo2);
      const res2 = vo2.equals(vo1);
      expect(res1).toBe(res2);
    });
  });
});
