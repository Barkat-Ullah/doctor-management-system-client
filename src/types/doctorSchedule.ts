export interface DoctorSchedule {
  id: string;
  doctorId: string;
  scheduleId: string;
  isBooked: boolean;
  appointmentId?: string;
  createdAt: string;
  updatedAt: string;
  doctor?: {
    id: string;
    name: string;
    email: string;
    contactNumber: string;
    registrationNumber: string;
  };
  schedule?: {
    id: string;
    startDateTime: string;
    endDateTime: string;
  };
}

export interface DoctorScheduleFilters {
  searchTerm?: string;
  isBooked?: boolean;
  doctorId?: string;
  startDate?: string;
  endDate?: string;
}

export interface AssignScheduleRequest {
  scheduleIds: string[];
}

export interface DoctorScheduleResponse {
  success: boolean;
  message: string;
  data: {
    meta: {
      total: number;
      page: number;
      limit: number;
    };
    data: DoctorSchedule[];
  };
}
