import { expect, test } from '@jest/globals';
import { create, Inject, Injectable } from '../src';
import { InvalidProvider, UnknownProvider } from '../src/errors';

// resources
// --------------------------------------------------

class DepA {}

@Injectable()
class HostA {
  @Inject('TEST1') test1!: number;

  @Inject('TEST2') test2!: number;

  @Inject(DepA) depA!: DepA;
}

// tests
// --------------------------------------------------

test('Property Injection', () => {
  const test = create(HostA, [
    { tag: 'TEST1', useValue: 15 },
    { tag: 'TEST2', useFunc: () => 17 },
  ]);
  expect(test.test1).toStrictEqual(15);
  expect(test.test2).toStrictEqual(17);
  expect(test.depA instanceof DepA).toBe(true);
});

test('Property Injection Errors', () => {
  const test1 = () => {
    create(HostA, [{ tag: 'TEST1', useValue: 15 }]);
  };
  expect(test1).toThrowError(UnknownProvider);

  const test2 = () => {
    create(HostA, [{ tag: 'TEST1' }]);
  };
  expect(test2).toThrowError(InvalidProvider);
});
