# express-boilerplate

## Features
* Express (with basic plugins and middlewares)
* Mongoose (MongoDB driver)
* JWT Auth (+ simple implementation)
* Logging (rotating-file-stream)
* ESLint (prettier plugin and config)
* Husky + lint-staged

## Scripts
* **dev**: Start in dev mode. Run nodemon watcher,
* **start**: Start production server instance

## How to use

1. Install dependencies

```bash
yarn
```

2. Run MongoDB server. Create `.env` file based on `.env.example`. Replace `DB_URL` value to needed.

```
DB_URL = mongodb://localhost:27017
```

3. Start server.

```bash
yarn dev
```
