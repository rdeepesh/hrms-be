import { Schema, model, Types, InferSchemaType } from "mongoose";

export const DEPARTMENTS = [
  "Engineering",
  "Human Resources",
  "Finance",
  "Marketing",
  "Sales",
  "Operations",
] as const;

const employeeSchema = new Schema(
  {
    employeeCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      match: [/^EMP\d{3}$/, "employeeCode must be in EMP001 format"],
    },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    department: {
      type: String,
      required: true,
      enum: DEPARTMENTS,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

employeeSchema.index({ fullName: 1 });

export type Employee = InferSchemaType<typeof employeeSchema> & { _id: Types.ObjectId };

export const EmployeeModel = model("Employee", employeeSchema);