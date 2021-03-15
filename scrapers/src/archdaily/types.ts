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

export { ArchDailyResponse, ArchDailyProject, ArchDailyOffice };
