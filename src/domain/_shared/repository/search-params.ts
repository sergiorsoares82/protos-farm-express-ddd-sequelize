import { ValueObject } from '../value-object';

export type SortDirection = 'asc' | 'desc';

export type SearchParamsConstructorProps<Filter = string> = {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: SortDirection | null;
  filter?: Filter | null;
};

export class SearchParams<Filter = string> extends ValueObject {
  readonly page: number;
  readonly per_page: number;
  readonly sort: string | null;
  readonly sort_dir: SortDirection | null;
  readonly filter: Filter | null;

  constructor(props: SearchParamsConstructorProps<Filter> = {}) {
    super();

    // Normalize page
    const _page = +props.page!;
    this.page =
      Number.isNaN(_page) || _page <= 0 || parseInt(_page as any) !== _page
        ? 1
        : _page;

    // Normalize per_page
    const _per_page = props.per_page === (true as any) ? 15 : +props.per_page!;
    this.per_page =
      Number.isNaN(_per_page) ||
      _per_page <= 0 ||
      parseInt(_per_page as any) !== _per_page
        ? 15
        : _per_page;

    // Normalize sort
    const _sort =
      props.sort === null || props.sort === undefined || props.sort === ''
        ? null
        : `${props.sort}`;
    this.sort = _sort;

    // Normalize sort_dir (only if sort exists)
    if (!_sort) {
      this.sort_dir = null;
    } else {
      const dir = `${props.sort_dir}`.toLowerCase();
      this.sort_dir =
        dir !== 'asc' && dir !== 'desc' ? 'asc' : (dir as SortDirection);
    }

    // Normalize filter
    this.filter =
      props.filter === null ||
      props.filter === undefined ||
      (props.filter as unknown) === ''
        ? null
        : (`${props.filter}` as any);
  }

  // Optional: Factory to clone with changes (like in FP)
  with(
    changes: Partial<SearchParamsConstructorProps<Filter>>,
  ): SearchParams<Filter> {
    return new SearchParams<Filter>({
      page: changes.page ?? this.page,
      per_page: changes.per_page ?? this.per_page,
      sort: changes.sort ?? this.sort,
      sort_dir: changes.sort_dir ?? this.sort_dir,
      filter: changes.filter ?? this.filter,
    });
  }
}
