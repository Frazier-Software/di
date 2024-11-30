import { expect, test } from '@jest/globals';
import { create, Inject, Injectable } from '../src';
import { invalidProvider, unknownProvider } from '../src/internal/errors';

// resources
// --------------------------------------------------

class DepA {}

@Injectable()
class HostA {
  constructor(@Inject('TEST') public dep: DepA) {}
}

@Injectable()
class HostB {
  constructor(
    @Inject('TEST2') public dep2: DepA,
    @Inject('TEST3') public dep3: string,
  ) {}
}

// tests
// --------------------------------------------------

test('Manual Tags', () => {
  const test1 = () => {
    create(HostA);
  };
  expect(test1).toThrowError(unknownProvider('TEST'));

  const test2 = create(HostA, [{ tag: 'TEST', useClass: DepA }]);
  expect(test2.dep).toBeDefined();
});

test('Invalid Provider', () => {
  const test = () => {
    create(HostA, [{ tag: 'TEST' }]);
  };
  expect(test).toThrowError(invalidProvider('TEST'));
});

test('Mixed Providers', () => {
  const test = create(HostB, [
    {
      tag: 'TEST2',
      useClass: DepA,
    },
    {
      tag: 'TEST3',
      useFunc: () => 'TEST3',
    },
  ]);
  expect(test.dep2).toBeDefined();
  expect(test.dep3).toStrictEqual('TEST3');
});
