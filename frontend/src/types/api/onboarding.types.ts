export interface OnBoardOrganisationBody {
  name: string;
  email: string;
  website: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  contact: string;
  description: string;
}

export interface ScrapeOrganisationWebsiteUrlsBody {
  selectedUrls: string[];
}

export interface AddOrganisationApiKeyBody {
  gemini: string;
  openrouter: string;
}
