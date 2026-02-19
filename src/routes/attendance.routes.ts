import { Router } from "express";
import {
  createAttendance,
  getAttendance,
  getAttendanceByEmployee,
  updateAttendance,
} from "../controllers/attendance.controller";

const router = Router();

router.get("/employee/:employeeId", getAttendanceByEmployee);
router.post("/", createAttendance);
router.get("/", getAttendance);
router.put("/:id", updateAttendance);

export default router;
