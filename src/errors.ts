import { Tag } from './types';

export class UnknownProvider extends Error {
  constructor(tag: Tag) {
    super(`[DI] unknown provider: ${String(tag)}`);
    this.name = 'UnknownProvider';
  }
}

export class InvalidProvider extends Error {
  constructor(tag: Tag) {
    super(`[DI] invalid provider: ${String(tag)}`);
    this.name = 'UnknownProvider';
  }
}
