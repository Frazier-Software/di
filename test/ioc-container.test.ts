import { expect, test } from '@jest/globals';
import { Container, Injectable } from '../src';

// resources
// --------------------------------------------------

class DepA {}

@Injectable()
class HostA {
  constructor(public dep: DepA) {}
}

// tests
// --------------------------------------------------

test('IoC Container', () => {
  const ioc = Container.create();
  const test = ioc.create(HostA);
  expect(test.dep instanceof DepA).toBe(true);
});

test('Manual IoC Container', () => {
  const ioc = Container.create({
    autowire: false,
    providers: [HostA, DepA],
  });
  const test = ioc.create(HostA);
  expect(test.dep instanceof DepA).toBe(true);
});

test('IoC Namespaces', () => {
  const c1 = Container.create();
  const c2 = Container.create();
  const c3 = Container.create({ namespace: 'TEST' });
  expect(c1.namespace).not.toBe(c2.namespace);
  expect(c3.namespace).toBe('TEST');
});

test('IoC Shared Cache', () => {
  const ioc = Container.create({
    sharedCache: true,
    providers: [{ tag: DepA, useClass: DepA, singleton: true }],
  });
  const test1 = ioc.create(HostA);
  const test2 = ioc.create(HostA);
  expect(test1.dep).toBe(test2.dep);
});

test('Manual IoC Shared Cache', () => {
  const sharedCache = new Map();
  const ioc = Container.create({
    sharedCache,
    providers: [{ tag: DepA, useClass: DepA, singleton: true }],
  });
  const test1 = ioc.create(HostA);
  const test2 = ioc.create(HostA);
  expect(test1.dep).toBe(test2.dep);
});
