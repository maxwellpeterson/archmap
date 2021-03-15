import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as ecr from "@aws-cdk/aws-ecr";

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // const archDailyProjects = new dynamodb.Table(this, "ArchDailyProjects", {
    //   partitionKey: { name: "id", type: dynamodb.AttributeType.NUMBER },
    // });

    // const archDailyScraper = new lambda.Function(this, "ArchDailyScraper", {
    //   runtime: lambda.Runtime.NODEJS_14_X,
    //   handler: "archdaily-api.handler",
    //   code: lambda.Code.fromCfnParameters(),
    //   environment: {
    //     ARCHDAILY_TABLE_NAME: archDailyProjects.tableName,
    //   },
    // });

    const testFunctionImage = ecr.Repository.fromRepositoryName(
      this,
      "TestFunctionImage",
      "archmap-scrapers"
    );

    const testFunction = new lambda.Function(this, "TestFunction", {
      code: lambda.Code.fromEcrImage(testFunctionImage),
      handler: lambda.Handler.FROM_IMAGE,
      runtime: lambda.Runtime.FROM_IMAGE,
      environment: {
        TEST_MESSAGE: "Oopity",
      },
    });
  }
}
