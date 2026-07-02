import { JobStatus } from "./tokens";

export type Job = {
  id: string;
  company: string;
  role: string;
  status: JobStatus;
  link: string | null;
  source: string;
  appliedAt: string | null;
  nextDate: string | null;
  salary: string | null;
  notes: string | null;
};
