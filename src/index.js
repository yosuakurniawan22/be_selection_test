import "dotenv/config";
import express from "express";
import AuthRoutes from "./routes/auth.route.js";
import AttendanceRoutes from "./routes/attendance.route.js";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Test Server"})
});

app.use("/api", AuthRoutes);
app.use("/api", AttendanceRoutes);

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});