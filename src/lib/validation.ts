import { z } from "zod";
import { CURRENCY_ORDER, Currency, LANGUAGE_OPTIONS, Language, STATUS_ORDER } from "./tokens";

export const jobSchema = z.object({
  company: z.string().min(1, "Empresa é obrigatória").max(120),
  role: z.string().min(1, "Cargo é obrigatório").max(120),
  status: z.enum(STATUS_ORDER as [string, ...string[]]),
  source: z.enum(["LinkedIn", "Indicação", "Gupy", "Site da empresa", "Outro"]),
  link: z.string().url("Link inválido").or(z.literal("")).optional(),
  appliedAt: z.union([z.coerce.date(), z.null()]).optional(),
  nextDate: z.union([z.coerce.date(), z.null()]).optional(),
  salary: z.string().max(60).optional(),
  salaryCurrency: z
    .enum(CURRENCY_ORDER as [Currency, ...Currency[]])
    .optional()
    .nullable(),
  notes: z.string().max(2000).optional(),
});

export type JobInput = z.infer<typeof jobSchema>;

export const FREE_JOB_LIMIT = 15;

const LANGUAGE_VALUES = LANGUAGE_OPTIONS.map((o) => o.value) as [Language, ...Language[]];

export const profileSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório").max(120, "Nome muito longo"),
  language: z.enum(LANGUAGE_VALUES),
});

export type ProfileInput = z.infer<typeof profileSchema>;
