import {
  DynamoDBClient,
  BatchWriteItemCommand,
  BatchWriteItemInput,
  WriteRequest,
} from "@aws-sdk/client-dynamodb";
import axios from "axios";

interface ArchDailyResponse {
  results: ArchDailyProject[];
}

interface ArchDailyProject {
  document_id: string;
  title: string;
  offices: ArchDailyOffice[];
  year: string;
  url: string;
}

interface ArchDailyOffice {
  name: string;
  url: string;
}

const handler = async (): Promise<void> => {
  const archDailyProjects: ArchDailyProject[] = await fetchArchDailyProjects(1);

  if (archDailyProjects.length > 0) {
    writeArchDailyProjects(archDailyProjects);
  }
};

const fetchArchDailyProjects = async (
  archDailyPageNumber: number
): Promise<ArchDailyProject[]> => {
  try {
    const response = await axios.get<ArchDailyResponse>(
      `https://www.archdaily.com/search/api/v1/us/projects?page=${archDailyPageNumber}`
    );
    return response.data.results;
  } catch (error) {
    console.log("Failed to fetch projects:", error);
    return [];
  }
};

const writeArchDailyProjects = async (
  archDailyProjects: ArchDailyProject[]
): Promise<void> => {
  const tableName: string = process.env.ARCHDAILY_TABLE_NAME || "";

  const writeCommand: BatchWriteItemInput = {
    RequestItems: {
      [tableName]: formatArchDailyProjects(archDailyProjects),
    },
  };

  const dbclient = new DynamoDBClient({ region: "us-east-1" }); // process.env.AWS_REGION

  try {
    const data = await dbclient.send(new BatchWriteItemCommand(writeCommand));
    console.log("Succesfully wrote items:", data);
  } catch (error) {
    console.log("Failed to write items:", error);
  }
};

/* Important note from AWS docs: "Numbers are sent across the network to
 * DynamoDB as strings, to maximize compatibility across languages and
 * libraries. However, DynamoDB treats them as number type attributes for
 * mathematical operations."
 *
 * https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_AttributeValue.html
 *
 * This is why `KEY` is labeled as an "N" type even though `document_id` is a
 * string.
 */
const formatArchDailyProjects = (
  archDailyProjects: ArchDailyProject[]
): WriteRequest[] => {
  return archDailyProjects.map(
    ({ document_id, title, offices, year, url }) => ({
      PutRequest: {
        Item: {
          ID: { N: document_id },
          TITLE: { S: title },
          ARCHITECTS: { SS: offices.map(({ name }) => name) },
          YEAR: { N: year },
          url: { S: url },
        },
      },
    })
  );
};

export { handler };
