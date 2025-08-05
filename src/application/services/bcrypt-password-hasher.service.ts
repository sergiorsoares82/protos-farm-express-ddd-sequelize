import bcrypt from 'bcrypt';
import type { IPasswordHasher } from '../../domain/services/password-hasher.interface';

export class BcryptPasswordHasher implements IPasswordHasher {
  private readonly rounds: number = process.env.NODE_ENV === 'test' ? 1 : 10;
  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.rounds);
    return bcrypt.hash(password, salt);
  }
  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
