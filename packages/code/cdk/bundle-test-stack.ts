import * as cdk from "@aws-cdk/core";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as apigw from "@aws-cdk/aws-apigateway";
import { ApiConstruct } from "./api-construct";

export class BundleTestStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, "Notes", {
      partitionKey: { name: "noteId", type: dynamodb.AttributeType.STRING },
    });

    const api = new apigw.RestApi(this, "BundleTestStackEndpoint", {});
    const notes = api.root.addResource("notes");
    notes.addMethod(
      "GET",
      new apigw.LambdaIntegration(
        new ApiConstruct(this, "listNotes", {
          table,
        }).handler
      )
    );
    notes.addMethod(
      "POST",
      new apigw.LambdaIntegration(
        new ApiConstruct(this, "createNote", {
          table,
        }).handler
      )
    );

    const note = notes.addResource("{id}");
    note.addMethod(
      "GET",
      new apigw.LambdaIntegration(
        new ApiConstruct(this, "getNote", {
          table,
        }).handler
      )
    );
    note.addMethod(
      "PUT",
      new apigw.LambdaIntegration(
        new ApiConstruct(this, "updateNote", {
          table,
        }).handler
      )
    );
    note.addMethod(
      "DELETE",
      new apigw.LambdaIntegration(
        new ApiConstruct(this, "deleteNote", {
          table,
        }).handler
      )
    );
  }
}
