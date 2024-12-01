import { r_build } from './create';
import { Constructor, Namespace, Provider, ProviderConfig, Tag } from './types';

type ReadonlyProviders = ReadonlyArray<Readonly<Provider> | Constructor>;
let containerIndex = 1;

export class Container {
  autowire: boolean;

  readonly namespace: Namespace;
  readonly providers?: ReadonlyProviders;

  #cache: Map<Tag, unknown> | null;

  private constructor(opts?: {
    autowire?: boolean;
    namespace?: Namespace;
    providers?: ProviderConfig;
    sharedCache?: boolean | Map<Tag, unknown>;
  }) {
    this.autowire = opts?.autowire ?? true;
    this.namespace =
      opts?.namespace ??
      Symbol.for('@fraziersoft/di:container_' + containerIndex++);
    this.providers = opts?.providers;
    this.#cache = opts?.sharedCache
      ? opts.sharedCache === true
        ? new Map()
        : opts.sharedCache
      : null;
  }

  static create(opts?: {
    autowire?: boolean;
    namespace?: Namespace;
    providers?: ProviderConfig;
    sharedCache?: boolean | Map<Tag, unknown>;
  }): Container {
    return new Container(opts);
  }

  create<T>(target: Constructor<T>): T {
    return r_build(
      this.#cache,
      target,
      this.autowire,
      this.providers as ProviderConfig,
      this.namespace,
    );
  }
}
