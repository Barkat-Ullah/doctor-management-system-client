export interface Patient {
  id: string;
  name: string;
  email: string;
  contactNumber?: string | null;
  address?: string | null;
  profilePhoto?: string | null;
  age?: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  patientHealthCare?: PatientHealthCare | null;
  medicalReport?: MedicalReport[] | null;
}

export interface PatientHealthCare {
  id: string;
  patientId: string;
  gender: "MALE" | "FEMALE";
  dateOfBirth: string;
  bloodGroup:
    | "A_POSITIVE"
    | "B_POSITIVE"
    | "O_POSITIVE"
    | "AB_POSITIVE"
    | "A_NEGATIVE"
    | "B_NEGATIVE"
    | "O_NEGATIVE"
    | "AB_NEGATIVE";
  hasAllergies?: boolean | null;
  hasDiabetes?: boolean | null;
  height: string;
  weight: string;
  smokingStatus?: boolean | null;
  dietaryPreferences?: string | null;
  pregnancyStatus?: boolean | null;
  mentalHealthHistory?: string | null;
  immunizationStatus?: string | null;
  hasPastSurgeries?: boolean | null;
  recentAnxiety?: boolean | null;
  recentDepression?: boolean | null;
  maritalStatus: "MARRIED" | "UNMARRIED";
  createdAt: string;
  updatedAt: string;
}

export interface MedicalReport {
  id: string;
  patientId: string;
  reportName: string;
  reportLink: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientQueryParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface UpdatePatientData {
  name?: string;
  contactNumber?: string;
  address?: string;
  age?: string;
  patientHealthCare?: {
    gender?: "MALE" | "FEMALE";
    dateOfBirth?: string;
    bloodGroup?:
      | "A_POSITIVE"
      | "B_POSITIVE"
      | "O_POSITIVE"
      | "AB_POSITIVE"
      | "A_NEGATIVE"
      | "B_NEGATIVE"
      | "O_NEGATIVE"
      | "AB_NEGATIVE";
    hasAllergies?: boolean;
    hasDiabetes?: boolean;
    height?: string;
    weight?: string;
    smokingStatus?: boolean;
    dietaryPreferences?: string;
    pregnancyStatus?: boolean;
    mentalHealthHistory?: string;
    immunizationStatus?: string;
    hasPastSurgeries?: boolean;
    recentAnxiety?: boolean;
    recentDepression?: boolean;
    maritalStatus?: "MARRIED" | "UNMARRIED";
  };
}

// Role-based field access
export interface RolePermissions {
  canView: string[];
  canEdit: string[];
}

export const rolePermissions: Record<string, RolePermissions> = {
  ADMIN: {
    canView: ["*"], // সব কিছু দেখতে পারবে
    canEdit: [
      "name",
      "contactNumber",
      "address",
      "age",
      "patientHealthCare.*",
      "isDeleted",
    ],
  },
  DOCTOR: {
    canView: [
      "name",
      "email",
      "contactNumber",
      "address",
      "age",
      "profilePhoto",
      "patientHealthCare.*",
      "medicalReport.*",
    ],
    canEdit: [
      "patientHealthCare.height",
      "patientHealthCare.weight",
      "patientHealthCare.hasAllergies",
      "patientHealthCare.hasDiabetes",
      "patientHealthCare.mentalHealthHistory",
      "medicalReport.add",
    ],
  },
  PATIENT: {
    canView: [
      "name",
      "email",
      "contactNumber",
      "address",
      "age",
      "profilePhoto",
      "patientHealthCare.*",
      "medicalReport.*",
    ],
    canEdit: [
      "name",
      "contactNumber",
      "address",
      "profilePhoto",
      "patientHealthCare.height",
      "patientHealthCare.weight",
      "patientHealthCare.dietaryPreferences",
    ],
  },
};
