# Talk track — what to say on each slide

Twenty minutes for slides 1–15, then slides 16–17 launch the hands-on. Slides 18–21 come back at
Module 4 and at the end. Times are targets; the buffer lives in the hands-on, not here.

Every slide has one **key line**. If you are behind, say the key line, and move on. If you are badly
behind, skip slides 5, 8 and 14 entirely; nothing later depends on them.

Before you start: the live board (<https://main.d2j5j1zh2837n7.amplifyapp.com>) open in a browser
tab, signed in as Admin, and your own sandbox running so the projector board updates during Module 1.

---

## Slide 1 — Title (1 min)

Good afternoon. I'm Parathan. Today is a build, not a lecture: in the next two hours each of you
will put a real application on the internet, on your own AWS account, with a database, sign-in, and a
deployment pipeline behind it.

Before I say anything else, take your phone out and open this address (point at the URL). Sign up with
your email, and post anything: what you had for lunch, a question, anything. Keep that tab open. We'll
come back to it in two minutes.

**Key line:** "Today you deploy something real."

**Transition:** "Here's how the two hours go."

## Slide 2 — How the next two hours go (1 min)

Twenty minutes of me talking, and I'll keep to that. Then you build. Modules 0 to 3 make the app
work on your laptop, talking to your own backend in the cloud. Module 4 puts it on a public URL. We
finish by deleting everything, because leaving cloud resources running is the one habit I never want
you to pick up.

If you fall behind at any point, the repository has a checkpoint branch for every module. You check it
out and carry on with the next one. Nobody gets stuck today.

**Key line:** "Short talk, long build, and nobody gets stuck."

**Transition:** "So what is it we're building? Look at the screen."

## Slide 3 — What you will build: Campus Board (2 min)

(Switch to the live board.) This is the target. A notice board for the university: notices, events,
lost and found, study groups. Anyone can read it. Signed-in students can post. Admins can moderate.

Look at the projector. The things you posted a minute ago from your phones are here. Now watch. (Post
from your phone.) Nobody refreshed. That update arrived over a WebSocket from a service called AppSync,
and you will write that part yourself in Module 1, in about eight lines.

(Back to the slide.) Five things on the left, and each one is a module: browse and post, the live
feed, sign in, the rules about who can delete what, and deploying from GitHub. The whole React app is
about two hundred lines. The whole backend is about forty lines of TypeScript.

**Key line:** "Two hundred lines of React, forty lines of backend, and it's live."

**Transition:** "Forty lines sounds like a trick. To see why it isn't, let's look at what a
full-stack app actually needs."

## Slide 4 — What does a full-stack app actually need? (1.5 min)

Let's be honest about the phrase "full-stack". The frontend is the part you already know and enjoy.
Then there are four things every real application needs and almost nobody enjoys building: a database
with an API in front of it, sign-up and sign-in, hosting with HTTPS, and a pipeline that deploys on
every push.

(Ask the room.) Who here has written a login form from scratch? Who has stored a password? Please
don't. The interesting part of your application is the data model and the user interface. Everything
else is work that every app needs in exactly the same way. That is the definition of something a
platform should do for you.

**Key line:** "Amplify gives you the four on the right from TypeScript, and hosts the one on the left."

**Transition:** "Here's what those four look like if you build them yourself on AWS."

## Slide 5 — The hard way (1.5 min)

Nine services. Three consoles. Somewhere around thirty IAM policies, because every arrow on this
diagram is a permission you have to write and get right. People who do this for a living budget two
or three days for it, and they still get the permissions wrong the first time.

I want to be precise about one thing, because it matters for your learning: we are going to use most
of these services today. Amplify does not hide them. It provisions them and connects them. When you
open the DynamoDB console in an hour, that table is real, with your posts in it. The difference is
that you won't click through nine consoles to get there.

**Key line:** "Same services, no hand-wiring."

**Transition:** "So how does Amplify Gen 2 do that? With a file."

## Slide 6 — Amplify Gen 2: describe the backend in TypeScript (2 min)

This is the entire backend of today's app. Read it top to bottom. A Post has a title, an optional
body, a category from a fixed list, a link, an author. Three authorization rules; we'll come back to
those. Then one line for authentication: sign in with email.

This is not a configuration file that describes a backend living somewhere else. This file *is* the
backend. When you save it, Amplify turns each of these calls into AWS CDK constructs and deploys a
CloudFormation stack. They call it "infrastructure from code".

Three things on the right. It's built on CDK, so anything Amplify doesn't have a helper for, you add
with plain CDK in the same file; you'll do that in Module 3. Every developer gets their own cloud
sandbox that redeploys when you save. And in production, a Git branch is an environment.

The one that matters most for you as students: the types flow from this file into your React code.
Rename a field here, and your component stops compiling. You find out on your laptop, not from a user.

**Key line:** "The TypeScript file is the backend."

**Transition:** "Let's see what that file becomes when it's deployed."

## Slide 7 — Architecture of what we deploy today (2 min)

Walk it left to right. The browser loads the React app from CloudFront, which is a CDN sitting in
front of an S3 bucket that holds the Vite build. That's the orange box, and Amplify Hosting manages all
of it, including the build pipeline at the bottom.

From then on, the browser talks to AppSync directly: HTTPS for queries and mutations, a WebSocket for
the live feed. AppSync checks whether you sent the public API key or a Cognito token, runs a resolver,
and reads or writes DynamoDB. The whole blue box is one CloudFormation stack generated from the file on
the previous slide.

The dotted lines are group boundaries. Every solid arrow is an IAM permission somebody had to write.
Amplify wrote them.

**Key line:** "One git push produces all of this."

**Transition:** "And from the React side, here's everything that talks to it."

## Slide 8 — The whole data layer of the app, from React (1.5 min)

This is all the code in the finished app that talks to the cloud. Three parts. `generateClient` with
the `Schema` type: that's where the types come from. `observeQuery`: run the list query once, then
keep receiving every create, update and delete over the WebSocket. That's the live board. And `create`
with `authMode: userPool`: send my Cognito token instead of the API key, so the API knows who I am.

Notice what's missing. No base URL. No fetch wrapper. No token header. No refresh logic. No polling
loop. If you've built against a REST API before, you know how much code that usually is.

**Key line:** "No URLs, no headers, no polling."

**Transition:** "Now, one minute on each of the services underneath, because the names will come up
all afternoon."

## Slide 9 — AWS AppSync (1 min)

AppSync is a managed GraphQL API. Your frontend asks for exactly the fields it needs, and AppSync
resolves them from a data source: DynamoDB today, but also Lambda, relational databases, or any HTTP
endpoint.

For us it does two jobs. One endpoint for creating, listing and deleting posts. And subscriptions:
the live board is an AppSync subscription, and you get real-time for free instead of running a
WebSocket server. In Gen 2 you never write the GraphQL schema or the resolvers; `a.schema()`
generates them, and `client.models` gives you typed calls.

**Key line:** "The live board is one AppSync subscription."

## Slide 10 — Amazon DynamoDB (1 min)

DynamoDB is a serverless key-value database. No servers, no connection pools, no patching.
Single-digit millisecond reads at any scale, and you pay per request, so at our scale it costs
nothing. One table today: Post.

Students always ask "why not Postgres?". Because there is nothing to size, patch or connect to. If you
need SQL later, Amplify can point at an existing Postgres or MySQL database with one extra line.

**Key line:** "Nothing to size, nothing to patch, free at our scale."

## Slide 11 — Amazon Cognito (1 min)

Cognito is the user directory. Sign-up, email verification, password rules, MFA, groups, and social
login if you want it. It issues the tokens your browser sends to AppSync.

Two things to remember. We never store a password; Cognito does. And the token carries the user's
groups, so both the API and the UI can answer "is this person an admin?" without another call. The
`Authenticator` component renders every screen: sign in, sign up, verify, reset. You'll drop it in
during Module 2.

**Key line:** "You never store a password."

## Slide 12 — AWS CDK + CloudFormation (1 min)

CloudFormation creates AWS resources from a template, safely: if something fails halfway, it rolls
back. CDK lets you write that template in TypeScript with reusable building blocks called constructs.

Amplify's `defineAuth` and `defineData` are CDK constructs. When you need something Amplify has no
helper for, you drop down to CDK in the same file. In Module 3 you'll create the Admin group that way,
in four lines. The "bootstrap" step in Module 0 just creates a small stack, an S3 bucket and a few
roles, that CloudFormation needs before it can deploy anything.

**Key line:** "Amplify is CDK with helpers, and the helpers have an escape hatch."

## Slide 13 — AWS Amplify Hosting (1 min)

Hosting is Git-based CI/CD plus a CDN. Connect a repository, and every push builds the backend and
the frontend together and puts them behind CloudFront with HTTPS. Branches become environments,
pull requests get preview URLs, custom domains are a form.

That's Module 4, and the board you posted on at the start is exactly this: my `main` branch, built
by Amplify Hosting an hour before you arrived.

**Key line:** "Push to main, and it's live."

**Transition:** "Those two deployment modes, sandbox and branch, are worth one more minute."

## Slide 14 — The Gen 2 workflow (1 min)

Two modes. On the left, development: each of you runs `npx ampx sandbox` and gets your own backend
in the cloud. Not shared, not a mock, the real services. Save a file, it redeploys in about thirty
seconds. You'll live here for the next hour.

On the right, shipping: connect the repo to Hosting and Git branches become environments. A feature
branch gets its own backend; merge to promote; delete the branch to tear it down. Same TypeScript,
two deployment modes.

**Key line:** "Sandbox to develop, branch to ship."

## Slide 15 — Authorization rules live next to the data (1.5 min)

Back to the three rules from slide 6. Anyone with the public API key can read. The owner of a post,
meaning the signed-in user who created it, can update or delete it. Members of the Admin group can do
anything.

In Module 3 I'm going to ask you to try deleting a classmate's post. You will get this error. I want
you to see it, because it's the most important lesson of the day: authorization is a property of the
API, not of your React code. Your UI hides the button to be polite. AppSync refuses the mutation
because it checked the token.

**Key line:** "The API refuses; the UI only hides."

**Transition:** "That's the talk. Let's build it."

## Slide 16 — Hands-on roadmap (1 min)

Six modules. The `docs` folder in the repository has one file per module with every command and every
line of code; you don't need to type from the screen. Fifteen minutes for setup, then twenty for the
data model and the live feed, twenty for sign-in, fifteen for the rules, twenty to deploy, and ten to
clean up.

If you fall behind, `git checkout` the checkpoint for the module you're on and continue with the next
one. `main` is the finished app if you want to compare.

**Key line:** "One doc per module, one checkpoint per module."

## Slide 17 — Start now: Module 0 (1 min, then leave it up)

Four blocks, in order, in the `campus-board` folder. Check your tools. Scaffold the backend. Bootstrap
CDK, which is once per account. Start your sandbox.

Step four is the one that takes time, about five minutes the first run, so start it now and keep that
terminal open for the rest of the session. Open a second terminal for everything else. Success looks
like a green tick and "Watching for file changes". While it deploys, open `docs/01-data-model.md`
and start reading.

The two things that go wrong here: `aws sts get-caller-identity` fails, which means your credentials
aren't set; and "region is not bootstrapped", which means step three didn't run. Put your hand up
for either and I'll come over.

**Key line:** "Start the sandbox now; it runs while we talk."

## Slide 18 — Module 4: from GitHub to a public URL (at Module 4, 2 min)

Five steps. Push your code to a GitHub repository. In the Amplify console, connect it and pick the
`main` branch. Amplify provisions the production backend with `ampx pipeline-deploy`, the same
TypeScript your sandbox used. It runs `vite build` and puts the output in S3 behind CloudFront. And
you're live at an `amplifyapp.com` address that redeploys on every push.

The build spec at the bottom is already in the repo, so the console needs no settings from you. The
first build takes eight to ten minutes. While yours run, come and look at mine: the build log, the
branch list, the environment variables. Then make yourself Admin under Authentication, User management.

**Key line:** "Same TypeScript, deployed as a branch instead of a sandbox."

## Slide 19 — What it costs, and how to leave nothing behind (2 min)

Nothing we did today costs money. Every service on the left has a free tier we used a tiny fraction
of. So why clean up? Because the day you leave something running is the day it isn't free, and
because the habit is the point.

Let's do the checklist together, right now. Stop the sandbox, `npx ampx sandbox delete`. Delete the
Hosting app. Delete the log groups. Deactivate the access key you created for today. Done in five
minutes.

**Key line:** "Nothing costs money today. Delete it anyway."

## Slide 20 — Where to go from here (1 min)

Everything on this slide is another `defineSomething()` in the same `amplify` folder. Storage is the
natural next step for this app: replace the link field with an image upload. Functions, in Node or
Python, for a daily digest email or auto-expiring old posts. The AI kit talks to Bedrock, so you
could summarise the board or flag posts that need a moderator. And a custom domain is a form in the
Hosting console.

The links at the bottom are the docs, this repository, the full-day version of this workshop from
AWS, and the free tier page.

**Key line:** "The next feature is one more file in the same folder."

## Slide 21 — Questions (remaining time)

Thank you. Questions now, or post one on the board if you'd rather not put your hand up. The repo
stays public; the board stays up for a week. Bring what you build to the next meetup.

**Key line:** "Keep building. Delete what you don't need."
