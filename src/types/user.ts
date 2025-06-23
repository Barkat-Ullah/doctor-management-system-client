export interface IUser {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "PATIENT" | "DOCTOR";
  profilePhoto?: string;
  iat?: number;
  exp?: number;
}
