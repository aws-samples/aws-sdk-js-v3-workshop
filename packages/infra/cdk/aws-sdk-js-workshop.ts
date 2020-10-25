import * as cdk from "@aws-cdk/core";
import { AwsSdkJsWorkshopStack } from "./aws-sdk-js-workshop-stack";

const app = new cdk.App();
new AwsSdkJsWorkshopStack(app, "aws-sdk-js-workshop");
