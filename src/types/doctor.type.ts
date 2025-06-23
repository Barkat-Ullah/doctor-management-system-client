/* eslint-disable @typescript-eslint/no-explicit-any */
export interface DoctorSchedule {
  scheduleId: string;
  schedule: {
    startDateTime: string;
    endDateTime: string;
  };
  isBooked: boolean;
}

export interface Doctor {
  [x: string]: any;
  id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  contactNumber: string;
  address: string;
  age?: string;
  registrationNumber: string;
  experience: number;
  gender: "MALE" | "FEMALE" | "OTHER";
  appointmentFee: number;
  qualification: string;
  currentWorkingPlace: string;
  designation: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  doctorSpecialties?: DoctorSpecialty[];
  doctorSchedules?: DoctorSchedule[];
}

export interface DoctorSpecialty {
  specialtiesId: string;
  doctorId: string;
  specialties: Specialty;
}

export interface Specialty {
  id: string;
  title: string;
  icon?: string;
}

export interface DoctorPageProps {
  doctors: Doctor[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface DoctorQueryParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sort?: string;
  doctorSpecialties?: string;
  gender?: string;
  experience?: string;
}

export interface CreateDoctorFormData {
  name: string;
  email: string;
  password: string;
  contactNumber: string;
  address: string;
  age?: string;
  registrationNumber: string;
  experience: number;
  gender: "MALE" | "FEMALE" | "OTHER";
  appointmentFee: number;
  qualification: string;
  currentWorkingPlace: string;
  designation: string;
  doctorSpecialties: string[];
  profilePhoto?: File;
}

export interface CreateSpecialtyData {
  title: string;
  icon?: string;
}

export interface UpdateDoctorData {
  name?: string;
  contactNumber?: string;
  address?: string;
  age?: string;
  registrationNumber?: string;
  experience?: number;
  gender?: "MALE" | "FEMALE" | "OTHER";
  appointmentFee?: number;
  qualification?: string;
  currentWorkingPlace?: string;
  designation?: string;
  doctorSpecialties?: Array<{
    specialtiesId: string;
    isDeleted: boolean;
  }>;
}
