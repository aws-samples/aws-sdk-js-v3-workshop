# S3 browser client in v2 vs v3

![S3 browser client in v2 vs v3](http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/images/browsericon.png)

- This package contains frontend code which does put, get, delete operations using S3 browser client
- This is a create-react-app which creates minimized bundle on running `build`

  [![Screen recording](https://img.youtube.com/vi/qBltinDalzU/0.jpg)](https://www.youtube.com/watch?v=qBltinDalzU)

# Set up

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

## Steps to run frontend locally

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

## Clean resources

- `yarn clean` to delete resources

# Activities

Edit existing APIs or create new ones to use AWS Services you're familiar with in the frontend. For example:

- ServiceName1 can be used for something
- ServiceName2 can be used for something else
