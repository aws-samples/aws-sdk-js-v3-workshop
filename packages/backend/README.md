# DynamodDB client in v2 vs v3

- This package contains backend code which performs create, delete, get, list and update operations on DynamoDB.
- It uses webpack to build single minimized bundle for each operation, and AWS CDK to deploy those bundles.

## Table of Contents

- [Set up](#set-up)
  - [Create backend API](#create-backend-api)
  - [Test backend API](#test-backend-api)
  - [Clean resources](#clean-resources)
- [Activities](#activities)
  - [Examine initial bundle size of lambda functions](#examine-initial-bundle-size-of-lambda-functions)
  - [Reduce bundle size by just importing dynamodb](#reduce-bundle-size-by-just-importing-dynamodb)
  - [Reduce bundle size further by using client from v3](#reduce-bundle-size-further-by-using-client-from-v3)
  - [Reduce bundle size even more by just importing specific commands in v3](#reduce-bundle-size-even-more-by-just-importing-specific-commands-in-v3)
- [Correlation between lambda size and execution time](#correlation-between-lambda-size-and-execution-time)
  - [Traces for lambda which imports entire v2](#traces-for-lambda-which-imports-entire-v2)
  - [Traces for lambda which imports specific client and command in v3](#traces-for-lambda-which-imports-specific-client-and-command-in-v3)
  - [Comparison between v3 and v2 lambda duration](#comparison-between-v3-and-v2-lambda-duration)

## Set up

Ensure that you've followed pre-requisites from main [README](../../README.md).

### Create backend API

- `yarn build:backend` to build the package (runs ESLint and TypeScript).
- `yarn cdk deploy` to deploy your application (this operation might take time based on the state of your Cloudformation stack).

### Test backend API

- Open the GatewayUrl link from CDK output from the console.
  - It'll be like: https://randomstring.execute-api.us-west-2.amazonaws.com/prod/
- Append `notes` in the URL.
  - It'll be like: https://randomstring.execute-api.us-west-2.amazonaws.com/prod/notes
- The contents of the notes DynamoDB table would be returned as JSON.
- If you don't see anything, that's because your table is likely empty! Add data manually or wait until you run the frontend.

### Clean resources

- Note: Clean resources after you're done with all activities below, and you want to delete your cloudformation stack.
- `yarn cdk destroy` to delete your CloudFormation stack.

## Activities

In this section, we're going to update the code to import DynamoDB Client in different ways and compare the bundle sizes of the resulting lambda functions.

### Examine initial bundle size of lambda functions

- Login to [AWS Lambda Console](https://console.aws.amazon.com/lambda/home).
- The size of each lambda functions will be ~820 kB.

  <details><summary>Click to view image</summary>
  <p>

  ![AWS Lambda function sizes in v2](./screenshots/aws-lambda-v2.png)

  </p>
  </details>

- This happens because entire aws-sdk is bundled in the lambda in file [`dynamoDB.ts`](./src/libs/dynamoDB.ts).

  ```typescript
  import AWS from "aws-sdk";

  export default new AWS.DynamoDB();
  ```

### Reduce bundle size by just importing dynamodb

- In v2, you can reduce the bundle size by doing dead-code elimination using [tree shaking with a bundler like webpack](https://webpack.js.org/guides/tree-shaking/).
- Just import the `"aws-sdk/clients/dynamodb"` in [`dynamoDB.ts`](./src/libs/dynamoDB.ts), as shown in the diff below:

  ```diff
  -import AWS from "aws-sdk";
  +import DynamoDB from "aws-sdk/clients/dynamodb";

  -export default new AWS.DynamoDB();
  +export default new DynamoDB();
  ```

- Run `yarn build:backend` and `yarn cdk deploy` to build+deploy new code, and the size of lambda functions will reduce to ~90 kB!

  <details><summary>Click to view image</summary>
  <p>

  ![AWS Lambda function sizes in v2 with dynamodb import](./screenshots/aws-lambda-v2-dynamodb.png)

  </p>
  </details>

### Reduce bundle size further by using client from v3

- Uninstall v2 by running the following command:
  - `yarn remove aws-sdk`
- Install dynamodb in v3 by running the following command:
  - `yarn add @aws-sdk/client-dynamodb`.
- Make the following change in [`dynamoDB.ts`](./src/libs/dynamoDB.ts) to import DynamoDB from v3.

  ```diff
  -import DynamoDB from "aws-sdk/clients/dynamodb";
  +import { DynamoDB } from "@aws-sdk/client-dynamodb";

  -export default new DynamoDB();
  +export default new DynamoDB({});
  ```

- The function calls v3 client return promises by default, so you've to remove `.promise()` from individual functions.
- For example, here's a diff for [`createNote.ts`](./src/createNote.ts).

  ```diff
   try {
  +    // @ts-ignore
  -    await dynamoDB.putItem(params).promise();
  +    await dynamoDB.putItem(params);
     return success(params.Item);
   } catch (e) {
     return failure({ status: false });
  ```

- Run `yarn build:backend` and `yarn cdk deploy` to build+deploy new code, and the size of lambda functions will reduce to ~42 kB!

  <details><summary>Click to view image</summary>
  <p>

  ![AWS Lambda function sizes in v3](./screenshots/aws-lambda-v3.png)

  </p>
  </details>

### Reduce bundle size even more by just importing specific commands in v3

- AWS JS SDK v3 has an option to import specific commands, thus reducing bundle size further!
- Make the following change in [`dynamoDB.ts`](./src/libs/dynamoDB.ts) to import DynamoDBClient from v3.

  ```diff
  -import { DynamoDB } from "@aws-sdk/client-dynamodb";
  +import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

  -export default new DynamoDB({});
  +export default new DynamoDBClient({});
  ```

- Import and call just the `PutCommand` in [`createNote.ts`](./src/createNote.ts) for example:

  ```diff
  import crypto from "crypto";
  -import dynamoDB from "./libs/dynamoDB";
  +import dynamoDBClient from "./libs/dynamoDB";
  +import { PutItemCommand } from "@aws-sdk/client-dynamodb";
  import { success, failure } from "./libs/response";
  ```

  ```diff
    try {
  -    await dynamoDB.putItem(params);
  +    await dynamoDBClient.send(new PutItemCommand(params));
      return success(params.Item);
    } catch (e) {
      return failure({ status: false });
  ```

- Run `yarn build:backend` and `yarn cdk deploy` to build+deploy new code, and the size of lambda functions will reduce to ~23 kB!

  <details><summary>Click to view image</summary>
  <p>

  ![AWS Lambda function sizes in v3 command import](./screenshots/aws-lambda-v3-command.png)

  </p>
  </details>

## Correlation between lambda size and execution time

Here's how we find out correlation between lambda size and execution time:

- We get metrics by enabling Active tracing under [AWS X-Ray](https://aws.amazon.com/xray/) for ListNotes lambda.
- The comparison is between original bundle which imports entire v2 with final bundle which imports specific command in v3.
- For testing, two fresh endpoints are created using Cloudformation and we visit `<ENDPOINT>/Prod/notes` in the browser.
- The cold start is the first hit post endpoint creation, and warm start is the second hit after ~3 seconds.

### Traces for lambda which imports entire v2

#### Cold start

  <details><summary>Click to view image</summary>
  <p>

![AWS v2 entire import cold start](./screenshots/aws-sdk-js-cold-start.png)

  </p>
  </details>

#### Warm start

  <details><summary>Click to view image</summary>
  <p>

![AWS v2 entire import warm start](./screenshots/aws-sdk-js-warm-start.png)

  </p>
  </details>

### Traces for lambda which imports specific client and command in v3

#### Cold start

  <details><summary>Click to view image</summary>
  <p>

![AWS v3 client+command import cold start](./screenshots/aws-sdk-js-v3-cold-start.png)

  </p>
  </details>

#### Warm start

  <details><summary>Click to view image</summary>
  <p>

![AWS v3 client+command entire import warm start](./screenshots/aws-sdk-js-v3-warm-start.png)

  </p>
  </details>

### Comparison between v3 and v2 lambda duration

- A Cloudwatch event was written to trigger both lambdas every 20 mins and 18 values (in ms) for Duration of `AWS::Lambda::Function` were analyzed over 6 hours.

  |                   | Average | Min  | Max  | Median | 90th percentile |
  | ----------------- | ------- | ---- | ---- | ------ | --------------- |
  | entire v2         | 1171.5  | 1013 | 1431 | 1093.5 | 1193.39         |
  | v3 command+client | 735.22  | 693  | 786  | 738    | 775.6           |

- Another Cloudwatch event was written to trigger both lambdas every minute and 50 values (in ms) for Duration of `AWS::Lambda::Function` were analyzed.

  |                   | Average | Min | Max | Median | 90th percentile |
  | ----------------- | ------- | --- | --- | ------ | --------------- |
  | entire v2         | 117.82  | 85  | 178 | 116    | 139             |
  | v3 command+client | 116.22  | 83  | 176 | 115.5  | 136             |
