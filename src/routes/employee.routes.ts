import { Router } from "express";
import {
  createEmployee,
  deleteEmployee,
  getEmployees,
} from "../controllers/employee.controller";

const router = Router();

router.post("/", createEmployee);
router.get("/", getEmployees);
router.delete("/:id", deleteEmployee);

export default router;
