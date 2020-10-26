# aws-sdk-js-v3-workshop

In this workshop, we're going to:

- Build a simple note taking application.
- Identify the benefits of using AWS SDK for JavaScript v3 over v2.

The note taking application is the modified version from the original Open Source MIT licensed project shared in the tutorials on [serverless-stack](http://serverless-stack.com).

## Table of Contents

- [Pre-requisites](#pre-requisites)
- [Activities](#activities)
  - [Exercise1](#exercise1)
  - [Exercise2](#exercise2)
  - [Exercise3](#exercise3)
- [Contributing](#contributing)
- [License Summary](#license-summary)

## Pre-requisites

To set up this workshop package, complete the following tasks:

- Install **Node.js** by following these steps:
  1. Install [nvm](https://github.com/nvm-sh/nvm#installation-and-update).
  1. Use node v12.x.x by running `nvm use` or `nvm use 12` in a terminal window.
  1. Verify that node is installed by running `node -v` in a terminal window and confirm that it shows the latest version of `v10`, such as `v12.17.0`).
- Install [yarn](https://yarnpkg.com/en/docs/install).
  - We recommend using **yarn** for its simplicity, speed and yarn workspaces.
- Install dependencies by running `yarn`.
- If you don't have an AWS account, [create one](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/).
  - If you're an Amazon employee, see the internal wiki for creating an AWS account.
- Install the [AWS CLI](https://aws.amazon.com/cli/).
  - Verify that the AWS CLI is installed by running `aws` in a terminal window.
- Set up [AWS Shared Credential File](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).
  - Your `~/.aws/credentials` (`%UserProfile%\.aws\credentials` on Windows) should look like the following:
    ```
    [default]
    aws_access_key_id = <ACCESS_KEY>
    aws_secret_access_key = <SECRET_ACCESS_KEY>
    ```
  - Your `~/.aws/config` (`%UserProfile%\.aws\config` on Windows) should look like the following:
    ```
    [default]
    region = us-west-2
    ```

## Activities

### Exercise1

This exercise code uses AWS SDK for JavaScript v2 as follows:

- backend performs create, delete, get, list and update operations on DynamoDB.
- frontend does put, get, delete operations using an S3 browser client.

The README files have instructions on how to move both to v3. The backend and frontend can be worked on independently as long as the APIs don't change. Follow [README](./packages/README.md) to set up and update backend, frontend and infrastructure.

### Exercise2

This exercise has the code which uses AWS SDK for JavaScript v3, which you would have got after finishing Exercise1:

- backend performs create, delete, get, list and update operations on DynamoDB.
- frontend does put, get, delete operations using an S3 browser client.

Edit existing APIs or create new ones to use AWS Services you're familiar with in the backend. For example:

- Allow user to set reminder by using Amazon [SES](https://aws.amazon.com/ses/)/[SNS](https://aws.amazon.com/sns/)/[SQS](https://aws.amazon.com/sqs/).
  - This can be done by storing new attribute (say remindAt) in DynamoDB.
- [Amazon Cognito](https://aws.amazon.com/cognito/) can be used for sign-up, sign-in and access control.
- [Amazon Polly](https://aws.amazon.com/polly/) can be used for reading content of notes.
- [Amazon Transcribe](https://aws.amazon.com/transcribe/) can be used to allow adding notes via speech
  - You can refer example code from [amazon-transcribe-websocket-static](https://github.com/aws-samples/amazon-transcribe-websocket-static).
- Increase the size limit for attachments and use S3 [Multipart Upload](https://docs.aws.amazon.com/AmazonS3/latest/API/mpUploadInitiate.html) instead of existing [PutObject](https://docs.aws.amazon.com/AmazonS3/latest/API/SOAPPutObject.html) operation.
- Process images using [Amazon Rekognition](https://aws.amazon.com/rekognition/), to generate and store tags for the images.

### Exercise3

Inspect the differences of stack trace if call `DynamoDB.putItem` with invalid resources in V2 and V3 SDK.

Using v2, call a service with invalid parameters as shown below:

<details>
<summary>Code</summary>

```ts
const DynamoDB = require("aws-sdk/clients/dynamodb");
const client = new DynamoDB({ region: "us-west-2" });
const request = client.putItem({
  TableName: "FakeName",
  Item: {
    Foo: { S: "Foo" },
  },
});
request.send((err, data) => {
  console.log(err);
});
```

</details>

When the code fails, the stack trace would look like:

<details>
<summary>Stack trace</summary>

```console
ResourceNotFoundException: Requested resource not found
    at Request.extractError (XXX/node_modules/aws-sdk/lib/protocol/json.js:51:27)
    at Request.callListeners (XXX/node_modules/aws-sdk/lib/sequential_executor.js:106:20)
    at Request.emit (XXX/node_modules/aws-sdk/lib/sequential_executor.js:78:10)
    at Request.emit (XXX/node_modules/aws-sdk/lib/request.js:683:14)
    at Request.transition (XXX/node_modules/aws-sdk/lib/request.js:22:10)
    at AcceptorStateMachine.runTo (XXX/node_modules/aws-sdk/lib/state_machine.js:14:12)
    at XXX/node_modules/aws-sdk/lib/state_machine.js:26:10
    at Request.<anonymous> (XXX/node_modules/aws-sdk/lib/request.js:38:9)
    at Request.<anonymous> (XXX/node_modules/aws-sdk/lib/request.js:685:12)
    at AcceptorStateMachine.runTo (XXX/node_modules/aws-sdk/lib/state_machine.js:14:12)
    at XXX/node_modules/aws-sdk/lib/state_machine.js:26:10
    at Request.<anonymous> (XXX/node_modules/aws-sdk/lib/request.js:38:9)
    at Request.<anonymous> (XXX/node_modules/aws-sdk/lib/request.js:685:12)
    at AcceptorStateMachine.runTo (XXX/node_modules/aws-sdk/lib/state_machine.js:14:12)
    at XXX/node_modules/aws-sdk/lib/state_machine.js:26:10
    at Request.<anonymous> (XXX/node_modules/aws-sdk/lib/request.js:38:9)
    at Request.<anonymous> (XXX/node_modules/aws-sdk/lib/request.js:685:12)
    at Request.callListeners (XXX/node_modules/aws-sdk/lib/sequential_executor.js:116:18)
```

</details>

This happens, as `Request.transition` exists multiple times as the SDK state machine stuck at some
state and makes stack trace unreadable.

Is the same operation is tried in v3:

<details>
<summary>Code</summary>

```ts
const {
  DynamoDBClient,
  PutItemCommand,
} = require("@aws-sdk/client-dynamodb-node");
const client = new DynamoDBClient({ region: "us-west-2" });
const command = new PutItemCommand({
  TableName: "FakeName",
  Item: {
    Foo: { S: "Foo" },
  },
});
(async () => {
  try {
    await client.send(command);
  } catch (e) {
    console.log(e);
    throw e;
  }
})();
```

</details>

The stack trace would be much smaller:

<details>
<summary>Stack trace</summary>

```console
ResourceNotFoundException: Requested resource not found
    at JsonRpcParser.exports.jsonErrorUnmarshaller [as parseServiceException] (XXX/node_modules/@aws-sdk/json-error-unmarshaller/build/index.js:37:70)
    at JsonRpcParser.<anonymous> (XXX/node_modules/@aws-sdk/protocol-json-rpc/build/JsonRpcParser.js:22:40)
    at step (XXX/node_modules/tslib/tslib.js:136:27)
    at Object.next (XXX/node_modules/tslib/tslib.js:117:57)
    at fulfilled (XXX/node_modules/tslib/tslib.js:107:62)
    at process._tickCallback (internal/process/next_tick.js:68:7)
```

</details>

## Contributing

Contributions are more than welcome. Please read the [code of conduct](CODE_OF_CONDUCT.md) and the [contributing guidelines](CONTRIBUTING.md).

## License Summary

This sample code is made available under the MIT license. See the LICENSE file.
