export interface SupportRequest {
  id: string;
  patientName: string;
  email: string;
  phone: string;
  queryType: string;
  patientId?: string;
  issueDescription: string;
  status: SupportStatus;
  createdAt: string;
  updatedAt: string;
  assignedToStaff?: string;
  responseNotes?: string;
}

export enum SupportStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
}

export interface CreateSupportRequestData {
  name: string;
  email: string;
  phone: string;
  queryType: string;
  patientId?: string;
  issueDescription: string;
}

export interface UpdateSupportRequestData {
  status?: SupportStatus;
  assignedToStaff?: string;
  responseNotes?: string;
}

export interface SupportQueryParams {
  status?: string;
  patientName?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}
