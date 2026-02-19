import { Schema, model, Types, InferSchemaType } from "mongoose";

export const ATTENDANCE_STATUS = ["present", "absent"] as const;

const attendanceSchema = new Schema(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true, index: true },
    date: { type: Date, required: true, index: true },
    status: {
      type: String,
      enum: ATTENDANCE_STATUS,
      required: true,
      default: "present",
    },
  },
  {
    timestamps: true,
  },
);

attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

export type Attendance = InferSchemaType<typeof attendanceSchema> & { _id: Types.ObjectId };

export const AttendanceModel = model("Attendance", attendanceSchema);
