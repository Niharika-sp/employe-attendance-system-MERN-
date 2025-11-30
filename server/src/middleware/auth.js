import jwt from "jsonwebtoken";
import User from "../models/User.js";

const SECRET = process.env.JWT_SECRET || "dev-secret";

export const requireAuth = async (req, res, next) => {
  try {
    const h = req.headers.authorization || "";
    const token = h.startsWith("Bearer ") ? h.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const payload = jwt.verify(token, SECRET);
    const user = await User.findById(payload.id).lean();
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

export const requireManager = (req, res, next) => {
  if (req.user?.role !== "manager") return res.status(403).json({ error: "Forbidden" });
  next();
};
