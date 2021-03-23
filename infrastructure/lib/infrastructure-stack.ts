import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as ecr from "@aws-cdk/aws-ecr";
import * as sqs from "@aws-cdk/aws-sqs";
import * as lambdaEvents from "@aws-cdk/aws-lambda-event-sources";

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // const archdailyProjectsTable = new dynamodb.Table(
    //   this,
    //   "ArchdailyProjects",
    //   {
    //     partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
    //     removalPolicy: cdk.RemovalPolicy.DESTROY,
    //   }
    // );

    const inputQueue = new sqs.Queue(this, "TestInputQueue");
    const inputQueueEventSource = new lambdaEvents.SqsEventSource(inputQueue, {
      batchSize: 1,
    });

    const outputQueue = new sqs.Queue(this, "TestOutputQueue");

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
          tag: "queueing",
        }),
        handler: lambda.Handler.FROM_IMAGE,
        runtime: lambda.Runtime.FROM_IMAGE,
        environment: {
          OUTPUT_QUEUE_URL: outputQueue.queueUrl,
        },
      }
    );

    scrapeArchdailyProjectsFunction.addEventSource(inputQueueEventSource);

    outputQueue.grantSendMessages(scrapeArchdailyProjectsFunction);

    // Does this need read and write access? Or just write?
    // archdailyProjectsTable.grantReadWriteData(scrapeArchdailyProjectsFunction);
  }
}
