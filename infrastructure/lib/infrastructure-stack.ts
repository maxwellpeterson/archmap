import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as ecr from "@aws-cdk/aws-ecr";

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Set table to be deleted on resource destruction...
    const archdailyProjectsTable = new dynamodb.Table(
      this,
      "ArchdailyProjects",
      {
        partitionKey: { name: "id", type: dynamodb.AttributeType.NUMBER },
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }
    );

    const archmapScrapersRepository = ecr.Repository.fromRepositoryName(
      this,
      "ArchmapScrapers",
      "archmap-scrapers"
    );

    const scrapeArchdailyProjectsFunction = new lambda.Function(
      this,
      "ScrapeArchdailyProjects",
      {
        code: lambda.Code.fromEcrImage(archmapScrapersRepository, {
          cmd: ["archdaily.scrapeProjects"],
          tag: "latest",
        }),
        handler: lambda.Handler.FROM_IMAGE,
        runtime: lambda.Runtime.FROM_IMAGE,
        environment: {
          ARCHDAILY_TABLE_NAME: archdailyProjectsTable.tableName,
        },
      }
    );

    // Does this need read an write access? Or just write?
    archdailyProjectsTable.grantReadWriteData(scrapeArchdailyProjectsFunction);
  }
}
