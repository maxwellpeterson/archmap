import {
  DynamoDBClient,
  BatchWriteItemCommand,
  BatchWriteItemInput,
  WriteRequest,
} from "@aws-sdk/client-dynamodb";
import axios from "axios";
import { ArchdailyResponse, ArchdailyProject } from "./types";

const scrapeProjects = async (): Promise<void> => {
  const archDailyProjects: ArchdailyProject[] = await fetchArchDailyProjects(1);
  console.log(`Found ${archDailyProjects.length} projects:`, archDailyProjects);

  if (archDailyProjects.length > 0) {
    await writeArchDailyProjects(archDailyProjects);
  }
};

const fetchArchDailyProjects = async (
  archDailyPageNumber: number
): Promise<ArchdailyProject[]> => {
  try {
    const response = await axios.get<ArchdailyResponse>(
      `https://www.archdaily.com/search/api/v1/us/projects?page=${archDailyPageNumber}`
    );
    return response.data.results;
  } catch (error) {
    console.log("Failed to fetch projects:", error);
    return [];
  }
};

const writeArchDailyProjects = async (
  archDailyProjects: ArchdailyProject[]
): Promise<void> => {
  const tableName: string = process.env.ARCHDAILY_TABLE_NAME || "";

  const writeCommand: BatchWriteItemInput = {
    RequestItems: {
      [tableName]: formatArchDailyProjects(archDailyProjects),
    },
  };

  const dbclient = new DynamoDBClient({ region: "us-east-1" }); // process.env.AWS_REGION (???)

  try {
    const data = await dbclient.send(new BatchWriteItemCommand(writeCommand));
    console.log("Succesfully wrote items:", data);
  } catch (error) {
    console.log("Failed to write items:", error);
  }
};

/* Important note from the AWS docs: "Numbers are sent across the network to
 * DynamoDB as strings, to maximize compatibility across languages and
 * libraries. However, DynamoDB treats them as number type attributes for
 * mathematical operations."
 *
 * https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_AttributeValue.html
 *
 * This is why `KEY` is labeled as an "N" type even though `document_id` is a
 * string. `YEAR` is treated in the same way.
 *
 * Another important note: "When you add an item, the primary key attributes are
 * the only required attributes. Attribute values cannot be null. Empty String
 * and Binary attribute values are allowed. Attribute values of type String and
 * Binary must have a length greater than zero if the attribute is used as a key
 * attribute for a table or index. Set type attributes cannot be empty."
 *
 * https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html
 *
 * To prevent write requests from being rejected, undefined and empty attributes
 * need to be dropped from the item object.
 */
const formatArchDailyProjects = (
  archDailyProjects: ArchdailyProject[]
): WriteRequest[] => {
  return archDailyProjects.map(
    ({ document_id, title, offices, year, url }) => ({
      PutRequest: {
        Item: {
          ID: { N: document_id },
          TITLE: { S: title },
          ARCHITECTS: { SS: offices.map(({ name }) => name) },
          YEAR: { N: year },
          URL: { S: url },
        },
      },
    })
  );
};

export { scrapeProjects };
