# Module 0 — Setup & the Amplify sandbox (15 min)

**Goal:** scaffold an Amplify Gen 2 backend inside the project and start a personal cloud sandbox
that deploys your backend to AWS and redeploys on every file save.

## 0.1 Check your tools

```bash
node -v                      # v20.x or v22.x
aws sts get-caller-identity  # prints your Account and Arn
aws configure get region     # e.g. ap-south-1 (set one with: aws configure set region ap-south-1)
```

If `aws sts get-caller-identity` fails, run `aws configure` and paste your access key, secret key, and
region.

## 0.2 Run the starter (skip if you did it at home)

```bash
cd campus-board
npm install
npm run dev
```

Open <http://localhost:5173>. The board works, but everything lives in React state: refresh the page
and your posts are gone. By the end of Module 1 they will be in DynamoDB and on everyone's screen.

## 0.3 Scaffold the Amplify backend

```bash
npm create amplify@latest -y
```

This adds an `amplify/` folder and a few dev dependencies:

```
amplify/
├── auth/resource.ts   # Cognito user pool (defineAuth)
├── data/resource.ts   # AppSync + DynamoDB (defineData)
├── backend.ts         # Wires the resources together (defineBackend)
├── package.json
└── tsconfig.json
```

> **Gen 2 in one sentence:** you describe *what* you want in TypeScript, Amplify turns it into AWS CDK
> constructs and deploys a CloudFormation stack. No console clicking, no YAML.

## 0.4 Bootstrap CDK (once per account + region)

Amplify deploys with the AWS CDK. CDK needs a small "bootstrap" stack (an S3 bucket and IAM roles) in
the account before it can deploy anything else.

```bash
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
REGION=$(aws configure get region)
npx cdk bootstrap aws://$ACCOUNT/$REGION
```

Takes 1–2 minutes. If your account was bootstrapped before, it finishes immediately.

## 0.5 Start the sandbox

```bash
npx ampx sandbox
```

Leave this terminal open for the whole workshop. The first deployment takes ~5 minutes. When it is
ready you will see:

```
✅  amplify-campusboard-<user>-sandbox-xxxxxxxx
✨  Deployment time: ...
[Sandbox] Watching for file changes...
File written: amplify_outputs.json
```

`amplify_outputs.json` contains the endpoints and IDs of everything that was deployed. It is
git-ignored and regenerated on every deploy.

**While the sandbox deploys, carry on with 0.6 and then Module 1.**

## 0.6 Tell the frontend about the backend

Replace the contents of `src/main.tsx`:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';
import './index.css';
import App from './App.tsx';

Amplify.configure(outputs);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

`Amplify.configure(outputs)` is the only line the Amplify client libraries need. Every later call
(`generateClient`, `Authenticator`, …) reads from it.

(The dev server will complain that `amplify_outputs.json` does not exist until the sandbox finishes
its first deploy. That is expected.)

## 0.7 Commit

Open a **second** terminal (do not close the sandbox one):

```bash
git add .
git commit -m "Add Amplify Gen 2 backend scaffold"
```

**Checkpoint:** `git checkout checkpoint/00-setup`

Next: [Module 1 — Data model & live feed](01-data-model.md)
