import {
  PaginationPresenter,
  PaginationPresenterProps,
} from './pagination.presenter';

export class CollectionPresenter {
  protected pagination: PaginationPresenter;

  constructor(props: PaginationPresenterProps) {
    this.pagination = new PaginationPresenter(props);
  }

  toJSON() {
    return {
      meta: this.pagination.toJSON(),
    };
  }
}
