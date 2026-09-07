# Module 3 — Authorization & Admin (15 min)

**Goal:** lock the model down so anonymous users can only read, authors can only change their own
posts, and members of a Cognito `Admin` group can moderate anything. Then see the API enforce it.

## 3.1 Authorization rules on the model

In `amplify/data/resource.ts`, replace the `.authorization(...)` call:

```ts
  }).authorization((allow) => [
    allow.publicApiKey().to(['read']),   // anyone can read
    allow.owner(),                       // the author can update/delete their own post
    allow.group('Admin'),                // Admin group can do anything
  ]),
```

| Rule | Who | Can | Auth mode |
|---|---|---|---|
| `publicApiKey().to(['read'])` | Anyone | read (including subscriptions) | API key |
| `owner()` | The signed-in user who created the post | create, read, update, delete own | Cognito user pool |
| `group('Admin')` | Members of the `Admin` group | everything | Cognito user pool |

`allow.owner()` adds a hidden `owner` field to the table and fills it from the Cognito token on
`create`. Amplify compiles these rules into AppSync resolvers.

Save and wait for `[Sandbox] Watching for file changes...`.

## 3.2 Watch the API say no

Nothing in the React code changed. Sign in and try to **Delete** a post that someone else (or your
anonymous self from Module 1) created:

```
Not Authorized to access deletePost on type Mutation
```

The button was there, the request was well-formed, and AppSync refused it. Authorization is enforced
in the API, not in the UI. Now delete one of your own posts: it works.

## 3.3 Create the Admin group with CDK

Replace `amplify/backend.ts`:

```ts
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';

const backend = defineBackend({
  auth,
  data,
});

// Anything Amplify does not have a helper for, you add with plain CDK
const authGroupStack = backend.createStack('AuthGroupStack');
new cognito.CfnUserPoolGroup(authGroupStack, 'AdminGroup', {
  userPoolId: backend.auth.resources.userPool.userPoolId,
  groupName: 'Admin',
  description: 'Campus Board moderators',
});
```

`backend.auth.resources.userPool` is the real CDK construct. `backend.createStack()` gives you a
nested stack for custom resources. Save and wait for the sandbox.

## 3.4 Make yourself an admin

```bash
EMAIL="you@example.com"      # the account you created in Module 2
USER_POOL_ID=$(node -p "require('./amplify_outputs.json').auth.user_pool_id")

aws cognito-idp admin-add-user-to-group \
  --user-pool-id $USER_POOL_ID --username $EMAIL --group-name Admin
```

**Sign out and sign in again** so your token includes the new group. Now delete anyone's post.

## 3.5 Only show the button when it will work

Hiding the button is UX, not security, but let's be polite. Create `src/auth.ts`:

```ts
import { useEffect, useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import type { AuthUser } from 'aws-amplify/auth';
import type { Post } from './types';

/** True when the signed-in user's access token lists the Admin group. */
export function useIsAdmin(authStatus: string) {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (authStatus !== 'authenticated') {
      setIsAdmin(false);
      return;
    }
    fetchAuthSession().then((session) => {
      const groups = (session.tokens?.accessToken.payload['cognito:groups'] as string[] | undefined) ?? [];
      setIsAdmin(groups.includes('Admin'));
    });
  }, [authStatus]);
  return isAdmin;
}

/** The owner field stores the Cognito identity; accept the forms Amplify may use. */
export function isOwner(post: Post, user: AuthUser | undefined) {
  if (!user || !post.owner) return false;
  return [user.userId, user.username, `${user.userId}::${user.username}`].includes(post.owner);
}
```

In `src/App.tsx`, import them and compute `canDelete` per post:

```tsx
import { isOwner, useIsAdmin } from './auth';
// inside Board(), after `const email = ...`:
const isAdmin = useIsAdmin(authStatus);
// in the JSX:
<PostCard
  key={post.id}
  post={post}
  canDelete={signedIn && (isAdmin || isOwner(post, user))}
  onDelete={() => deletePost(post.id)}
/>
```

The access token carries `cognito:groups`, so the UI can check membership without a network call.
The API still checks on every request.

## 3.6 Commit

```bash
git add .
git commit -m "Restrict writes to owners and the Admin group"
```

**Checkpoint:** `git checkout checkpoint/03-authorization`

🎉 The application is complete. Next: put it on the internet.

Next: [Module 4 — Deploy with Amplify Hosting](04-deploy.md)
