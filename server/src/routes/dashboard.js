import { Router } from "express";
import Attendance from "../models/Attendance.js";
import User from "../models/User.js";
import { requireAuth, requireManager } from "../middleware/auth.js";

const router = Router();

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const endOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);

router.get("/employee", requireAuth, async (req, res, next) => {
  try {
    const now = new Date();
    const ms = startOfMonth(now);
    const me = endOfMonth(now);
    const today = await Attendance.findOne({ userId: req.user._id, date: { $gte: startOfDay(now), $lte: endOfDay(now) } }).lean();
    const items = await Attendance.find({ userId: req.user._id, date: { $gte: ms, $lte: me } }).sort({ date: -1 }).lean();
    const present = items.filter(i => i.status === "present").length;
    const late = items.filter(i => i.status === "late").length;
    const half = items.filter(i => i.status === "half-day").length;
    const hours = items.reduce((a, b) => a + (b.totalHours || 0), 0);
    const recent = await Attendance.find({ userId: req.user._id }).sort({ date: -1 }).limit(7).lean();
    res.json({ today: { checkedIn: !!today?.checkInTime, checkedOut: !!today?.checkOutTime }, present, absent: 0, late, totalHours: parseFloat(hours.toFixed(2)), recent });
  } catch (e) {
    next(e);
  }
});

router.get("/manager", requireAuth, requireManager, async (req, res, next) => {
  try {
    const now = new Date();
    const s = startOfDay(now);
    const e = endOfDay(now);
    const totalEmployees = await User.countDocuments({ role: "employee" });
    const todayItems = await Attendance.find({ date: { $gte: s, $lte: e } }).populate({ path: "userId", select: "department" }).lean();
    const present = todayItems.filter(i => i.status === "present").length;
    const late = todayItems.filter(i => i.status === "late").length;
    const absent = totalEmployees - todayItems.length;
    const weekly = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const ds = startOfDay(d);
      const de = endOfDay(d);
      const count = await Attendance.countDocuments({ date: { $gte: ds, $lte: de } });
      weekly.push({ date: ds, count });
    }
    const deptMap = {};
    for (const item of todayItems) {
      const k = item.userId?.department || "";
      deptMap[k] = (deptMap[k] || 0) + 1;
    }
    const dept = Object.entries(deptMap).map(([name, count]) => ({ name, count }));
    const absentList = await User.find({ role: "employee", _id: { $nin: todayItems.map(i => i.userId?._id).filter(Boolean) } }).select("name email employeeId department").lean();
    res.json({ totalEmployees, today: { present, absent, late }, weekly, department: dept, absentList });
  } catch (e) {
    next(e);
  }
});

export default router;

