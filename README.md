# Campus Board — AWS Amplify Gen 2 Workshop

Hands-on workshop for the **University of Jaffna AWS Builders Group**.

In about two hours you turn a small React app into a real cloud application: a campus notice board
where anyone can read, signed-in students can post, and admins can moderate. Every post appears on
everyone's screen in real time. All of the backend is described in about forty lines of TypeScript;
**AWS Amplify Gen 2** provisions the AWS services for you.

| Capability you add | AWS services Amplify provisions |
|---|---|
| Data (GraphQL API + database + real-time) | AWS AppSync + Amazon DynamoDB |
| Sign-up / sign-in + Admin group | Amazon Cognito |
| Infrastructure as code | AWS CDK + AWS CloudFormation |
| Per-developer cloud sandbox | Amplify Sandbox (`npx ampx sandbox`) |
| CI/CD + hosting | AWS Amplify Hosting (Amazon CloudFront + Amazon S3) |

## Branches

| Branch | What it is |
|---|---|
| `starter` | Where you begin. React UI with local sample data, no backend. **Clone this one.** |
| `main` | The finished application. Use it to compare or to catch up. |
| `checkpoint/NN-*` | The code at the end of each module. If you fall behind, `git checkout` the checkpoint for the module you are on. |

## Before the session (10 minutes, do this at home)

1. **AWS account** you can deploy into (a personal or sandbox account, not production).
2. **AWS CLI v2** installed and configured: `aws configure` with an access key that has
   `AdministratorAccess` (fine for a workshop; delete the key afterwards). Verify with
   `aws sts get-caller-identity`.
3. **Node.js 20 or 22** (`node -v`), **Git**, and a **GitHub account**.
4. **VS Code** (or any editor).
5. Clone the starter and install dependencies (this is the slow part, so do it in advance):

   ```bash
   git clone -b starter https://github.com/Parathantl/AmplifyWorkshop-CampusBoard.git campus-board
   cd campus-board
   npm install
   npm run dev
   ```

   Open <http://localhost:5173>. You should see the board with three sample posts.

## Modules

| # | Module | Time | What you build |
|---|---|---|---|
| 0 | [Setup & sandbox](docs/00-setup.md) | 15 min | Scaffold Amplify, start your cloud sandbox |
| 1 | [Data model & live feed](docs/01-data-model.md) | 20 min | `Post` model → AppSync + DynamoDB; `observeQuery` makes the board live |
| 2 | [Authentication](docs/02-auth.md) | 20 min | Cognito sign-up/sign-in with `<Authenticator />`; only signed-in users post |
| 3 | [Authorization & Admin](docs/03-authorization.md) | 15 min | Public read, owner write, `Admin` group can moderate |
| 4 | [Deploy with Amplify Hosting](docs/04-deploy.md) | 20 min | Git-based CI/CD to a public URL |
| 5 | [Clean up](docs/05-cleanup.md) | 10 min | Delete everything so you are not billed |

Facilitator notes and the run-of-show are in [docs/FACILITATOR.md](docs/FACILITATOR.md); the per-slide talk track is in [docs/TALK-TRACK.md](docs/TALK-TRACK.md).

## Project layout (starter)

```
campus-board/
├── src/
│   ├── main.tsx                 # React entry point (Module 0 adds Amplify.configure)
│   ├── App.tsx                  # Board page: form + feed (Module 1 connects it to the API)
│   ├── types.ts                 # Post types + categories (Module 1 swaps in the generated types)
│   └── components/
│       ├── Header.tsx           # Top bar (Module 2 adds sign-in)
│       ├── PostForm.tsx         # New-post form
│       └── PostCard.tsx         # One post in the feed
├── amplify.yml                  # Amplify Hosting build spec (Module 4)
├── docs/                        # The workshop guide (start at 00-setup.md)
└── package.json
```

## Credits

Built for the University of Jaffna AWS Builders Group. Adapted in spirit from the official
[AWS Amplify Gen 2 Workshop](https://catalog.workshops.aws/workshops/386fd39b-01a5-44e9-9836-264c10039160/en-US),
reduced to a size that fits a two-hour session.
