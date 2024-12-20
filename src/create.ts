import 'reflect-metadata';
import { Container } from './container';
import { InvalidProvider, UnknownProvider } from './errors';
import { meta } from './internal/meta';
import {
  Constructor,
  isConstructor,
  Namespace,
  Provider,
  ProviderConfig,
  Tag,
} from './types';

const globalCache = new Map<Namespace, Map<Tag, unknown>>();

export function create<T>(target: Constructor<T>): T;
export function create<T>(target: Constructor<T>, providers: ProviderConfig): T;
export function create<T>(
  target: Constructor<T>,
  autowire: boolean,
  providers: ProviderConfig,
): T;

/**
 * Create a new instance of `target`. Autowire defaults to `true` if not specified.
 *
 * @param target Target class to instantiate.
 * @param autowire If true, will attempt to inject dependecies based on type definitions.
 * @param providers Optional provider configuration.
 * @returns Instantiated instance of `target` class.
 */
export function create<T>(
  target: Constructor<T>,
  autowire?: boolean | ProviderConfig,
  providers?: ProviderConfig,
): T {
  if (Array.isArray(autowire)) {
    providers = autowire;
    autowire = true;
  }
  return r_build(null, target, autowire ?? true, providers);
}

/**
 * Create a new instance of `target` using the "named parameter"
 * convention. Autowire defaults to `true` if not specified.
 *
 * @returns Instantiated instance of `target` class.
 */
export function build<T>(opts: {
  target: Constructor<T>;
  autowire?: boolean;
  providers?: ProviderConfig;
  namespace?: Namespace;
  global?: boolean;
}): T {
  return r_build(
    null,
    opts.target,
    opts.autowire ?? true,
    opts.providers,
    opts.namespace,
    false,
    opts.global,
  );
}

/**
 * Recursive Build (internal function)
 */
export function r_build<T>(
  cache: Map<Tag, unknown> | null,
  TargetClass: Constructor<T>,
  autowire?: boolean,
  providers?: ProviderConfig,
  namespace?: Namespace,
  singleton?: boolean,
  global?: boolean,
): T {
  // check for cache hit
  cache ??= new Map();
  const cached =
    globalCache.get(namespace)?.get(TargetClass) ?? cache.get(TargetClass);
  if (cached) {
    return cached as T;
  }

  // create provider lookup
  const providerMap = new Map<Tag, Provider>();
  const hints: ProviderConfig | undefined = Reflect.getOwnMetadata(
    meta.hints,
    TargetClass,
  );

  providers?.forEach(provider => {
    if (typeof provider === 'function') {
      providerMap.set(provider, { tag: provider, useClass: provider });
    } else {
      providerMap.set(provider.tag, provider);
    }
  });

  hints?.forEach(hint => {
    if (isConstructor(hint)) {
      if (!providerMap.has(hint)) {
        providerMap.set(hint, { tag: hint, useClass: hint });
      }
    } else if (!providerMap.has(hint.tag)) {
      providerMap.set(hint.tag, hint);
    }
  });

  // instantiate constructor parameters
  const tags: Map<number, Tag> | undefined = Reflect.getOwnMetadata(
    meta.tags,
    TargetClass,
  );
  const paramTypes: Constructor[] | undefined = Reflect.getMetadata(
    meta.paramtypes,
    TargetClass,
  );

  const params = paramTypes?.map((paramType, i) => {
    const tag = tags?.get(i) ?? paramType;
    const provider =
      providerMap.get(tag) ??
      (autowire && isConstructor(tag)
        ? { tag, useClass: tag as Constructor }
        : null);

    if (!provider) {
      throw new UnknownProvider(tag);
    } else if (provider.useValue !== undefined) {
      return provider.useValue;
    } else if (provider.useFunc !== undefined) {
      const ioc = Container.create({
        autowire,
        namespace,
        providers,
        sharedCache: cache,
      });
      return provider.useFunc.call(null, TargetClass, ioc);
    } else if (isConstructor(provider.useClass)) {
      return r_build(
        cache,
        provider.useClass,
        autowire,
        providers,
        namespace,
        provider.singleton,
        provider.global,
      );
    } else {
      throw new InvalidProvider(tag);
    }
  });

  // instantiate the target class
  const target = new TargetClass(...(params ?? []));

  // inject instance properties
  type Property = T[keyof T];
  const props: Map<keyof T, Tag> | undefined = Reflect.getMetadata(
    meta.props,
    TargetClass.prototype,
  );

  props?.forEach((tag, prop) => {
    const provider =
      providerMap.get(tag) ??
      (autowire && isConstructor(tag)
        ? { tag, useClass: tag as Constructor }
        : null);

    if (!provider) {
      throw new UnknownProvider(tag);
    } else if (provider.useValue !== undefined) {
      target[prop] = provider.useValue as Property;
    } else if (provider.useFunc !== undefined) {
      const ioc = Container.create({
        autowire,
        namespace,
        providers,
        sharedCache: cache,
      });
      target[prop] = provider.useFunc.call(null, tag, ioc) as Property;
    } else if (isConstructor(provider.useClass)) {
      target[prop] = r_build(
        cache,
        provider.useClass,
        autowire,
        providers,
        namespace,
        provider.singleton,
        provider.global,
      ) as Property;
    } else {
      throw new InvalidProvider(tag);
    }
  });

  // cache if singleton
  singleton ??= Reflect.getOwnMetadata(meta.singleton, TargetClass);
  global ??= Reflect.getOwnMetadata(meta.global, TargetClass);
  if (singleton === true) {
    cache.set(TargetClass, target);
  }
  if (global === true) {
    const cache = globalCache.get(namespace) ?? new Map();
    cache.set(TargetClass, target);
    globalCache.set(namespace, cache);
  }

  // return the instantiated instance
  return target;
}

/**
 * Clear the Global Singleton cache for a specific Namespace.
 *
 * @param namespace Namespace to clear. The default Namespace is
 *  assumed if no Namespace is provided.
 */
export function clearNamespace(namespace?: Namespace): void {
  globalCache.delete(namespace);
}

/**
 * Clear the Global Singleton cache for all Namespaces.
 */
export function clearAllNamespaces(): void {
  globalCache.clear();
}
