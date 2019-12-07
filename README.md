# Fetch Blog Posts

Built API that fetches data from fake `json-server` API.

## Routes

1. **/api/ping**
   - Returns success response upon "ping".
2. **/api/posts**
   - Accepts query parameters: `tags`, `sortBy`, and `direction`
   - Returns all blog posts that have at least one tag specified in the parameter

## To run app

First install dependencies:

```sh
npm install
```

Then start the `json-server`:

```sh
npm run json-server
```

Then start API server:

```sh
npm run server-dev
```

Finally, run sample test API requests:

```sh
npm test
```
