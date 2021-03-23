interface ArchdailyResponse {
  results?: ArchdailyProject[];
}

interface ArchdailyProject {
  document_id?: string;
  title?: string;
  offices?: ArchdailyOffice[];
  year?: string;
  url?: string;
}

interface ArchdailyProjectWithAddress extends ArchdailyProject {
  address: string | null;
}

interface ArchdailyOffice {
  name?: string;
  url?: string;
}

interface ArchmapProject {
  id: string;
  title: string;
  architects: string[];
  year: string;
  image: ArchmapImage;
  urls: ArchmapUrls;
}

interface ArchmapUrls {
  archdaily: string;
}

interface ArchmapImage {
  medium: string;
  large: string;
}

interface UrlMessageBody {
  url: string;
}

export {
  ArchdailyResponse,
  ArchdailyProject,
  ArchdailyProjectWithAddress,
  ArchdailyOffice,
  UrlMessageBody,
};
