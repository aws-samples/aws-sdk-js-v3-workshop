# S3 browser client in v2 vs v3

![S3 browser client in v2 vs v3](http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/images/browsericon.png)

- This package contains frontend code which does put, get, delete operations using S3 browser client
- This is a create-react-app which creates minimized bundle on running `build`

  [![Screen recording](https://img.youtube.com/vi/qBltinDalzU/0.jpg)](https://www.youtube.com/watch?v=qBltinDalzU)

# Set up

Ensure that you've followed pre-requisites from main [README](../../README.md), and created [backend](../backend/README.md)

## Steps to run frontend locally

- `yarn`
- Ensure that environment variable `AWS_JS_SDK_ID` has the value saved from backend README
  - You can print the value by running `echo $AWS_JS_SDK_ID`
  - If it's not defined, please set it by running `export AWS_JS_SDK_ID=<unique>-aws-js-sdk-v3-workshop`
  - this value in `AWS_JS_SDK_ID` will be used for Cloud formation stack frontend
- Edit [`template.yaml`](./template.yaml#L12) to save unique name for your S3 Bucket
  - It could be `<unique>-aws-js-sdk-workshop-files` where unique is your name/username
  - This bucket will store attachments linked with notes
  - The step `yarn deploy` will fail, if the S3 BucketName is not unique
- `yarn deploy` to create/update CloudFormation resources
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

In this section, we're going to update the code to import S3 browser Client in different ways and compare the bundle sizes of the resulting app.

## Examine initial bundle size of the app

- `yarn build` to generate bundle size

  ```console
  File sizes after gzip:

    344.77 KB  build/static/js/2.0191bd07.chunk.js
    2.94 KB    build/static/js/main.f878258f.chunk.js
    790 B      build/static/js/runtime~main.e82a7b61.js
  ```

- This happens because entire aws-sdk is bundled in the app in file [`s3Client.ts`](./src/libs/s3Client.ts)

  ```typescript
  import AWS from "aws-sdk";
  ```

## Reduce bundle size by just importing s3 client

- In v2, you can reduce the bundle size by doing dead-code elimination using tree shaking with a bundler like webpack ([details](https://webpack.js.org/guides/tree-shaking/))
- Just import the `"aws-sdk/clients/s3"` in [`s3Client.ts`](./src/libs/s3Client.ts), as shown in the diff below:

  ```diff
  -import AWS from "aws-sdk";
  +import AWS from "aws-sdk/global";
  +import s3 from "aws-sdk/clients/s3";
   import config from "../config";

  -const s3Client = new AWS.S3({
  +const s3Client = new s3({
    region: "us-west-2",
    credentials: new AWS.CognitoIdentityCredentials(
      {
  ```

- Run `yarn build` to generate bundle, and it's size will reduce to ~134KB!

  ```console
  File sizes after gzip:

    134.24 KB (-210.54 KB)  build/static/js/2.357d9417.chunk.js
    2.95 KB (+10 B)         build/static/js/main.68ab09f8.chunk.js
    790 B                   build/static/js/runtime~main.e82a7b61.js
  ```

## Reduce bundle size further by using client from v3

- Uninstall v2 by running `yarn remove aws-sdk`
- Install s3 dependencies by running `yarn add @aws-sdk/client-s3-browser @aws-sdk/credential-provider-cognito-identity @aws-sdk/client-cognito-identity-browser`
- Make the following change in [`s3Client.ts`](./src/libs/s3Client.ts)

  ```diff
  -import AWS from "aws-sdk";
  +import { S3 } from "@aws-sdk/client-s3-browser";
  +import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
  +import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity-browser/CognitoIdentityClient";
   import config from "../config";

  -const s3Client = new AWS.S3({
  +// Customization pending https://github.com/aws/aws-sdk-js-v3/issues/185
  +const cognitoIdentityClient = new CognitoIdentityClient({
    region: "us-west-2",
  -  credentials: new AWS.CognitoIdentityCredentials(
  -    {
  -      IdentityPoolId: config.IdentityPoolId
  -    },
  -    {
  -      region: "us-west-2"
  -    }
  -  )
  +  credentials: () => Promise.resolve({} as any),
  +  signer: {} as any //this is required
  +});
  +cognitoIdentityClient.middlewareStack.remove("SIGNATURE");
  +
  +const s3Client = new S3({
  +  region: "us-west-2",
  +  credentials: fromCognitoIdentityPool({
  +    // @ts-ignore
  +    client: cognitoIdentityClient,
  +    identityPoolId: config.IdentityPoolId
  +  })
  });
  ```

- The command calls on v3 client return promises by default, so you've to remove `.promise()`.
- For example, here's a diff for [`putObject.ts`](./src/libs/putObject.ts):

  ```diff
  const putObject = async (file: File) => {
    const Key = `${Date.now()}-${file.name}`;
    await s3Client
      .putObject({
        Key,
        Body: file,
        Bucket: config.s3Bucket,
        ACL: "public-read"
  -    })
  -    .promise();
  +    });
    return Key;
  };
  ```

- To create and presign getObject URLs, you'll have to `yarn add @aws-sdk/util-create-request @aws-sdk/s3-request-presigner @aws-crypto/sha256-browser @aws-sdk/util-format-url`
- Make the following change in `getObjectURL.ts`

  ```diff
  +import { createRequest } from "@aws-sdk/util-create-request";
  +import { GetObjectCommand } from "@aws-sdk/client-s3-browser/commands/GetObjectCommand";
  +import { S3RequestPresigner } from "@aws-sdk/s3-request-presigner";
  +import { formatUrl } from "@aws-sdk/util-format-url";
   import s3Client from "./s3Client";
   import config from "../config";

  -const getObjectUrl = async (fileName: string) =>
  -  s3Client.getSignedUrlPromise("getObject", {
  -    Key: fileName,
  -    Bucket: config.s3Bucket
  +const getObjectUrl = async (fileName: string) => {
  +  const request = await createRequest(
  +    s3Client,
  +    new GetObjectCommand({
  +      Key: fileName,
  +      Bucket: config.s3Bucket
  +    })
  +  );
  +
  +  const signer = new S3RequestPresigner({
  +    ...s3Client.config
    });

  +  const url = await signer.presignRequest(
  +    request,
  +    new Date(Date.now() + 60 * 60 * 1000)
  +  );
  +  // @ts-ignore
  +  return formatUrl(url);
  +};
  +
   export { getObjectUrl };
  ```

- Run `yarn build` to generate bundle, and it's size will reduce to ~107KB!

  ```console
  File sizes after gzip:

    106.81 KB (-27.42 KB)  build/static/js/2.00e02e76.chunk.js
    3.32 KB (+378 B)       build/static/js/main.8fb985d5.chunk.js
    790 B                  build/static/js/runtime~main.e82a7b61.js
  ```

## Reduce bundle size further by just importing specific commands in v3

- AWS JS SDK v3 has an option to import specific commands, thus reducing bundle size further!
- Make the following change in [`s3Client.ts`](./src/libs/s3Client.ts) to import S3Client from v3

  ```diff
  -import { S3 } from "@aws-sdk/client-s3-browser";
  +import { S3Client } from "@aws-sdk/client-s3-browser/S3Client";
   import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
   import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity-browser/CognitoIdentityClient";
  ```

  ```diff
  -const s3Client = new S3({
  +const s3Client = new S3Client({
    region: "us-west-2",
    credentials: fromCognitoIdentityPool({
  ```

- Import and call just the `PutObjectCommand` in [`putObject.ts`](./src/libs/putObject.ts) for example:

  ```diff
  +import { PutObjectCommand } from "@aws-sdk/client-s3-browser/commands/PutObjectCommand";
   import s3Client from "./s3Client";
   import config from "../config";

   const putObject = async (file: File) => {
    const Key = `${Date.now()}-${file.name}`;
  -  await s3Client
  -    .putObject({
  +  await s3Client.send(
  +    new PutObjectCommand({
        Key,
        Body: file,
        Bucket: config.s3Bucket,
        ACL: "public-read"
  -    });
  +    }));
    return Key;
   };
  ```

- Run `yarn build` to generate bundle, and it's size will reduce to ~90KB!

  ```console
  File sizes after gzip:

    90.07 KB (-16.75 KB)  build/static/js/2.988f5386.chunk.js
    3.34 KB (+25 B)       build/static/js/main.e64e6df1.chunk.js
    790 B                 build/static/js/runtime~main.e82a7b61.js
  ```

## Bundle size without SDK

- For comparison, make the following changes to remove SDK from the bundle
- [CreateNote.tsx](./src/content/CreateNote.tsx)

  ```diff
   import { navigate, RouteComponentProps } from "@reach/router";
   import config from "../config";
   import ButtonSpinner from "../components/ButtonSpinner";
  -import putObject from "../libs/putObject";

   const CreateNote = (props: RouteComponentProps) => {
    const [isLoading, setIsLoading] = useState(false);
  @@ -26,10 +25,9 @@ const CreateNote = (props: RouteComponentProps) => {
      const createNoteURL = `${config.GatewayURL}/notes`;

      try {
  -      const attachment = file ? await putObject(file) : undefined;
        await fetch(createNoteURL, {
          method: "POST",
  -        body: JSON.stringify({ attachment, content: noteContent })
  +        body: JSON.stringify({ content: noteContent })
        });
        navigate("/");
      } catch (error) {
  ```

- [DeleteNoteButton.tsx](./src/content/DeleteNoteButton.tsx)

  ```diff
   import config from "../config";
   import { navigate } from "@reach/router";
   import ButtonSpinner from "../components/ButtonSpinner";
  -import deleteObject from "../libs/deleteObject";

   const DeleteNoteButton = (props: { noteId: string; attachment?: string }) => {
    const { noteId, attachment } = props;
  @@ -17,9 +16,6 @@ const DeleteNoteButton = (props: { noteId: string; attachment?: string }) => {
      const deleteNoteURL = `${config.GatewayURL}/notes/${noteId}`;

      try {
  -      if (attachment) {
  -        await deleteObject(attachment);
  -      }
        await fetch(deleteNoteURL, {
          method: "DELETE"
        });
  ```

- [ShowNote.tsx](./src/content/ShowNote.tsx)

  ```diff
   import config from "../config";
   import DeleteNoteButton from "./DeleteNoteButton";
   import SaveNoteButton from "./SaveNoteButton";
  -import getObjectUrl from "../libs/getObjectUrl";

   const ShowNote = (props: RouteComponentProps<{ noteId: string }>) => {
    const { noteId } = props;
  @@ -25,7 +24,6 @@ const ShowNote = (props: RouteComponentProps<{ noteId: string }>) => {
          setNoteContent(data.content.S as string);
          if (data.attachment) {
            setAttachment(data.attachment.S);
  -          setAttachmentURL(await getObjectUrl(data.attachment.S));
          }
        } catch (error) {
  ```

- Run `yarn build` to generate bundle, and notice that the size is ~53KB

  ```console
  File sizes after gzip:

    52.87 KB  build/static/js/2.5d40fcf7.chunk.js
    2.5 KB    build/static/js/main.2c3db684.chunk.js
    790 B     build/static/js/runtime~main.e82a7b61.js
  ```
