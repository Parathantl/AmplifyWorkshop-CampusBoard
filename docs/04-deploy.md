# Module 4 — Deploy with Amplify Hosting (20 min)

**Goal:** connect your GitHub repository to **AWS Amplify Hosting**. Every push to `main` then builds
the backend (`ampx pipeline-deploy`), builds the Vite app, and publishes it behind Amazon CloudFront.

The sandbox was *your* environment. Hosting creates a separate, shared **production** backend tied to
the Git branch, so the production board starts empty and needs its own admin.

## 4.1 Push to your own GitHub repository

Create an empty repository on GitHub (e.g. `campus-board`, private is fine), then:

```bash
git remote remove origin 2>/dev/null   # drop the instructor's remote
git remote add origin https://github.com/<you>/campus-board.git
git push -u origin HEAD:main
```

(`amplify_outputs.json` is git-ignored on purpose. Hosting generates it during the build.)

## 4.2 Connect the repository in the Amplify console

1. Open the **AWS Amplify** console in your region ▸ **Create new app** (or **Deploy an app**).
2. Choose **GitHub** ▸ **Next**. Authorise the *AWS Amplify* GitHub App and grant it access to your
   repository (you can limit it to just this one).
3. Select the repository and the `main` branch. Amplify detects Vite and Amplify Gen 2 ▸ **Next**.
4. **App settings:** leave the defaults. The build spec comes from `amplify.yml` in the repo. Amplify
   creates a service role with `AmplifyBackendDeployFullAccess` automatically ▸ **Next**.
5. **Save and deploy.**

The first deployment takes 8–10 minutes (backend CloudFormation, then the Vite build). Watch the
*Provision → Build → Deploy* stages. Open the build log and find `ampx pipeline-deploy`.

### `amplify.yml` (already in the repo)

```yaml
version: 1
backend:
  phases:
    build:
      commands:
        - npm ci --cache .npm --prefer-offline
        - npx ampx pipeline-deploy --branch $AWS_BRANCH --app-id $AWS_APP_ID
frontend:
  phases:
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
```

`ampx pipeline-deploy` is the CI/CD equivalent of `ampx sandbox`: same TypeScript, deployed as a
persistent branch environment instead of an ephemeral personal one.

## 4.3 Create a production admin

1. Open the site (the URL under **Domain**, `https://main.xxxxxxxx.amplifyapp.com`). Sign in ▸
   **Create Account** with your email and verify it.
2. In the Amplify console ▸ your app ▸ `main` ▸ **Authentication ▸ User management**, open your user
   ▸ **Group membership ▸ Add to group ▸ `Admin`**. (The group exists because `backend.ts` created it.)
3. Sign out and in again. You can now moderate the production board.

Post something and send the URL to the person next to you. Every future `git push` to `main`
redeploys automatically. Pull-request previews and per-branch environments are one toggle away in
the console.

Next: [Module 5 — Clean up](05-cleanup.md)
