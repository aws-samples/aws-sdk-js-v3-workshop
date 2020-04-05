import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import { Table } from "@aws-cdk/aws-dynamodb";

export interface ApiConstructProps {
  /** the dynamodb table to be passed to lambda function **/
  table: Table;
}

export class ApiConstruct extends cdk.Construct {
  /** allows accessing the counter function */
  public readonly handler: lambda.Function;

  constructor(scope: cdk.Construct, id: string, props: ApiConstructProps) {
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
