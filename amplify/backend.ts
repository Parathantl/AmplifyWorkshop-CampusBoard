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
