<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<div align="center">
  <h1 align="center">@fraziersoft/di ☕️</h1>
  <p align="center">
    Lightweight dependency injection for TypeScript
    <br />
    <a href="https://github.com/Frazier-Software/di/blob/main/docs/getting-started.md"><strong>Explore the docs »</strong></a>
  </p>
</div>
<br />

<!-- BADGES -->

[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- ABOUT THE PROJECT -->

## About The Project

Automatic dependency injection for TypeScript projects. Supports advanced use cases through
easy, flexible configuration.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

Install the `reflect-metadata` and `@fraziersoft/di` packages.

- npm
  ```sh
  npm install -D reflect-metadata @fraziersoft/di
  ```
- yarn
  ```sh
  yarn add -D reflect-metadata @fraziersoft/di
  ```

Enable decorator support in your project's `tsconfig.json` file.

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### Example

```ts
import 'reflect-metadata';
import { create, Injectable } from '@fraziersoft/di';

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

const app = create(Game);
app.play();
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire,
and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request.
You can also simply open an issue with the tag "enhancement". Don't forget to give the project a star!
Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->

[issues-shield]: https://img.shields.io/github/issues/Frazier-Software/di.svg?style=for-the-badge
[issues-url]: https://github.com/Frazier-Software/di/issues
[license-shield]: https://img.shields.io/github/license/Frazier-Software/di.svg?style=for-the-badge
[license-url]: https://github.com/Frazier-Software/di/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/chrisfrazier0
