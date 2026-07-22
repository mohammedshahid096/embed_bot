export interface OrganisationAddressInterface {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface OrganisationDetailsInterface {
  _id: string;
  name: string;
  email: string;
  website: string;
  isActive: boolean;
  address: OrganisationAddressInterface;
  contact: string;
  description: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrganisationStateType {
  organisationDetails: OrganisationDetailsInterface | null;
  apiKeyAdded: boolean;
}
