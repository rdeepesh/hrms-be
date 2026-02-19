import { Request, Response } from "express";
import { AttendanceModel } from "../models/attendance.model";
import { EmployeeModel } from "../models/employee.model";
import { ApiError, asyncHandler } from "../utils/api";
import { createEmployeeSchema } from "../utils/validation";

export const createEmployee = asyncHandler(async (req: Request, res: Response) => {
  const payload = createEmployeeSchema.parse(req.body);

  const employee = await EmployeeModel.create(payload);
  res.status(201).json(employee);
});

export const getEmployees = asyncHandler(async (req: Request, res: Response) => {
  const { department, search } = req.query;

  const query: Record<string, unknown> = {};

  if (department && typeof department === "string") {
    query.department = department;
  }

  if (search && typeof search === "string") {
    query.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { employeeCode: { $regex: search, $options: "i" } },
    ];
  }

  const employees = await EmployeeModel.find(query).sort({ createdAt: -1 }).lean();
  res.status(200).json(employees);
});

export const deleteEmployee = asyncHandler(async (req: Request, res: Response) => {
  const employee = await EmployeeModel.findByIdAndDelete(req.params.id);

  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }

  await AttendanceModel.deleteMany({ employeeId: employee._id });

  res.status(204).send();
});
