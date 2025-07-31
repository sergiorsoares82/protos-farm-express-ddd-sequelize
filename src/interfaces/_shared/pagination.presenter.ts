export type PaginationPresenterProps = {
  current_page: number;
  per_page: number;
  total: number;
  sort?: { field: string; direction: 'asc' | 'desc' } | null;
  filters?: Record<string, any> | null;
};

export class PaginationPresenter {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  sort: { field: string; direction: 'asc' | 'desc' } | null;
  filters: Record<string, any> | null;

  constructor({
    current_page,
    per_page,
    total,
    sort = null,
    filters = null,
  }: PaginationPresenterProps) {
    this.current_page = current_page;
    this.per_page = per_page;
    this.total = total;
    this.last_page = Math.ceil(total / per_page);
    this.sort = sort;
    this.filters = filters;
  }

  toJSON() {
    return {
      current_page: this.current_page,
      per_page: this.per_page,
      total: this.total,
      last_page: this.last_page,
      sort: this.sort,
      filters: this.filters,
    };
  }
}
