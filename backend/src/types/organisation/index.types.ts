export interface OnBoardOrganisationBody {
  name: string;
  email: string;
  website: string;
  isActive: boolean;
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

export interface AddOrganisationApiKeyBody {
  gemini: string;
  openrouter: string;
}
