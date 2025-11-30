import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import attendanceRoutes from "./routes/attendance.js";
import dashboardRoutes from "./routes/dashboard.js";
import error from "./middleware/error.js";

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(error);

export default app;

