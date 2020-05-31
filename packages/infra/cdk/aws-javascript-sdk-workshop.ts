import * as cdk from "@aws-cdk/core";
import { AwsJavaScriptSdkWorkshopStack } from "./aws-javascript-sdk-workshop-stack";

const app = new cdk.App();
new AwsJavaScriptSdkWorkshopStack(app, "aws-js-sdk-workshop");
