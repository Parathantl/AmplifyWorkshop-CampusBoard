import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Post: a.model({
    title: a.string().required(),
    body: a.string(),
    category: a.enum(['NOTICE', 'EVENT', 'LOST_FOUND', 'STUDY_GROUP']),
    link: a.url(),
    author: a.string(),
  }).authorization((allow) => [
    allow.publicApiKey().to(['read']),   // anyone can read
    allow.owner(),                       // the author can update/delete their own post
    allow.group('Admin'),                // Admin group can do anything
  ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: { expiresInDays: 30 },
  },
});
