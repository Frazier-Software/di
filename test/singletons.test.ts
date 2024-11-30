import { expect, test } from '@jest/globals';
import {
  build,
  clearAllNamespaces,
  clearNamespace,
  create,
  Global,
  Inject,
  Injectable,
  Singleton,
} from '../src';

// resources
// --------------------------------------------------

const TEST_NUMBER = 37;

@Singleton()
class DepA {}

@Injectable()
class DepB {
  constructor(public depA: DepA) {}
}

@Injectable()
class HostA {
  constructor(
    public depA: DepA,
    public depB: DepB,
  ) {}
}

@Singleton([
  {
    tag: 'TEST',
    useValue: TEST_NUMBER,
  },
])
class HostB {
  constructor(@Inject('TEST') public dep: number) {}
}

@Global([
  {
    tag: 'TEST',
    useValue: TEST_NUMBER,
  },
])
class HostC {
  constructor(@Inject('TEST') public dep: number) {}
}

// tests
// --------------------------------------------------

test('Singleton', () => {
  const test1 = create(HostA);
  const test2 = create(HostA);

  // basic behavior
  expect(test1.depA).toBeDefined();
  expect(test1.depB).toBeDefined();
  expect(test1.depB.depA).toBeDefined();
  expect(Object.is(test1.depA, test1.depB.depA)).toBe(true);

  // scope
  expect(test2.depA).toBeDefined();
  expect(test2.depB.depA).toBeDefined();
  expect(Object.is(test2.depA, test2.depB.depA)).toBe(true);
  expect(Object.is(test2.depA, test1.depA)).toBe(false);
});

test('Global Singleton', () => {
  const test1 = create(HostA, [
    {
      tag: DepA,
      useClass: DepA,
      global: true,
    },
  ]);
  const test2 = create(HostA);

  // basic behavior
  expect(test1.depA).toBeDefined();
  expect(test1.depB).toBeDefined();
  expect(test1.depB.depA).toBeDefined();
  expect(Object.is(test1.depA, test1.depB.depA)).toBe(true);

  // scope
  expect(test2.depA).toBeDefined();
  expect(test2.depB.depA).toBeDefined();
  expect(Object.is(test2.depA, test2.depB.depA)).toBe(true);
  expect(Object.is(test2.depA, test1.depA)).toBe(true);
});

test('Clear Default Namespace', () => {
  const test1 = create(HostA, [
    {
      tag: DepA,
      useClass: DepA,
      global: true,
    },
  ]);
  clearNamespace();
  const test2 = create(HostA);

  // basic behavior
  expect(test1.depA).toBeDefined();
  expect(test1.depB).toBeDefined();
  expect(test1.depB.depA).toBeDefined();
  expect(Object.is(test1.depA, test1.depB.depA)).toBe(true);

  // scope
  expect(test2.depA).toBeDefined();
  expect(test2.depB.depA).toBeDefined();
  expect(Object.is(test2.depA, test2.depB.depA)).toBe(true);
  expect(Object.is(test2.depA, test1.depA)).toBe(false);
});

test('Custom Namespace', () => {
  const test1 = build({
    target: HostA,
    providers: [{ tag: DepA, useClass: DepA, global: true }],
    namespace: 'ABC',
  });
  const test2 = build({
    target: HostA,
    namespace: 'ABC',
  });

  // basic behavior
  expect(test1.depA).toBeDefined();
  expect(test1.depB).toBeDefined();
  expect(test1.depB.depA).toBeDefined();
  expect(Object.is(test1.depA, test1.depB.depA)).toBe(true);

  // scope
  expect(test2.depA).toBeDefined();
  expect(test2.depB.depA).toBeDefined();
  expect(Object.is(test2.depA, test2.depB.depA)).toBe(true);
  expect(Object.is(test2.depA, test1.depA)).toBe(true);
});

test('Clear Custom Namespace', () => {
  const test1 = build({
    target: HostA,
    providers: [{ tag: DepA, useClass: DepA, global: true }],
    namespace: 'ABC',
  });
  clearNamespace('ABC');
  const test2 = build({
    target: HostA,
    namespace: 'ABC',
  });

  // basic behavior
  expect(test1.depA).toBeDefined();
  expect(test1.depB).toBeDefined();
  expect(test1.depB.depA).toBeDefined();
  expect(Object.is(test1.depA, test1.depB.depA)).toBe(true);

  // scope
  expect(test2.depA).toBeDefined();
  expect(test2.depB.depA).toBeDefined();
  expect(Object.is(test2.depA, test2.depB.depA)).toBe(true);
  expect(Object.is(test2.depA, test1.depA)).toBe(false);
});

test('Clear All Namespaces', () => {
  const test1 = build({
    target: HostA,
    providers: [{ tag: DepA, useClass: DepA, global: true }],
    namespace: 'ABC',
  });
  clearAllNamespaces();
  const test2 = build({
    target: HostA,
    namespace: 'ABC',
  });

  // basic behavior
  expect(test1.depA).toBeDefined();
  expect(test1.depB).toBeDefined();
  expect(test1.depB.depA).toBeDefined();
  expect(Object.is(test1.depA, test1.depB.depA)).toBe(true);

  // scope
  expect(test2.depA).toBeDefined();
  expect(test2.depB.depA).toBeDefined();
  expect(Object.is(test2.depA, test2.depB.depA)).toBe(true);
  expect(Object.is(test2.depA, test1.depA)).toBe(false);
});

test('Singleton/Global Hints', () => {
  const test1 = create(HostB);
  const test2 = create(HostC);
  expect(test1.dep).toStrictEqual(TEST_NUMBER);
  expect(test2.dep).toStrictEqual(TEST_NUMBER);
});
