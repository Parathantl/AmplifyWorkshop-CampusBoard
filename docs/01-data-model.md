# Module 1 — Data model & live feed (20 min)

**Goal:** define a `Post` model. Amplify turns it into a GraphQL API on **AWS AppSync** backed by an
**Amazon DynamoDB** table, with a typed client and real-time subscriptions for free. Then swap the
local array in `App.tsx` for the cloud.

## 1.1 Define the model

Replace the contents of `amplify/data/resource.ts`:

```ts
import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Post: a.model({
    title: a.string().required(),
    body: a.string(),
    category: a.enum(['NOTICE', 'EVENT', 'LOST_FOUND', 'STUDY_GROUP']),
    link: a.url(),
    author: a.string(),
  }).authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: { expiresInDays: 30 },
  },
});
```

What to notice:

- `a.model(...)` = one DynamoDB table + GraphQL queries, mutations **and subscriptions**.
- `id`, `createdAt` and `updatedAt` are added for you.
- `a.enum([...])` becomes a GraphQL enum; the client only accepts those four values.
- `a.url()` is the AppSync `AWSURL` scalar: the API rejects `not a link`.
- `allow.publicApiKey()` means anyone with the API key can read **and write**. We tighten this in
  Module 3.

Save the file. The sandbox terminal detects the change and redeploys (1–2 minutes).

## 1.2 Use the generated types

In `src/types.ts`, replace the two hand-written types at the bottom with the ones Amplify generates
from your schema:

```ts
import type { Schema } from '../amplify/data/resource';

export const CATEGORIES = ['NOTICE', 'EVENT', 'LOST_FOUND', 'STUDY_GROUP'] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  NOTICE: 'Notice',
  EVENT: 'Event',
  LOST_FOUND: 'Lost & found',
  STUDY_GROUP: 'Study group',
};

export type Post = Schema['Post']['type'];
export type NewPost = Schema['Post']['createType'];
```

Nothing else in the app changes, yet the whole UI is now typed from the backend. Rename `title` in
`resource.ts` and `PostCard.tsx` stops compiling. That is the point of Gen 2.

## 1.3 Replace local state with the API

Replace the top of `src/App.tsx` (everything above `return`) with:

```tsx
import { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';
import './App.css';
import Header from './components/Header';
import PostForm from './components/PostForm';
import PostCard from './components/PostCard';
import type { NewPost, Post } from './types';

const client = generateClient<Schema>();

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // Query once, then keep receiving every create/update/delete over a WebSocket
    const subscription = client.models.Post.observeQuery().subscribe({
      next: ({ items }) =>
        setPosts([...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt))),
    });
    return () => subscription.unsubscribe();
  }, []);

  async function addPost(input: NewPost) {
    const { errors } = await client.models.Post.create(input);
    if (errors) alert(errors.map((e) => e.message).join('\n'));
  }

  async function deletePost(id: string) {
    const { errors } = await client.models.Post.delete({ id });
    if (errors) alert(errors.map((e) => e.message).join('\n'));
  }
```

Delete the `samplePosts` array. The JSX below `return` stays exactly as it was.

What to notice:

- `generateClient<Schema>()` gives you `client.models.Post` with `create`, `get`, `list`, `update`,
  `delete`, `onCreate`… all typed.
- `observeQuery()` runs the list query **and** subscribes to changes. When your neighbour posts, your
  `next` callback fires. No polling, no refresh button.
- Nothing in the `create` call says which table, endpoint, or auth header to use. `amplify_outputs.json`
  did that in Module 0.

## 1.4 Try it

With the sandbox showing `Watching for file changes...` and `npm run dev` running:

1. Post something. It appears at the top. Refresh: still there. It is in DynamoDB.
2. Open the site in a second browser window. Post from one; watch the other update.
3. Look at the projector. Every post in the room lands there live.
4. **DynamoDB console** → *Tables* → `Post-…` → *Explore items*: your posts as rows.
5. **AppSync console** → your API → *Queries*: run `listPosts { items { title author } }`.

## 1.5 Commit

```bash
git add .
git commit -m "Add Post model and connect the board to the API"
```

**Checkpoint:** `git checkout checkpoint/01-data-model`

Next: [Module 2 — Authentication](02-auth.md)
