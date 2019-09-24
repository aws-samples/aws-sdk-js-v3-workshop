# S3 browser client in v3

- This package contains frontend code which does put, get, delete operations using S3 browser client
- This is a create-react-app which creates minimized bundle on running `build`

  <details><summary>Click to view screen recording</summary>
  <p>

  [![Screen recording](https://img.youtube.com/vi/qBltinDalzU/0.jpg)](https://www.youtube.com/watch?v=qBltinDalzU)

  </p>
  </details>

## Table of Contents

- [Set up](#set-up)
  - [Steps to run frontend locally](#steps-to-run-frontend-locally)
  - [Clean resources](#clean-resources)
- [Activities](#activities)
- [Documentation](#documentation)

## Set up

Ensure that you've followed pre-requisites from main [README](../../README.md), and created [backend](../backend/README.md)
You do not have to follow these pre-requisites if you plan to override AWS resources from Exercise1:

- Ensure that environment variable `AWS_JS_SDK_ID` has the value saved from backend README
  - You can print the value by running `echo $AWS_JS_SDK_ID`
  - If it's not defined, please set it by running `export AWS_JS_SDK_ID=<unique>-aws-js-sdk-v3-workshop`
  - this value in `AWS_JS_SDK_ID` will be used for Cloud formation stack frontend
- Edit [`template.yaml`](./template.yaml#L12) to save unique name for your S3 Bucket
  - It could be `<unique>-aws-js-sdk-workshop-files` where unique is your name/username
  - This bucket will store attachments linked with notes
  - The step `yarn deploy` will fail, if the S3 BucketName is not unique
- `yarn deploy` to create/update CloudFormation resources

### Steps to run frontend locally

- `yarn`
- Edit [`src/config.ts`](./src/config.ts)
  - Add `<ENDPOINT>/Prod` for your `GatewayURL`
    - You would have received `<ENDPOINT>` from running `yarn describe` in packages/backend
    - Example GatewayURL: `https://randomstring.execute-api.us-west-2.amazonaws.com/Prod`
  - Add S3 bucket name saved in [`template.yaml`](./template.yaml#L12)
  - Add `IdentityPoolId` from newly created IdentityPool in Cognito
    - You can find the `IdentityPoolId` corresponding to name `AwsJsSdkWorkshopIdentityPool` by running `yarn identity-pools`
    - Example IdentityPoolId: `us-west-2:random-strc-4ce1-84ee-9a429f9b557e`
- `yarn start` to run the server
  - This will open the website in the browser, and enable HMR
  - Just edit and save the files in `packages/frontend/src`, and the browser page will auto-refresh!
- `yarn build` to create optimized production build (to get file sizes)

### Clean resources

- Note: Clean resources after you're done with all activities below, and you want to delete your cloudformation stack.
- `yarn clean` to delete resources

## Activities

Edit existing APIs or create new ones to use AWS Services you're familiar with in the frontend. For example:

- [Amazon Cognito](https://aws.amazon.com/cognito/) can be used for sign-up, sign-in and access control
- [Amazon Polly](https://aws.amazon.com/polly/) can be used for reading content of notes
- [Amazon Transcribe](https://aws.amazon.com/transcribe/) can be used to allow adding notes via speech
  - You can refer example code from [amazon-transcribe-websocket-static](https://github.com/aws-samples/amazon-transcribe-websocket-static)
- Increase the size limit for attachments and use S3 [Multipart Upload](https://docs.aws.amazon.com/AmazonS3/latest/API/mpUploadInitiate.html) instead of existing [PutObject](https://docs.aws.amazon.com/AmazonS3/latest/API/SOAPPutObject.html) operation
- Remove dependency on AWS CLI/SAM CLI by writing Cloudformation commands in JS SDK v3 instead
- Process images using [Amazon Rekognition](https://aws.amazon.com/rekognition/), to generate and store tags for the images

## Documentation

For this workshop exercise, we've generated documentation [here](https://trivikr.github.io/aws-sdk-js-v3/)
