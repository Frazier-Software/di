import { expect, test } from '@jest/globals';
import { create, Injectable } from '../src';

// resources
// --------------------------------------------------

class DepA {}

@Injectable()
class HostA {
  constructor(public dep: DepA) {}
}

// tests
// --------------------------------------------------

test('Autowiring', () => {
  const test = create(HostA);
  expect(test.dep).toBeDefined();
});

test('Manual Wiring', () => {
  const test1 = () => {
    create(HostA, false, []);
  };
  expect(test1).toThrow();

  const test2 = create(HostA, false, [DepA]);
  expect(test2.dep).toBeDefined();
});
