import { Sequelize } from 'sequelize';
import type { IUnitOfWork } from '../../../domain/_shared/repository/unit-of-work.interface';
import { SequelizeTransactionAdapter } from './sequelize-transaction-adapter';
import type { ITransaction } from '../../../domain/_shared/repository/transaction.interface';

export class UnitOfWorkSequelize implements IUnitOfWork {
  private transactionAdapter: SequelizeTransactionAdapter | null = null;
  constructor(private sequelize: Sequelize) {}

  async start(): Promise<void> {
    if (!this.transactionAdapter) {
      const transaction = await this.sequelize.transaction();
      this.transactionAdapter = new SequelizeTransactionAdapter(transaction);
    }
  }
  async commit(): Promise<void> {
    if (!this.transactionAdapter) throw new Error('No transaction started');
    await this.transactionAdapter.commit();
    this.transactionAdapter = null;
  }

  async rollback(): Promise<void> {
    if (!this.transactionAdapter) throw new Error('No transaction started');
    await this.transactionAdapter.rollback();
    this.transactionAdapter = null;
  }

  getTransaction(): ITransaction | null {
    return this.transactionAdapter;
  }

  async do<T>(workFn: (uow: IUnitOfWork) => Promise<T>): Promise<T> {
    let isAutoTransaction = false;
    try {
      if (this.transactionAdapter) {
        const result = await workFn(this);
        this.transactionAdapter = null;
        return result;
      }

      return await this.sequelize.transaction(async (t) => {
        isAutoTransaction = true;
        this.transactionAdapter = new SequelizeTransactionAdapter(t);
        const result = await workFn(this);
        this.transactionAdapter = null;
        return result;
      });
    } catch (e) {
      if (!isAutoTransaction) {
        this.transactionAdapter?.rollback();
      }
      this.transactionAdapter = null;
      throw e;
    }
  }
}
