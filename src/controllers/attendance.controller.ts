import { Request, Response } from "express";
import { AttendanceModel } from "../models/attendance.model";
import { EmployeeModel } from "../models/employee.model";
import { ApiError, asyncHandler } from "../utils/api";
import {
  attendanceQuerySchema,
  createAttendanceSchema,
  updateAttendanceSchema,
} from "../utils/validation";

export const createAttendance = asyncHandler(async (req: Request, res: Response) => {
  const payload = createAttendanceSchema.parse(req.body);
  const normalizedDate = new Date(payload.date);
  normalizedDate.setUTCHours(0, 0, 0, 0);

  const employeeExists = await EmployeeModel.exists({ _id: payload.employeeId });
  if (!employeeExists) {
    throw new ApiError(404, "Employee not found");
  }

  const attendance = await AttendanceModel.findOneAndUpdate(
    { employeeId: payload.employeeId, date: normalizedDate },
    { $set: { status: payload.status, date: normalizedDate } },
    {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  ).lean();

  res.status(200).json(attendance);
});

export const getAttendance = asyncHandler(async (req: Request, res: Response) => {
  const queryParams = attendanceQuerySchema.parse(req.query);
  const query: Record<string, unknown> = {};

  if (queryParams.employeeId) {
    query.employeeId = queryParams.employeeId;
  }

  if (queryParams.status) {
    query.status = queryParams.status;
  }

  if (queryParams.from || queryParams.to) {
    query.date = {};

    if (queryParams.from) {
      (query.date as Record<string, Date>).$gte = queryParams.from;
    }

    if (queryParams.to) {
      (query.date as Record<string, Date>).$lte = queryParams.to;
    }
  }

  const records = await AttendanceModel.find(query)
    .populate("employeeId", "fullName employeeCode department email")
    .sort({ date: -1 })
    .lean();

  res.status(200).json(records);
});

export const getAttendanceByEmployee = asyncHandler(async (req: Request, res: Response) => {
  const { employeeId } = req.params;

  const employeeExists = await EmployeeModel.exists({ _id: employeeId });
  if (!employeeExists) {
    throw new ApiError(404, "Employee not found");
  }

  const records = await AttendanceModel.find({ employeeId })
    .populate("employeeId", "fullName employeeCode department email")
    .sort({ date: -1 })
    .lean();

  res.status(200).json(records);
});

export const updateAttendance = asyncHandler(async (req: Request, res: Response) => {
  const payload = updateAttendanceSchema.parse(req.body);

  const record = await AttendanceModel.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  }).lean();

  if (!record) {
    throw new ApiError(404, "Attendance not found");
  }

  res.status(200).json(record);
});
