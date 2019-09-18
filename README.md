# aws-sdk-js-v3-workshop

In this workshop, we're going to:

- Build a simple note taking application
- Identify the benefits of using AWS JS SDK v3 over v2

The note taking application is the modified version from the original Open Source MIT licensed project shared in the tutorials on [serverless-stack](http://serverless-stack.com).

# Pre-requisites:

To set up this workshop package, complete the following tasks:

- Install **Node.js** by following these steps:
  1. Install [nvm](https://github.com/nvm-sh/nvm#installation-and-update)
  1. Install node v10.0.0 by running `nvm install 10` and `nvm use 10` in a terminal window
  1. Verify that node is installed by running `node -v` in a terminal window and confirm that it shows the latest version of `v10`, such as `v10.16.3`)
- (Optional) Install [yarn](https://yarnpkg.com/en/docs/install)
  - We recommend using **yarn** for its simplicity and speed, although you can still use npm's cli instead of yarn
- If you don't have an AWS account, [create one](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/)
  - If you're an Amazon employee, see the internal wiki for creating an AWS account
- Install the [AWS CLI](https://aws.amazon.com/cli/)
  - Verify that the AWS CLI is installed by running `aws` in a terminal window
- Install the [AWS SAM CLI and Docker](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
  - Verify that the AWS SAM CLI is installed by running `sam` in a terminal window
- Set up [AWS Shared Credential File](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)
  - Your `~/.aws/credentials` should look like the following:
    ```
    [default]
    aws_access_key_id = <ACCESS_KEY>
    aws_secret_access_key = <SECRET_ACCESS_KEY>
    ```
  - Your `~/.aws/config` should look like the following:
    ```
    [default]
    region = us-west-2
    ```

## Backend

Perform the following steps to create the backend API
(the code which performs create, delete, get, list and update operations on DynamoDB):

- `cd packages/backend`
- Follow [backend README](./packages/backend/README.md)

Don't forget to test your backend code before the next step.

## FrontEnd

Perform the following steps to run the frontend
(code which does put, get, delete operations using an S3 browser client):

- `cd packages/frontend`
- Follow [frontend README](./packages/frontend/README.md)

# License Summary

This sample code is made available under the MIT license. See the LICENSE file.
