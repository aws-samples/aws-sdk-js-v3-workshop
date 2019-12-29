# DynamodDB client in v3

- This package contains backend code which performs create, delete, get, list and update operations on DynamoDB using v3
- It uses webpack to build single minimized bundle for each operation, and SAM CLI to package and deploy those bundles

## Table of Contents

- [Set up](#set-up)
  - [Create backend API](#create-backend-api)
  - [Test backend API](#test-backend-api)
  - [Clean resources](#clean-resources)
- [Activities](#activities)
- [Documentation](#documentation)

## Set up

Ensure that you've followed pre-requisites from main [README](../../README.md)
You do not have to follow these pre-requisites if you plan to override AWS resources from Exercise1:

- Run `export AWS_JS_SDK_ID=<unique>-aws-js-sdk-v3-workshop`
  - the value in `<unique>` could be your name, for example
  - this value in `AWS_JS_SDK_ID` will be used for your S3 bucket and Cloud formation stack
- [Optional] Rename TableName in [template.yaml](./template.yaml#L22) if table already exists in DynamoDB
- `yarn mb` to make S3 bucket

### Create backend API

- `yarn build` to build the package (runs ESLint and TypeScript)
- `yarn package` to [package](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-cli-command-reference-sam-package.html) your application
- `yarn deploy` to [deploy](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-cli-command-reference-sam-deploy.html) your application (this takes time)
- `yarn bpd` to run build, package and deploy! (during development)

### Test backend API

- `yarn describe` to get API Gateway endpoint
- Visit the endpoint `<ENDPOINT>/Prod/notes` in the browser
- The contents of DynamoDB table in [template.yml](./template.yaml#L22) would be returned as JSON

### Clean resources

- Note: Clean resources after you're done with all activities below, and you want to delete your cloudformation stack.
- `yarn clean` to delete resources

## Activities

Edit existing APIs or create new ones to use AWS Services you're familiar with in the backend. For example:

- Allow user to set reminder by using Amazon [SES](https://aws.amazon.com/ses/)/[SNS](https://aws.amazon.com/sns/)/[SQS](https://aws.amazon.com/sqs/)
  - This can be done by storing new attribute (say remindAt) in DynamoDB
- Remove dependency on AWS CLI/SAM CLI by writing Cloudformation commands in JS SDK v3 instead

## Documentation

For this workshop exercise, we've generated documentation [here](https://trivikr.github.io/aws-sdk-js-v3/)
