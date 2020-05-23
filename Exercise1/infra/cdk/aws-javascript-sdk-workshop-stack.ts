import * as cdk from "@aws-cdk/core";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as apigw from "@aws-cdk/aws-apigateway";
import { NotesApi } from "./notes-api";

export class AwsJavaScriptSdkWorkshopStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, "Notes", {
      partitionKey: { name: "noteId", type: dynamodb.AttributeType.STRING },
    });

    const api = new apigw.RestApi(this, "AwsJavaScriptSdkWorkshopEndpoint", {});
    const notes = api.root.addResource("notes");
    notes.addMethod(
      "GET",
      new apigw.LambdaIntegration(
        new NotesApi(this, "listNotes", {
          table,
          grantActions: ["dynamodb:Scan"],
        }).handler
      )
    );
    notes.addMethod(
      "POST",
      new apigw.LambdaIntegration(
        new NotesApi(this, "createNote", {
          table,
          grantActions: ["dynamodb:PutItem"],
        }).handler
      )
    );

    const note = notes.addResource("{id}");
    note.addMethod(
      "GET",
      new apigw.LambdaIntegration(
        new NotesApi(this, "getNote", {
          table,
          grantActions: ["dynamodb:GetItem"],
        }).handler
      )
    );
    note.addMethod(
      "PUT",
      new apigw.LambdaIntegration(
        new NotesApi(this, "updateNote", {
          table,
          grantActions: ["dynamodb:UpdateItem"],
        }).handler
      )
    );
    note.addMethod(
      "DELETE",
      new apigw.LambdaIntegration(
        new NotesApi(this, "deleteNote", {
          table,
          grantActions: ["dynamodb:DeleteItem"],
        }).handler
      )
    );
  }
}
