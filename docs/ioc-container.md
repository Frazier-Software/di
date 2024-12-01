# IoC Container

## Container API

The IoC Container API encapsulates a common autowiring, namespace, and provider configuration.
If you need an idiomatic way to access different Namespaces, or want to simplify repeated calls
to `create()` or `build()`, then check out the IoC Container code.

### Example

```ts
class Logger {}

@Injectable()
class AppService {
  constructor(public log: Logger) {}
}

const ioc = Container.create({
  auotwire: false,
  providers: [Logger],
});

const app = ioc.create(AppService);
```

## Shared Cache

When creating an IoC Container you can specify a shared Singleton Cache. This allows you to wire
the Singleton Cache into any external process you need. With the shared Singleton Cache enabled
all classes annotated with `Singleton()` behave similar to global classes relative to the IoC
Container.

```ts
@Singleton()
class DatabaseService {}

@Injectable()
class AppService {
  constructor(public db: DatabaseService) {}
}

const ioc = Container.create({ sharedCache: true });
const app1 = ioc.create(AppService);
const app2 = ioc.create(AppService);

console.assert(app1.db === app2.db);
```

## Next

Head back to the [Project Homepage](https://github.com/Frazier-Software/di/).
