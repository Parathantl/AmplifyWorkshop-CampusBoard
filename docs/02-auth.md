# Module 2 — Authentication (20 min)

**Goal:** let students sign up and sign in with **Amazon Cognito** using the pre-built
`<Authenticator />`, then only let signed-in users post, with their email as the author.

## 2.1 The auth resource

Open `amplify/auth/resource.ts`. The scaffold already contains what we need; delete the comment block
so it reads:

```ts
import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
});
```

That is a complete Cognito user pool with email sign-in, verification emails, and a password policy.
You could add `multifactor`, social providers, or custom attributes here. The sandbox deployed it in
Module 0 already, so nothing to wait for.

## 2.2 Sign-in UI in the header

Replace `src/components/Header.tsx`:

```tsx
import { useEffect, useState } from 'react';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

export default function Header() {
  const { authStatus, user, signOut } = useAuthenticator((ctx) => [ctx.authStatus, ctx.user]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (authStatus === 'authenticated') setOpen(false);
  }, [authStatus]);

  return (
    <header className="topbar">
      <div className="brand">
        <span className="logo">📌</span>
        <span>Campus Board</span>
        <span className="tag">University of Jaffna</span>
      </div>
      <div className="who">
        {authStatus === 'authenticated' ? (
          <>
            <span className="email">{user?.signInDetails?.loginId}</span>
            <button onClick={signOut}>Sign out</button>
          </>
        ) : (
          <button className="primary" onClick={() => setOpen(true)}>
            Sign in
          </button>
        )}
      </div>
      {open && (
        <div className="modal" onClick={() => setOpen(false)}>
          <div className="modal-body" onClick={(e) => e.stopPropagation()}>
            <Authenticator />
          </div>
        </div>
      )}
    </header>
  );
}
```

`<Authenticator />` renders sign-in, sign-up, email verification, forgot-password and
force-change-password flows, wired to your user pool. `useAuthenticator` gives any component the
current user.

## 2.3 Provide the auth state and gate the form

In `src/App.tsx`:

1. Add the import:

   ```tsx
   import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
   ```

2. Rename the existing component to `Board` and read the auth state at the top of it:

   ```tsx
   function Board() {
     const { authStatus, user } = useAuthenticator((ctx) => [ctx.authStatus, ctx.user]);
     const signedIn = authStatus === 'authenticated';
     const email = user?.signInDetails?.loginId;
     const [posts, setPosts] = useState<Post[]>([]);
     // ...everything else unchanged
   ```

3. Make writes run as the signed-in user (`authMode: 'userPool'`):

   ```tsx
   const { errors } = await client.models.Post.create(input, { authMode: 'userPool' });
   // and
   const { errors } = await client.models.Post.delete({ id }, { authMode: 'userPool' });
   ```

4. Replace the `<aside className="compose">` block in the JSX, and only show **Delete** to
   signed-in users (anonymous users cannot use `userPool` mode):

   ```tsx
   <aside className="compose">
     {signedIn ? (
       <PostForm onSubmit={addPost} author={email} />
     ) : (
       <div className="card signin-nudge">
         <p>Anyone can read the board. Sign in to post.</p>
       </div>
     )}
   </aside>
   ```

   ```tsx
   <PostCard key={post.id} post={post} canDelete={signedIn} onDelete={() => deletePost(post.id)} />
   ```

5. Add the exported `App` at the bottom of the file, wrapping `Board` in the provider:

   ```tsx
   export default function App() {
     return (
       <Authenticator.Provider>
         <Board />
       </Authenticator.Provider>
     );
   }
   ```

The `authMode: 'userPool'` option tells the client to send the user's Cognito token instead of the API
key. Right now both are allowed (the rule is still `publicApiKey()`); Module 3 changes that.

## 2.4 Try it

1. **Sign in ▸ Create Account**. Use an email you can read now. Enter the verification code.
2. The form appears and says *Posting as you@…*. Post something. Your email is the author.
3. **Sign out**: the form disappears, the board stays readable.
4. **Cognito console** ▸ User pools ▸ your pool ▸ *Users*: there you are.

## 2.5 Commit

```bash
git add .
git commit -m "Add Cognito sign-in with the Authenticator"
```

**Checkpoint:** `git checkout checkpoint/02-auth`

Next: [Module 3 — Authorization & Admin](03-authorization.md)
