/**
 * Interface for the user data type return from the backend
 */
interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  admin: boolean;
  enabled: boolean;
}

export default IUser;
