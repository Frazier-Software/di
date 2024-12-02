# Singletons

## About

Singleton functionality only applies to Providers configured via `useClass`.

## Configuration

There are two ways to mark a class as a Singleton: in a Provider config, with
the `@Singleton()` decorator.

### Provider Config

```ts
const app = create(AppClass, [
  {
    tag: LoggerService,
    useClass: ConsoleLogger,
    singleton: true,
  },
]);
```

### Decorator

```ts
@Singleton()
class ConsoleLogger() {
  // ...
}
```

The `@Singleton()` decorator supports Provider Hints in the same way as `@Injectable()`.
See the [Provider Hints](/docs/provider-hints.md) docs for more info.

## Singleton Scope

Classes that are marked as singletons are cached for the current invocation of `create()`.
Repeated invocations will result in new instances, aka Singletons are unique per invocation.

```ts
interface Logger {
  log(msg: string): void;
}

@Singleton()
class ConsoleLogger implements Logger {
  log(msg: string): void {
    console.log(msg);
  }
}

@Injectable()
class DatabaseService {
  constructor(@Inject('LOG') public logger: Logger) {}
}

@Injectable()
class App {
  constructor(
    @Inject('LOG') public logger: Logger,
    public db: DatabaseService,
  ) {}
}

const app1 = create(App, [
  { tag: 'LOG', useClass: ConsoleLogger, singleton: true },
]);

const app2 = create(App, [
  { tag: 'LOG', useClass: ConsoleLogger, singleton: true },
]);

console.assert(app1.logger === app1.db.logger);
console.assert(app2.logger === app2.db.logger);
console.assert(app1.logger !== app2.logger);
```

## Next

For a unique instance across repeated invocations of `create()`, check out
[Global Singletons](/docs/global-singletons.md) next.
