import { Entity } from '../entity';
import { ValueObject } from '../value-object';

type SearchResultConstructorProps<E extends Entity> = {
  items: E[];
  total: number;
  current_page: number;
  per_page: number;
};

export class SearchResult<E extends Entity = Entity> extends ValueObject {
  readonly items: E[];
  readonly total: number;
  readonly current_page: number;
  readonly per_page: number;
  readonly last_page: number;

  constructor(props: SearchResultConstructorProps<E>) {
    super();

    const total = Math.max(0, props.total); // total cannot be negative
    const per_page = Math.max(1, props.per_page); // at least 1 item per page
    const last_page = Math.max(1, Math.ceil(total / per_page)); // at least 1 page

    let current_page = props.current_page;
    if (current_page < 1) current_page = 1;
    if (current_page > last_page) current_page = last_page;

    this.items = props.items;
    this.total = total;
    this.per_page = per_page;
    this.last_page = last_page;
    this.current_page = current_page;
  }

  toJSON(forceEntity = false) {
    return {
      items: forceEntity ? this.items.map((item) => item.toJSON()) : this.items,
      total: this.total,
      current_page: this.current_page,
      per_page: this.per_page,
      last_page: this.last_page,
    };
  }

  // Optional: quick factory for empty results
  static empty<E extends Entity>(per_page = 15): SearchResult<E> {
    return new SearchResult<E>({
      items: [],
      total: 0,
      current_page: 1,
      per_page,
    });
  }
}
