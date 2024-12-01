# Global Singletons

## Configuration

There are two ways to mark a class as a Global Singleton: in a Provider
config, with the `@Global()` decorator.

### Provider Config

```ts
const app = create(AppClass, [
  {
    tag: LoggerService,
    useClass: ConsoleLogger,
    global: true,
  },
]);
```

### Decorator

```ts
@Global()
class ConsoleLogger() {
  // ...
}
```

## Namespaces

Classes that are marked as global are cached across multiple calls to
`create()`. This global cache is referred to as a Namespace. In the code,
Namespaces are defined as:

```ts
// src/types.ts

type Namespace = string | symbol | undefined;
```

### Example

```ts
@Global()
class Logger {
  log(msg: string) {
    console.log(msg);
  }
}

@Injectable()
class App {
  constructor(public logger: Logger) {}
}

const app1 = create(App);
const app2 = create(App);

console.assert(app1.logger === app2.logger);
```

If you leave the Namespace as `undefined` the default global cache is
used. To specify a Namespace other than the default, you must use the
[build()](/docs/build-syntax.md) syntax instead of `create()`.

### Clearing a namespace

You can clear a Namespace by calling `clearNamespace()` or `clearAllNamespaces()`.

```ts
// ...

const app1 = create(App);
const app2 = create(App);
clearNamespace();
const app3 = create(App);

console.assert(app1.logger === app2.logger);
console.assert(app1.logger !== app3.logger);
console.assert(app2.logger !== app3.logger);
```

## Next

**@fraziersoft/di** also supports [Property Injection](/docs/property-injection.md).
