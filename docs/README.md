# Getting Started

## Prerequisites

**@fraziersoft/di** requires reflection support via the `reflect-metadata` package. If you
haven't already, add it to your repository and then import it in your application or library's
entry point.

```shell
npm install -D reflect-metadata
```

You will also need to enable decorator support in your project's `tsconfig.json` file.

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## Autowiring

**@fraziersoft/di** supports autowiring of dependencies by default. For most basic use cases
you just define your classes, annotate with `@Injectable()`, and instantiate with `create()`.

```ts
import 'reflect-metadata';
import { create, Injectable } from '@fraziersoft/di';

class LoggingService {
  log(msg: string) {
    console.log(msg);
  }
}

@Injectable()
class DatabaseService {
  constructor(public logger: LoggingService) {}

  doStuff() {
    this.logger.log('Hello from the Database Service');
  }
}

@Injectable()
class ApplicationService {
  constructor(
    public logger: LoggingService,
    public db: DatabaseService,
  ) {}

  doStuff() {
    this.logger.log('Hello from the Application Service');
    this.db.doStuff();
  }
}

const app = create(ApplicationService);
app.doStuff();
```

## Disabling Autowiring

You can disable the autowiring behavior by passing `false` as the second argument to `create()`.

If you disable autowiring you must specify every Provider required by your system explicitly. Check
out the [next section](/docs/tags-providers.md) for more information.

```ts
const app = create(ApplicationService, false, [
  LoggingService,
  DatabaseService,
]);

app.doStuff();
```

## Next

For more advanced uses, check out the documentation on [Tags and Providers](/docs/tags-providers.md).
