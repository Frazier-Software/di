import { expect, test } from '@jest/globals';
import { create, Inject, Injectable } from '../src';

// resources
// --------------------------------------------------

const TEST_STRING = 'TEST_STRING';

class DepA {}

@Injectable([
  DepA,
  {
    tag: 'TEST',
    useValue: TEST_STRING,
  },
])
class HostA {
  constructor(
    public depA: DepA,
    @Inject('TEST') public depB: string,
  ) {}
}

// tests
// --------------------------------------------------

test('Provider Hints', () => {
  const test = create(HostA);
  expect(test.depA instanceof DepA).toBe(true);
  expect(test.depB).toStrictEqual(TEST_STRING);
});

test('Overriding Hints', () => {
  const test = create(HostA, [{ tag: 'TEST', useValue: 'abc123' }]);
  expect(test.depA instanceof DepA).toBe(true);
  expect(test.depB).toStrictEqual('abc123');
});
