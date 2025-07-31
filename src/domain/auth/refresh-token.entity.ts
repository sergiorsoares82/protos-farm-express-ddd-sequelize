import z from 'zod';
import { Entity } from '../_shared/entity';
import type { ValueObject } from '../_shared/value-object';
import type { Uuid } from '../_shared/value-objects/uuid.vo';
import { RefreshTokenValidatorFactory } from './refresh-token.validator';

type RefreshTokenConstructorProps = {
  token_id: Uuid;
  user_id: Uuid;
  token_hash: string;
  expires_at: Date;
  created_at?: Date;
};

export const RefreshTokenConstructorSchema = z.object({
  token_id: z.string().uuid(),
  user_id: z.string().uuid(),
  token_hash: z.string(),
  expires_at: z.date(),
  created_at: z.date(),
});

export class RefreshTokenEntity extends Entity {
  public readonly token_id: Uuid;
  public readonly user_id: Uuid;
  public readonly token_hash: string;
  public readonly expires_at: Date;
  public readonly created_at: Date;
  constructor({
    token_id,
    user_id,
    token_hash,
    expires_at,
    created_at = new Date(),
  }: RefreshTokenConstructorProps) {
    super();
    this.token_id = token_id;
    this.user_id = user_id;
    this.token_hash = token_hash;
    this.expires_at = expires_at;
    this.created_at = created_at;
  }

  get entity_id(): ValueObject {
    return this.token_id;
  }

  toJSON(): unknown {
    return {
      token_id: this.token_id,
      user_id: this.user_id,
      token_hash: this.token_hash,
      expires_at: this.expires_at,
      created_at: this.created_at,
    };
  }

  isExpired(): boolean {
    return this.expires_at.getTime() < Date.now();
  }

  static validate(refreshToken: RefreshTokenEntity): boolean {
    const validator = RefreshTokenValidatorFactory.create();
    // const notification = new Notification();
    return validator.validate(refreshToken.notification, refreshToken);
  }
}
