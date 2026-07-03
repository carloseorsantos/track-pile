import { Currency, JobStatus } from "./tokens";

export type Job = {
  id: string;
  company: string;
  role: string;
  status: JobStatus;
  link: string | null;
  source: string;
  appliedAt: Date | null;
  nextDate: Date | null;
  salary: string | null;
  salaryCurrency: Currency | null;
  notes: string | null;
};
