# Module 5 — Clean up (10 min)

Everything we created is inside the AWS Free Tier for a workshop, but leaving it running is a habit
worth avoiding. Delete in this order.

## 5.1 Delete the sandbox

In the terminal where `npx ampx sandbox` is running, press `Ctrl+C`, then:

```bash
npx ampx sandbox delete
```

Confirm with `y`. This removes the sandbox CloudFormation stack (AppSync API, DynamoDB table,
Cognito user pool, IAM roles).

Alternatively: Amplify console ▸ **Manage sandboxes** ▸ select ▸ **Delete**.

## 5.2 Delete the Amplify Hosting app

Amplify console ▸ your app ▸ **App settings ▸ General settings** ▸ **Delete app** ▸ type `delete`.
This deletes the hosted site and the production backend stack.

## 5.3 CloudWatch log groups

CloudWatch console ▸ **Log groups** ▸ filter `amplify-campusboard` ▸ select all ▸
**Actions ▸ Delete log group(s)**.

## 5.4 (Optional) CDK bootstrap stack

Only if you will not use CDK/Amplify in this account again:

```bash
aws cloudformation delete-stack --stack-name CDKToolkit
```

You must empty the `cdk-hnb659fds-assets-*` S3 bucket first.

## 5.5 (Optional) IAM access key

If you created an access key just for today, IAM console ▸ Users ▸ your user ▸ **Security
credentials** ▸ deactivate and delete the key.
