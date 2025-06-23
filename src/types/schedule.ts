export interface Schedule {
  id: string;
  startDateTime: string;
  endDateTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScheduleRequest {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

export interface ScheduleFilters {
  startDate?: string;
  endDate?: string;
}

export interface ScheduleResponse {
  success: boolean;
  message: string;
  data: {
    meta: {
      total: number;
      page: number;
      limit: number;
    };
    data: Schedule[];
  };
}
