import { OrganizationInterface } from "../schema/organisation.model";
import { UserInterface } from "../schema/user.model";

// this is for Request Global Typescript
declare global {
  namespace Express {
    interface Request {
      authUser?: Pick<
        UserInterface,
        "_id" | "email" | "name" | "organisationId"
      >;
      organisation?: OrganizationInterface;
    }
  }
}
