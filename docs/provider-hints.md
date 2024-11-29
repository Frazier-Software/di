# Provider Hints

## About

You can specify a `ProviderConfig` when decorating a class with `@Injectable()`. This config
will be overriden by any Provider config supplied to `create()`. This allows for default values,
modular file structures, etc.

### For Defaults

```ts
@Injectable([
  {
    tag: 'NAME',
    useValue: 'World',
  },
])
class Greeter {
  constructor(@Inject('NAME') public name: string) {}

  sayHello() {
    console.log(`Hello ${this.name}`);
  }
}

const greet = create(Greeter);
greet.sayHello(); // Hello World
```

### Overriding Provider Hints

```ts
const greet = create(Greeter, [
  {
    tag: 'NAME',
    useValue: 'Chris',
  },
]);

greet.sayHello(); // Hello Chris
```

## Next

[Read about singletons next](/docs/singletons.md).
