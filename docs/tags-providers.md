# Tags and Providers

## Tags

Every dependency is assigned a unique ID referred to as a Tag. In the code, Tags
are defined as:

```ts
// src/types.ts

type Tag<T = unknown> = Constructor<T> | string | symbol;
```

You can manually specify the Tag for a dependency using the `@Inject()` decorator.
If you do not specify the Tag, **@fraziersoft/di** will use the type definition as
the implied Tag. This only works correctly for concrete classes. If you are using an
interface type, Array, primitive, etc., then you must specify the Tag with `@Inject()`.

### Example

```ts
@Injectable()
class ExampleService {
  @Inject('DB') db: DatabaseService;

  constructor(@Inject('NAME') public name: string) {}
}
```

## Providers

Providers are configuration objects that define what Class, Value, or Function should
be evaluated when resolving a Tag. In the code, Providers are defined as:

```ts
// src/types.ts

type Provider<T = unknown> = {
  tag: Tag<T>;

  useValue?: T;
  useFunc?: (target?: T) => T;
  useClass?: Constructor<T>;

  singleton?: boolean;
  global?: boolean;
};
```

When defining a provider, specify only ONE of `useValue`, `useFunc`, or `useClass`. When
evaluating an instance, **@fraziersoft/di** checks for them in the order listed.

Providers can be specified when calling `create()`:

```ts
const app = create(ExampleService, [
  {
    tag: 'DB',
    useClass: DatabaseService,
  },
  {
    tag: 'NAME',
    useValue: 'Chris',
  },
]);
```

### Provider Shorthand

You can also specify a constructor function on its own in place of a Provider config.
This is treated as a shorthand for `{ tag: ctor, useClass: ctor }`.

```ts
const app = create(ExampleService, [DatabaseService, LoggerService]);

// is the same as...

const app = create(ExampleService, [
  {
    tag: DatabaseService,
    useClass: DatabaseService,
  },
  {
    tag: LoggerService,
    useClass: LoggerService,
  },
]);
```

You can mix and match the shorthand and longform version of the Provider configs.

```ts
// allowed
const app = create(ExampleService, [
  DatabaseService,
  {
    tag: 'NAME',
    useFunc: () => 'Chris',
  },
]);
```

## Next

Next up, learn about [Provider Hints](/docs/provider-hints.md).
