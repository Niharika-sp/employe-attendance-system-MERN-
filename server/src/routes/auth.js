import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const SECRET = process.env.JWT_SECRET || "dev-secret";

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, role, employeeId, department } = req.body;
    if (!name || !email || !password || !employeeId) return res.status(400).json({ error: "Invalid input" });
    const exists = await User.findOne({ $or: [{ email }, { employeeId }] });
    if (exists) return res.status(409).json({ error: "User exists" });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, role: role || "employee", employeeId, department });
    const token = jwt.sign({ id: user._id, role: user.role }, SECRET, { expiresIn: "7d" });
    res.status(201).json({ token });
  } catch (e) {
    next(e);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ id: user._id, role: user.role }, SECRET, { expiresIn: "7d" });
    res.json({ token });
  } catch (e) {
    next(e);
  }
});

router.get("/me", requireAuth, async (req, res) => {
  const { _id, name, email, role, employeeId, department, createdAt } = req.user;
  res.json({ id: _id, name, email, role, employeeId, department, createdAt });
});

export default router;
