import 'reflect-metadata';
import { meta } from './internal/meta';
import { ProviderConfig, Tag } from './types';

export function Injectable(hints?: ProviderConfig) {
  return function (target: Object) {
    if (hints) {
      Reflect.defineMetadata(meta.hints, hints, target);
    }
  };
}

export function Singleton(hints?: ProviderConfig) {
  return function (target: Object) {
    Reflect.defineMetadata(meta.singleton, true, target);
    if (hints) {
      Reflect.defineMetadata(meta.hints, hints, target);
    }
  };
}

export function Global(hints?: ProviderConfig) {
  return function (target: Object) {
    Reflect.defineMetadata(meta.global, true, target);
    if (hints) {
      Reflect.defineMetadata(meta.hints, hints, target);
    }
  };
}

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
