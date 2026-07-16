export interface ProfileDetailsInterface {
  _id: string;
  email: string;
  name: string;
  authProvider?: "local" | "google" | "github";
  providerId?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  lastLoginAt: string;
  organisationId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileStateType {
  profileDetails: null | ProfileDetailsInterface;
}
