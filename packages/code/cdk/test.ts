import * as cdk from "@aws-cdk/core";
import { BundleTestStack } from "./bundle-test-stack";

const app = new cdk.App();
new BundleTestStack(app, "AwsSdkDynamodbBundleTest");
