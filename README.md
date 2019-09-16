# aws-sdk-js-v3-workshop

In this workshop, we're going to:
* Build a simple note taking application
* Identify the benefits of using AWS JS SDK v3 over v2

# Pre-requisites:

To set up this workshop package, first complete these tasks:

- Install Node.js by following the steps below:
  - Install [nvm](https://github.com/nvm-sh/nvm#installation-and-update)
  - Install node v10.0.0 by running `nvm install 10` and `nvm use 10`
  - Verify that node is installed by running `node -v` and confirm that it shows latest `v10` (for example, `v10.16.3`)
- Install [yarn](https://yarnpkg.com/en/docs/install)
  - We recommend using yarn for its simplicity and speed. You can still use npm cli instead of yarn
- Install [AWS CLI](https://aws.amazon.com/cli/)
  - Verify that AWS CLI is installed by running `aws` in terminal
- Install [AWS SAM CLI and Docker](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
  - Verify that AWS SAM CLI is installed by running `sam` in terminal
- Set up [AWS Shared Credential File](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)
  - Your `~/.aws/credentials` might look like:
    ```
    [default]
    aws_access_key_id = <ACCESS_KEY>
    aws_secret_access_key = <SECRET_ACCESS_KEY>
    ```
  - Your `~/.aws/config` might look like:
    ```
    [default]
    region = us-west-2
    ```

## Backend

Steps to create backend API :

- `cd packages/backend`
- Follow [backend README](./packages/backend/README.md)

## FrontEnd

Steps to run frontend (after creating and testing backend):

- `cd packages/frontend`
- Follow [frontend README](./packages/frontend/README.md)

# License Summary

This sample code is made available under the MIT-0 license. See the LICENSE file.
