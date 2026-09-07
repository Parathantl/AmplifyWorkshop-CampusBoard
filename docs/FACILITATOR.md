# Facilitator guide — run of show

Audience: University of Jaffna AWS Builders Group (students, mixed experience).
Format: 20-minute talk, then guided hands-on. Target 2 h 00 min, 2 h 20 min with buffer.

## Before the day

- [ ] Deploy `main` to Amplify Hosting in your own account and make yourself Admin there, so you can
      demo the finished board in the first five minutes and again while student builds run.
- [ ] Put the hosted URL on the first and last slides, and in the README.
- [ ] Send students the **Before the session** section of `README.md` at least two days early.
      `npm install` and `aws configure` are the two things that eat time on the day.
- [ ] Test `npx ampx sandbox` end to end from a clean clone of `starter` the day before.
- [ ] Have your own sandbox running before students arrive, so the projector board is live from
      Module 1 onwards. Tell students to post to **your** URL as well as their own.

## Timeline

| Clock | Min | Segment | Notes |
|---|---|---|---|
| 0:00 | 5 | Welcome, show the finished board | <https://main.d2j5j1zh2837n7.amplifyapp.com>; ask everyone to post from their phone |
| 0:05 | 15 | **Talk**: Amplify Gen 2 and the services underneath | Slides 1–15 |
| 0:20 | 15 | **Module 0** Setup, sandbox | Start `ampx sandbox` early; ~5 min |
| 0:35 | 20 | **Module 1** Data model, live feed | The room posting to each other is the moment of the day |
| 0:55 | 20 | **Module 2** Authenticator | Verification emails go out here; check spam |
| 1:15 | 15 | **Module 3** Rules, Admin group | Let them hit "Not Authorized" before you explain it |
| 1:30 | 20 | **Module 4** Amplify Hosting | Kick off builds, then demo yours while they run |
| 1:50 | 10 | **Module 5** Clean up + wrap-up, Q&A | Slides 16–21 |

Buffer: 20 minutes. If the room is slow, Module 4 can be demoed on your account instead of done by
every student; say so explicitly and point to `main`.

## Checkpoint branches

Students who fall behind run `git stash && git checkout checkpoint/NN-<name>` and continue with the
next module. Each checkpoint contains everything up to and including that module (except
`amplify_outputs.json`, which their sandbox regenerates).

## Known sticking points

| Symptom | Fix |
|---|---|
| `ampx sandbox` says the region is not bootstrapped | `npx cdk bootstrap aws://<acct>/<region>` (Module 0.4), or open the link it prints |
| `ampx sandbox` access denied / assume role fails | Their key lacks admin. Attach `AdministratorAccess` for the workshop |
| Sandbox deploy takes >10 min | Usually the first CDK bootstrap in a new account. Carry on with Module 1 edits; they queue |
| Vite: `Failed to resolve import "../amplify_outputs.json"` | Sandbox has not finished the first deploy yet |
| `Not Authorized to access createPost` after Module 3 | They forgot `{ authMode: 'userPool' }` on create/delete (Module 2.3) |
| Delete still refused for an admin | They did not sign out and back in after being added to the group |
| Verification email never arrives | Check spam; Cognito's default sender is limited to 50 emails/day per pool, fine for a workshop |
| `a.url()` rejects the link | Must include `https://`. The form uses `type="url"` so the browser catches most cases |
| Amplify Hosting build fails in backend phase | Service role missing `AmplifyBackendDeployFullAccess`; recreate the app and let Amplify create the role |
| Windows: `$(...)` not recognised | Use Git Bash, or run the two `aws` commands separately and paste the values |

## Cost

Everything in a 2-hour run stays inside the Free Tier: DynamoDB on-demand, AppSync, Cognito (<10k
MAU), CloudFront, Amplify Hosting build minutes. The only recurring cost if not cleaned up is the CDK
bootstrap S3 bucket and CloudWatch logs (cents per month). Insist on Module 5 anyway.

## Talk track

The full per-slide script, with timings and the key line for each slide, is in
[TALK-TRACK.md](TALK-TRACK.md). It is also embedded as speaker notes in the deck.

## Talk track summary (slides)

1. What a "full-stack" app needs: data, auth, hosting, CI/CD.
2. How you would build it by hand: many AWS services, several consoles, IAM everywhere.
3. Amplify Gen 2: describe the backend in TypeScript, get the services provisioned via CDK.
4. What we build today (architecture), and the four lines of React that talk to it.
5. Service by service: AppSync, DynamoDB, Cognito, CDK/CloudFormation, Amplify Hosting.
6. The sandbox vs branch-environment model, authorization rules, then hands-on.
