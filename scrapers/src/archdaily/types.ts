interface ArchdailyResponse {
  results: ArchdailyProject[];
}

interface ArchdailyProject {
  document_id: string;
  title: string;
  offices: ArchdailyOffice[];
  year: string;
  url: string;
}

interface ArchdailyOffice {
  name: string;
  url: string;
}

export { ArchdailyResponse, ArchdailyProject, ArchdailyOffice };
