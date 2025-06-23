/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  scheduleId: string;
  videoCallingId: string;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  doctor: {
    id: string;
    name: string;
    email: string;
    profilePhoto?: string;
    appointmentFee: number;
    qualification: string;
    designation: string;
    contactNumber: string;
  };
  patient: {
    id: string;
    name: string;
    email: string;
    profilePhoto?: string;
    contactNumber?: string;
  };
  schedule: {
    id: string;
    startDateTime: string;
    endDateTime: string;
  };
  payment?: {
    id: string;
    amount: number;
    transactionId: string;
    status: PaymentStatus;
    paymentGatewayData?: any;
  };
  prescription?: {
    id: string;
    instructions: string;
    followUpDate?: string;
  };
  review?: {
    id: string;
    rating: number;
    comment: string;
  };
}

export type AppointmentStatus =
  | "SCHEDULED"
  | "INPROGRESS"
  | "COMPLETED"
  | "CANCELED";
export type PaymentStatus = "PAID" | "UNPAID";

export interface CreateAppointmentData {
  doctorId: string;
  scheduleId: string;
}

export interface AppointmentQueryParams {
  status?: AppointmentStatus;
  paymentStatus?: PaymentStatus;
  patientEmail?: string;
  doctorEmail?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface AppointmentMeta {
  total: number;
  page: number;
  limit: number;
}
