import {
  DynamoDBClient,
  BatchWriteItemCommand,
  WriteRequest,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { ArchdailyProject } from "./types";

const writeArchDailyProjects = async (
  archDailyProjects: ArchdailyProject[]
) => {
  const tableName: string = process.env.ARCHDAILY_TABLE_NAME || "";

  const writeCommand = new BatchWriteItemCommand({
    RequestItems: {
      [tableName]: archDailyProjects.map(prepareArchdailyProject),
    },
  });

  // Does process.env.AWS_REGION exist?
  const ddbClient = new DynamoDBClient({ region: "us-east-1" });

  try {
    const data = await ddbClient.send(writeCommand);
    console.log("Succesfully wrote items:", data);
  } catch (error) {
    console.error("Failed to write items:", error);
  }
};

const prepareArchdailyProject = ({
  document_id,
  title,
  offices,
  year,
  url,
}: ArchdailyProject): WriteRequest => ({
  PutRequest: {
    Item: marshall(
      {
        id: document_id,
        title,
        architects: offices ? offices.map(({ name }) => name) : null,
        year,
        url,
      },
      {
        convertEmptyValues: true,
        removeUndefinedValues: true,
      }
    ),
  },
});
