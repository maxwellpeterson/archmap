import { SQSEvent, Context } from "aws-lambda";
import { JSDOM } from "jsdom";
import { ArchdailyProject, ArchdailyProjectWithAddress } from "archdaily/types";

const ADDRESS_QUERY = ".nrd-single-map__address span";

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

  const projectAddress = await fetchProjectAddress(project.url);

  const projectWithAddress: ArchdailyProjectWithAddress = {
    ...project,
    address: projectAddress,
  };

  // Check if address exists:
  //   If exists, send to geocoding API queue
  //   Else, send to find place API queue
};

const fetchProjectAddress = async (url: string): Promise<string | null> => {
  try {
    const dom = await JSDOM.fromURL(url);
    return (
      dom.window.document.querySelector(ADDRESS_QUERY)?.textContent || null
    );
  } catch (error) {
    return null;
  }
};

// Fetch project page and parse out address string

// Make request to google maps with address string

export { scrapeProjectLocation };
