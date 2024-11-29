# Property Injection

## Property vs Constructor Injection

Constructor injection is preferred, but property injection is supported. Due to
how Javascript works, when using Property Injection, your dependencies will be
injected into the class instance **AFTER** instantiaton. This means values that
are injected via Property Injection will **NOT** be available in the class
constructor.

## How To

Property Injection requires annotation with the `@Inject()` decorator.

```ts
@Injectable()
class Example {
  @Inject('LOG')
  public logger!: ILogger;

  init() {
    // do setup here
    this.logger.log('ready!');
  }
}

const app = create(Example, [{ tag: 'LOG', useClass: ConsoleLogger }]);
app.init();
```

## Next

Learn about the alternate way of creating instances, [build()](/docs/build-syntax.md).
