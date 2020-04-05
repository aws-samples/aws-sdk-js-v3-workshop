import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import { Table } from "@aws-cdk/aws-dynamodb";

export interface NotesApiProps {
  /** the dynamodb table to be passed to lambda function **/
  table: Table;
}

export class NotesApi extends cdk.Construct {
  /** allows accessing the counter function */
  public readonly handler: lambda.Function;

  constructor(scope: cdk.Construct, id: string, props: NotesApiProps) {
    super(scope, id);

    const { table } = props;

    this.handler = new lambda.Function(this, "Handler", {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: `${id}.handler`,
      code: lambda.Code.fromAsset("dist"),
      environment: {
        NOTES_TABLE_NAME: table.tableName,
      },
    });

    // grant the lambda role read/write permissions to notes table
    table.grantReadWriteData(this.handler);
  }
}
