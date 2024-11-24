
# NestJS + NodeJS + TailwindCSS Starter

<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
  <a href="http://nodejs.org" target="blank">
    <img src="https://nodejs.org/static/logos/nodejsDark.svg" width="120" margin="100" alt="NodeJS Logo" />
  </a>

</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank">
    <img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" />
  </a>
</p>


## Pré-requis

- [Node.js](https://nodejs.org/en/download/) > 18.x
- [Cassandra](https://cassandra.apache.org/download/) > 3.x
- [NestJS](https://docs.nestjs.com/) > 8.x
- [TypeScript](https://www.typescriptlang.org/) > 4.x
## Description

NestJS framework TypeScript starter repository for an API that interacts with a Cassandra database. This project uses **Node.js** and **TailwindCSS** for modern, scalable, and responsive design.

## Project setup

Clone this repository and install the required dependencies.

```bash
$ npm install
```
ou 
```bash
$ yarn install
```

## Compile and run the project

To compile and run the project in different modes, use the following commands:

```bash
# development mode
$ npm run start or yarn start

# watch mode
$ npm run start:dev or yarn start:dev

# production mode
$ npm run start:prod or yarn start:prod
```

## Install TailwindCSS

If **TailwindCSS** is not installed in your project yet, follow these steps:

1. Install **TailwindCSS** via npm:

```bash
$ npm install -D tailwindcss postcss autoprefixer
$ npx tailwindcss init
```

2. Configure your `tailwind.config.js` file:

```js
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

3. Add the following TailwindCSS directives to your main `styles.css` or `styles.scss` file:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

4. Now you can run the application, and TailwindCSS will be integrated.

## Running the Application

To run the application in development mode:

```bash
# development mode
$ npm run start or yarn start
```

## Conclusion

This starter project sets up a simple API with **NestJS**, **Node.js**, and **TailwindCSS** for styling. You can easily extend this base for any API project that needs a robust backend and modern frontend styling.
