import type { IUnitOfWork } from '../../domain/_shared/repository/unit-of-work.interface';

export interface IUseCase<Input, Output> {
  execute(input: Input, uow?: IUnitOfWork): Promise<Output>;
}
