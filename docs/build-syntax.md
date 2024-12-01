# Build Syntax

## Named Arguments

If you prefer an API that uses "named arguments" instead of the traditional
positional arguments structure of `create()`, or you need to specify a custom
Namespace during instantiation, you want `build()`.

### Definition

```ts
// src/create.ts

function build<T>(opts: {
  target: Constructor<T>;
  autowire?: boolean;
  providers?: ProviderConfig;
  namespace?: Namespace;
  global?: boolean;
}): T;
```

### Example

```ts
import 'reflect-metadata';
import { build, Injectable } from '@fraziersoft/di';

class Ninja {
  attack() {
    console.log('The Ninja Attacks!');
  }
}

@Injectable()
class Game {
  constructor(public ninja: Ninja) {}

  play() {
    this.ninja.attack();
  }
}

const app = build({
  target: Game,
  namespace: 'Player 1',
  autowire: false,
  providers: [Ninja],
});
app.play();
```

## Next

Up next:

- Learn about the [IoC Container API](/docs/ioc-container.md)
- Head back to the [Project Homepage](https://github.com/Frazier-Software/di/).
