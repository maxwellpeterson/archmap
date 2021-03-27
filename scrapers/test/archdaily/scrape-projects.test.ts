import { mocked } from "ts-jest/utils";

// import { scrapeProjects } from "archdaily";

// import { SQSClient } from "@aws-sdk/client-sqs";
import axios from "axios";

// jest.mock("@aws-sdk/client-sqs");
// const mockedSqsClient = mocked(SQSClient, true);

jest.mock("axios");
const mockedAxios = mocked(axios, true);

// Between each test, we want to reset mocks and clear any implementations,
// but ideally preserve the mocks themselves

// For some reason, it's picking up three test suites, two of which fail...

test("test test", () => {
  mockedAxios.get("oop");
  expect(mockedAxios.get).toHaveBeenCalledTimes(1);
});
