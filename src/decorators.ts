import 'reflect-metadata';
import { meta } from './internal/meta';
import { ProviderConfig, Tag } from './types';

/**
 * Mark class as Injectable and provide optional dependency hints.
 */
export function Injectable(hints?: ProviderConfig) {
  return function (target: Object) {
    if (hints) {
      Reflect.defineMetadata(meta.hints, hints, target);
    }
  };
}

/**
 * Mark class as a Singleton and provide optional dependency hints.
 */
export function Singleton(hints?: ProviderConfig) {
  return function (target: Object) {
    Reflect.defineMetadata(meta.singleton, true, target);
    if (hints) {
      Reflect.defineMetadata(meta.hints, hints, target);
    }
  };
}

/**
 * Mark class as a Global Singleton and provide optional dependency hints.
 */
export function Global(hints?: ProviderConfig) {
  return function (target: Object) {
    Reflect.defineMetadata(meta.global, true, target);
    if (hints) {
      Reflect.defineMetadata(meta.hints, hints, target);
    }
  };
}

/**
 * The Inject decorator allows you to specify explicit dependency tags
 * for constructor parameters and clsss properties.
 *
 * Autowired dependencies only work for class constructor properties with
 * type definitions of concrete classes. You must use the Inject decorator
 * with all class properties and any constructor parameters with Interface,
 * primitive, Array, etc., type definitions.
 */
export function Inject(tag: Tag) {
  return function (
    target: Object,
    propertyKey: string | symbol | undefined,
    parameterIndex?: number,
  ) {
    if (parameterIndex !== undefined) {
      // used as a parameter decorator
      const tags: Map<number, Tag> =
        Reflect.getOwnMetadata(meta.tags, target, propertyKey!) ?? new Map();
      tags.set(parameterIndex, tag);
      Reflect.defineMetadata(meta.tags, tags, target, propertyKey!);
    } else {
      // used as a property decorator
      const props: Map<typeof propertyKey, Tag> =
        Reflect.getMetadata(meta.props, target) ?? new Map();
      props.set(propertyKey, tag);
      Reflect.defineMetadata(meta.props, props, target);
    }
  };
}
