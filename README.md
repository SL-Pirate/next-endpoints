# next-api-gen

## “Never write a fetch call again.”

Generate Next.js API routes and typed clients directly from your annotated classes. Define your business logic once, and
this tool takes care of the boilerplate: REST endpoints + fully typed client functions — no more repetitive fetch calls.

### ✨ Features

- Zero boilerplate: turn a TypeScript class into an API with one decorator.

- Automatic route generation: generates handlers under /app/api/generated/....

- Typed client generation: creates a lib/api-client with parameter and return types fully inferred.

- Type-safe methods: use the built-in ApiMethod<Args, Return> helper for clear contracts.

- Single source of truth: write your logic once, use it everywhere (backend & frontend).

### 📦 Installation

`npm install --save-dev next-api-gen`

- Or run directly with npx:

`npx next-api-gen generate`

### 🛠 Usage

1. Annotate your class

```typescript
import {ApiMethod, Endpoint} from "next-api-gen/types";

@Endpoint()
export class HomeEndpoint {
// ApiMethod<Args, ReturnType>
    getNames: ApiMethod<{}, Array<string>> = async (args, req) => {
        return ["Alice", "Bob", "Charlie"];
    };
}
```

2. Run the generator
   npx next-api-gen generate

This will create:

- API route handlers under /app/api/generated/HomeEndpoint/getNames/route.ts

- A typed client under /lib/api-client/HomeEndpoint.ts

3. Use the generated client

```typescript

import {HomeEndpointClient} from "@/lib/api-client/HomeEndpoint";

const names = await HomeEndpointClient.getNames({});
console.log(names); // ["Alice", "Bob", "Charlie"]
```

### ⚙️ Configuration

Add a next-api-gen section to your package.json (optional):

```json
{
  "next-api-gen": {
    "outDir": "lib/api-client"
  }
}
```

#### Defaults:

- API routes → /app/api/generated/...

- API clients → /lib/api-client

### 🧩 Roadmap

- Generate API routes for annotated classes

- Generate typed API clients

- Dedicated /app/api/generated folder for routes

- Support class methods in addition to arrow functions

- Smarter import handling

- Plugin system for customization

### 💡 Motivation

This project was inspired by the Vaadin Endpoint API
, which automatically generates typed clients from backend endpoints.

The idea is the same: write your server logic once, consume it with type safety on the client — no manual fetch needed.

Unlike Vaadin, this tool is:

Designed for Next.js 13+ with the /app router

Built entirely in TypeScript

Lightweight and framework-native — no extra runtime required

Flexible: you can still call your API routes directly if you want

The goal is to bring the same developer experience Vaadin provides, but in a modern, Next.js-friendly way.

### 📜 License

MIT
