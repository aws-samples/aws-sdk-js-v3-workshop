import { createRequest } from "@aws-sdk/util-create-request";
import { GetObjectCommand } from "@aws-sdk/client-s3-browser/commands/GetObjectCommand";
import { S3RequestPresigner } from "@aws-sdk/s3-request-presigner";
import { formatUrl } from "@aws-sdk/util-format-url";
import s3Client from "./s3Client";
import config from "../config";

const getObjectUrl = async (fileName: string) => {
  const request = await createRequest(
    s3Client,
    new GetObjectCommand({
      Key: fileName,
      Bucket: config.s3Bucket
    })
  );

  const signer = new S3RequestPresigner({
    ...s3Client.config
  });

  const url = await signer.presignRequest(
    request,
    new Date(Date.now() + 60 * 60 * 1000)
  );
  // @ts-ignore
  return formatUrl(url);
};

export default getObjectUrl;
