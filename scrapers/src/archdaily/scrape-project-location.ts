import { SQSEvent, Context } from "aws-lambda";
import axios from "axios";
import { JSDOM } from "jsdom";
import { ArchdailyProject, ArchdailyProjectWithAddress } from "./types";

const scrapeProjectLocation = async (event: SQSEvent, context: Context) => {
  if (event.Records.length !== 1) {
    throw new Error(
      `Received ${event.Records.length} records, but scrapeProjectLocation requires exactly one.`
    );
  }

  const project: ArchdailyProject = JSON.parse(event.Records[0].body);

  if (!project.url) {
    console.log("No url found for project:", project);
    return;
  }

  const projectAddress = fetchProjectAddress(project.url);

  const projectWithAddress: ArchdailyProjectWithAddress = {
    ...project,
    address: projectAddress,
  };

  // Push updated project into new queue
};

const fetchProjectAddress = async (url: string): string | null => {
  try {
    const response = await axios.get<string>(url);
    const document = new JSDOM(response.data);
    // Find CSS selector from old project
  } catch (error) {}
};

// Fetch project page and parse out address string

// Make request to google maps with address string

export { scrapeProjectLocation };
