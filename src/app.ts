import express from "express";
import cors from "cors";
import morgan from "morgan";
import employeeRoutes from "./routes/employee.routes";
import attendanceRoutes from "./routes/attendance.routes";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";
import { env } from "./config/env";

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
