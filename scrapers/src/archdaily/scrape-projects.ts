import {
  SendMessageBatchCommand,
  SendMessageBatchRequestEntry,
  SQSClient,
} from "@aws-sdk/client-sqs";
import { SQSEvent, Context } from "aws-lambda";
import axios from "axios";
import { splitEvery } from "ramda";
import {
  ArchdailyResponse,
  ArchdailyProject,
  UrlMessageBody,
} from "archdaily/types";

/* Unfortunately, is doesn't look like this is exported as a constant from the
 * `@aws-sdk/client-sqs` package, which might be nice.
 *
 * https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-batch-api-actions.html
 */
const MAX_MESSAGES_PER_BATCH = 10;

const scrapeProjects = async (event: SQSEvent, context: Context) => {
  if (event.Records.length !== 1) {
    throw new Error(
      `Received ${event.Records.length} records, but scrapeProjects requires exactly one.`
    );
  }

  const messageBody: UrlMessageBody = JSON.parse(event.Records[0].body);
  const archDailyProjects: ArchdailyProject[] = await fetchArchdailyProjects(
    messageBody.url
  );

  if (archDailyProjects.length > 0) {
    await pushArchdailyProjects(archDailyProjects);
  }
};

/* Fetches a list of projects from the ArchDaily API, using the given API URL.
 * Returns an empty list if the API request returns an error, or if the reponse
 * does not include a field for project results.
 */
const fetchArchdailyProjects = async (
  archdailyApiUrl: string
): Promise<ArchdailyProject[]> => {
  try {
    const response = await axios.get<ArchdailyResponse>(archdailyApiUrl);
    if (!response.data.results) {
      console.log(
        `Response from ${archdailyApiUrl} does not include a \`results\` field.`
      );
    }
    return response.data.results || [];
  } catch (error) {
    console.error(`Failed to fetch projects from ${archdailyApiUrl}.`, error);
    return [];
  }
};

const pushArchdailyProjects = async (projects: ArchdailyProject[]) => {
  const sqsClient = new SQSClient({ region: process.env.AWS_REGION });

  const commands = prepareCommands(projects);

  /* It would be good to do some more detailled error checking and logging here.
   * There are multiple levels of potential failure. Entire batch requests can
   * fail, and individual messages within those batch requests can also fail
   * independently.
   *
   * https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_SendMessageBatch.html
   */
  try {
    await Promise.allSettled(
      commands.map(async (command) => await sqsClient.send(command))
    );
  } catch (error) {
    console.error("Failed to send message batch:", error);
  }
};

const prepareCommands = (
  projects: ArchdailyProject[]
): SendMessageBatchCommand[] => {
  const projectBatches: ArchdailyProject[][] = splitEvery(
    MAX_MESSAGES_PER_BATCH,
    projects
  );

  return projectBatches.map(prepareBatch);
};

const prepareBatch = (
  projects: ArchdailyProject[]
): SendMessageBatchCommand => {
  if (!process.env.OUTPUT_QUEUE_URL) {
    throw new Error("Missing environment variable: OUTPUT_QUEUE_URL");
  }

  return new SendMessageBatchCommand({
    Entries: projects.map(prepareBatchEntry),
    QueueUrl: process.env.OUTPUT_QUEUE_URL,
  });
};

/* I'm not exactly sure what will happen if `project.document_id` is undefined.
 * The `SendMessageBatchRequestEntry` type allows for `Id` to be `undefined`
 * (event though it is a required property) but doesn't specify any particular
 * behavior.
 *
 * https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_SendMessageBatchRequestEntry.html
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/modules/sendmessagebatchrequestentry.html
 */
const prepareBatchEntry = (
  project: ArchdailyProject
): SendMessageBatchRequestEntry => ({
  Id: project.document_id,
  MessageBody: JSON.stringify(project),
});

export { scrapeProjects };
