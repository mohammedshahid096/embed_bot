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
  onBoardingStage: "organizationDetails" | "websiteSetup" | "apiKeyAddition";
  createdAt: string;
  updatedAt: string;
}

export interface ChatBotDetailsInterface {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  organisationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatConfigGeneral {
  botName: string;
  welcomeMessage: string;
  inputPlaceholder: string;
}

export interface ChatConfigTheme {
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  borderRadius: number;
}

export interface ChatConfigButton {
  bgColor: string;
  textColor: string;
  borderRadius: number;
  width: number;
  maxWidth: number;
}

export interface ChatConfigInput {
  bgColor: string;
  textColor: string;
  borderColor: string;
  borderRadius: number;
}

export interface ChatConfigMessages {
  botBgColor: string;
  botTextColor: string;
  userBgColor: string;
  userTextColor: string;
}

export interface ChatConfig {
  general: ChatConfigGeneral;
  theme: ChatConfigTheme;
  button: ChatConfigButton;
  input: ChatConfigInput;
  messages: ChatConfigMessages;
}

export interface AISettings {
  systemPrompt: string;
  temperature: number;
  model: string;
}

export interface ChatBotInterface {
  _id: string;
  organizationId: OrganisationDetailsInterface;
  allowedDomains: string[];
  config: ChatConfig;
  ai: AISettings;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganisationStateType {
  organisationDetails: OrganisationDetailsInterface | null;
  chatBotDetails: ChatBotInterface | null;
}
