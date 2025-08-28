# next-endpoints

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

`npm install --save-dev next-endpoints`

- Or run directly with npx:

`npx next-endpoints generate`

### 🛠 Usage

1. Annotate your class

```typescript
import {ApiMethod, Endpoint} from "next-endpoints/types";

@Endpoint()
export class HomeEndpoint {
// ApiMethod<Args, ReturnType>
    getNames: ApiMethod<{}, Array<string>> = async (args, req) => {
        return ["Alice", "Bob", "Charlie"];
    };
}
```

2. Run the generator
   npx next-endpoints generate

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

Add a next-endpoints section to your package.json (optional):

```json
{
  "next-endpoints": {
    "outDir": "lib/api-client"
  }
}
```

#### Defaults:

- API routes → /app/api/generated/...

- API clients → /lib/api-client

### ✨ Optional React Hook

For convenience, we provide a simple React hook useApiClient to wrap your API client calls with built-in loading, error,
and data state management.

```tsx
import {HomeEndpointClient} from "@/lib/api/generated/HomeEndpoint";
import {useApiClient} from "next-endpoints/hooks/use-api-client";

function NameListComponent() {
    const {data, error, loading} = useApiClient({
        call: HomeEndpointClient.getNames,
        args: {},
        deps: [],
        headers: {"hello-header": "hello-header-value"},
    });

    if (loading) return <p>Loading names...</p>;
    if (error) return <p>Error loading names: {error.message}</p>;
    if (!data) return <p>No names found.</p>;

    return (
        <div className="text-center sm:text-left">
            <h2 className="text-2xl font-semibold">Names from API:</h2>
            <ul className="mt-2 space-y-1">
                {data.map((name, index) => (
                    <li key={index} className="text-lg">
                        {name}
                    </li>
                ))}
            </ul>
        </div>
    );
}
```

> Note: This hook is optional and minimal. For more advanced features like caching or retries, consider integrating your
> API client with React Query
> or SWR
> .

### ⚠️ Disclaimer: Experimental Project

This library is in early preview (v0.x).
APIs, file layouts, and generated code are likely to change as the project evolves.

Expect breaking changes between minor versions.

Only arrow-function-style class properties are supported right now (not methods).

Import rewriting is basic and may not handle all edge cases.

Generated code is intended for exploration and prototyping, not production-critical use (yet).

👉 If you’re interested, please try it out, open issues, and share feedback! Early adopters will help shape the design.

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
