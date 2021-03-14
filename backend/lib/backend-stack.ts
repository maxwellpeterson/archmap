import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as dynamodb from "@aws-cdk/aws-dynamodb";

export class BackendStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const archDailyTable = new dynamodb.Table(this, "Projects", {
      partitionKey: { name: "id", type: dynamodb.AttributeType.NUMBER },
    });

    const archDailyApiLambda = new lambda.Function(this, "ArchDailyApi", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "archdaily-api.handler",
      code: lambda.Code.fromCfnParameters(),
      environment: {
        ARCHDAILY_TABLE_NAME: archDailyTable.tableName,
      },
    });
  }
}
