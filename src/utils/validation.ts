import { z } from "zod";
import { ATTENDANCE_STATUS } from "../models/attendance.model";
import { DEPARTMENTS } from "../models/employee.model";

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid MongoDB ObjectId");

const employeeCodeSchema = z
  .string()
  .trim()
  .regex(/^EMP\d{3}$/, "employeeCode must be in EMP001 format")
  .transform((value) => value.toUpperCase());

export const createEmployeeSchema = z.object({
  employeeCode: employeeCodeSchema,
  fullName: z
    .string()
    .trim()
    .min(2, "fullName is required")
    .max(100, "fullName is too long")
    .regex(/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/, "fullName contains invalid characters"),
  email: z.string().trim().email("Invalid email format").transform((value) => value.toLowerCase()),
  department: z.enum(DEPARTMENTS, {
    errorMap: () => ({
      message:
        "department must be one of: Engineering, Human Resources, Finance, Marketing, Sales, Operations",
    }),
  }),
});

export const createAttendanceSchema = z.object({
  employeeId: objectIdSchema,
  date: z.coerce.date(),
  status: z.enum(ATTENDANCE_STATUS).default("present"),
});

export const updateAttendanceSchema = createAttendanceSchema.partial().omit({ employeeId: true });

export const attendanceQuerySchema = z.object({
  employeeId: objectIdSchema.optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  status: z.enum(ATTENDANCE_STATUS).optional(),
});
