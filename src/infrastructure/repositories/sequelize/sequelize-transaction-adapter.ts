import type { Transaction } from 'sequelize';
import type { ITransaction } from '../../../domain/_shared/repository/transaction.interface';

export class SequelizeTransactionAdapter implements ITransaction {
  constructor(private readonly transaction: Transaction) {}

  commit(): Promise<void> {
    return this.transaction.commit();
  }

  rollback(): Promise<void> {
    return this.transaction.rollback();
  }

  // If needed, expose the original transaction for low-level usage
  getRawTransaction(): Transaction {
    return this.transaction;
  }
}
