// search-params.spec.ts

import { SearchParams } from '../../../../src/domain/_shared/repository/search-params';

describe('SearchParams', () => {
  describe('page normalization', () => {
    it('should default page to 1 when undefined', () => {
      const params = new SearchParams({});
      expect(params.page).toBe(1);
    });

    it('should default page to 1 when NaN', () => {
      const params = new SearchParams({ page: 'abc' as any });
      expect(params.page).toBe(1);
    });

    it('should default page to 1 when <= 0', () => {
      const params = new SearchParams({ page: 0 });
      expect(params.page).toBe(1);
    });

    it('should default page to 1 when non-integer', () => {
      const params = new SearchParams({ page: 1.5 as any });
      expect(params.page).toBe(1);
    });

    it('should accept valid integer page', () => {
      const params = new SearchParams({ page: 5 });
      expect(params.page).toBe(5);
    });
  });

  describe('per_page normalization', () => {
    it('should default per_page to 15 when undefined', () => {
      const params = new SearchParams({});
      expect(params.per_page).toBe(15);
    });

    it('should default per_page to 15 when true', () => {
      const params = new SearchParams({ per_page: true as any });
      expect(params.per_page).toBe(15);
    });

    it('should default per_page to 15 when NaN', () => {
      const params = new SearchParams({ per_page: 'abc' as any });
      expect(params.per_page).toBe(15);
    });

    it('should default per_page to 15 when <= 0', () => {
      const params = new SearchParams({ per_page: 0 });
      expect(params.per_page).toBe(15);
    });

    it('should default per_page to 15 when non-integer', () => {
      const params = new SearchParams({ per_page: 2.5 as any });
      expect(params.per_page).toBe(15);
    });

    it('should accept valid integer per_page', () => {
      const params = new SearchParams({ per_page: 20 });
      expect(params.per_page).toBe(20);
    });
  });

  describe('sort & sort_dir normalization', () => {
    it('should set sort to null when undefined', () => {
      const params = new SearchParams({});
      expect(params.sort).toBeNull();
      expect(params.sort_dir).toBeNull();
    });

    it('should set sort to null when empty string', () => {
      const params = new SearchParams({ sort: '' });
      expect(params.sort).toBeNull();
      expect(params.sort_dir).toBeNull();
    });

    it('should default sort_dir to asc when invalid', () => {
      const params = new SearchParams({
        sort: 'name',
        sort_dir: 'invalid' as any,
      });
      expect(params.sort_dir).toBe('asc');
    });

    it('should set sort_dir to asc when explicitly asc', () => {
      const params = new SearchParams({ sort: 'name', sort_dir: 'asc' });
      expect(params.sort_dir).toBe('asc');
    });

    it('should set sort_dir to desc when explicitly desc', () => {
      const params = new SearchParams({ sort: 'name', sort_dir: 'desc' });
      expect(params.sort_dir).toBe('desc');
    });

    it('should normalize sort to string when provided', () => {
      const params = new SearchParams({ sort: 123 as any });
      expect(params.sort).toBe('123');
    });
  });

  describe('filter normalization', () => {
    it('should set filter to null when undefined', () => {
      const params = new SearchParams({});
      expect(params.filter).toBeNull();
    });

    it('should set filter to null when null', () => {
      const params = new SearchParams({ filter: null });
      expect(params.filter).toBeNull();
    });

    it('should set filter to null when empty string', () => {
      const params = new SearchParams({ filter: '' });
      expect(params.filter).toBeNull();
    });

    it('should normalize filter to string when provided', () => {
      const params = new SearchParams({ filter: 123 as any });
      expect(params.filter).toBe('123');
    });
  });

  describe('with()', () => {
    it('should clone with updated values', () => {
      const original = new SearchParams({
        page: 1,
        per_page: 10,
        sort: 'name',
        sort_dir: 'desc',
        filter: 'filter1',
      });
      const updated = original.with({ page: 2, filter: 'filter2' });

      expect(updated.page).toBe(2);
      expect(updated.per_page).toBe(10);
      expect(updated.sort).toBe('name');
      expect(updated.sort_dir).toBe('desc');
      expect(updated.filter).toBe('filter2');
    });

    it('should preserve values when no changes provided', () => {
      const original = new SearchParams({
        page: 3,
        per_page: 25,
        sort: 'id',
        sort_dir: 'asc',
        filter: 'f1',
      });
      const updated = original.with({});

      expect(updated.page).toBe(3);
      expect(updated.per_page).toBe(25);
      expect(updated.sort).toBe('id');
      expect(updated.sort_dir).toBe('asc');
      expect(updated.filter).toBe('f1');
    });
  });

  describe('additional edge cases', () => {
    it('should default page to 1 when page is null', () => {
      const params = new SearchParams({ page: null as any });
      expect(params.page).toBe(1);
    });

    it('should default per_page to 15 when per_page is null', () => {
      const params = new SearchParams({ per_page: null as any });
      expect(params.per_page).toBe(15);
    });

    it('should set sort_dir to asc when sort_dir is null and sort is set', () => {
      const params = new SearchParams({ sort: 'name', sort_dir: null });
      expect(params.sort_dir).toBe('asc');
    });

    it('should set sort_dir to asc when sort_dir is undefined and sort is set', () => {
      const params = new SearchParams({ sort: 'name' });
      expect(params.sort_dir).toBe('asc');
    });

    it('should set filter to null when filter is undefined', () => {
      const params = new SearchParams({ filter: undefined });
      expect(params.filter).toBeNull();
    });
  });

  describe('more edge cases for page and per_page', () => {
    it('should default page to 1 when page is false', () => {
      const params = new SearchParams({ page: false as any });
      expect(params.page).toBe(1);
    });

    it('should default page to 1 when page is empty string', () => {
      const params = new SearchParams({ page: '' as any });
      expect(params.page).toBe(1);
    });

    it('should default per_page to 15 when per_page is false', () => {
      const params = new SearchParams({ per_page: false as any });
      expect(params.per_page).toBe(15);
    });

    it('should default per_page to 15 when per_page is empty string', () => {
      const params = new SearchParams({ per_page: '' as any });
      expect(params.per_page).toBe(15);
    });
  });
});
