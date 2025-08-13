export interface ITransaction {
  commit(): Promise<void>;
  rollback(): Promise<void>;
}
