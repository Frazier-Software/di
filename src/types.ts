// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T = unknown> = new (...args: any[]) => T;

/**
 * Global singletons are stored in unique caches referred to as Namespaces.
 * The `undefined` namespsce represents the default Global Namespace.
 */
export type Namespace = string | symbol | undefined;

/**
 * Each dependency needs a unique ID referred to as a Tag.
 */
export type Tag<T = unknown> = Constructor<T> | string | symbol;

/**
 * Providers are configuration objects that connect Tags to a specific
 * class, function, or value. A provider should pick and define ONE of
 * the `useClass`, `useFunc`, or `useValue` properties.
 */
export type Provider<T = unknown> = {
  tag: Tag<T>;

  useValue?: T;
  useFunc?: (target?: T) => T;
  useClass?: Constructor<T>;

  singleton?: boolean;
  global?: boolean;
};

/**
 * ProviderConfig arrays can contain Providers or simple class Constructors.
 * You can mix and match both forms in the same array.
 *
 * Example: the array [ClassA, ClassB] is shorthand for
 *  [
 *    { tag: ClassA, useClass: ClassA },
 *    { tag: ClassB, useClass: ClassB },
 *  ]
 */
export type ProviderConfig = (Constructor | Provider)[];
