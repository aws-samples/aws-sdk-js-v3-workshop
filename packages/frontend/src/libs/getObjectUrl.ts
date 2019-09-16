import s3Client from "./s3Client";
import config from "../config";

const getObjectUrl = async (fileName: string) =>
  s3Client.getSignedUrlPromise("getObject", {
    Key: fileName,
    Bucket: config.s3Bucket
  });

export default getObjectUrl;
