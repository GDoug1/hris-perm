export type Employee = {
  employee_id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  personal_email?: string;
  position: string;
  account: string;
  cluster?: string;
  employee_type?: string;
  employment_status: string;
  date_hired: string;
  schedules: {
    day: string;
    shift_type: string;
    start: string;
    end: string;
    work_setup: string;
  }[];
};