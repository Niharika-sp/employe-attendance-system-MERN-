import { Router } from "express";
import Attendance from "../models/Attendance.js";
import User from "../models/User.js";
import { requireAuth, requireManager } from "../middleware/auth.js";

const router = Router();

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const endOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);

router.post("/checkin", requireAuth, async (req, res, next) => {
  try {
    const now = new Date();
    const s = startOfDay(now);
    const e = endOfDay(now);
    const existing = await Attendance.findOne({ userId: req.user._id, date: { $gte: s, $lte: e } });
    if (existing && existing.checkInTime) return res.status(409).json({ error: "Already checked in" });
    const lateThreshold = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 15);
    const status = now > lateThreshold ? "late" : "present";
    const doc = existing
      ? await Attendance.findByIdAndUpdate(existing._id, { checkInTime: now, status }, { new: true })
      : await Attendance.create({ userId: req.user._id, date: now, checkInTime: now, status });
    res.status(201).json({ id: doc._id });
  } catch (e) {
    next(e);
  }
});

router.post("/checkout", requireAuth, async (req, res, next) => {
  try {
    const now = new Date();
    const s = startOfDay(now);
    const e = endOfDay(now);
    const doc = await Attendance.findOne({ userId: req.user._id, date: { $gte: s, $lte: e } });
    if (!doc || !doc.checkInTime) return res.status(400).json({ error: "Not checked in" });
    if (doc.checkOutTime) return res.status(409).json({ error: "Already checked out" });
    const total = (now - doc.checkInTime) / 3600000;
    const status = total < 4 ? "half-day" : doc.status || "present";
    await Attendance.findByIdAndUpdate(doc._id, { checkOutTime: now, totalHours: parseFloat(total.toFixed(2)), status });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

router.get("/my-history", requireAuth, async (req, res, next) => {
  try {
    const { month, year, page = 1, limit = 30 } = req.query;
    const now = new Date();
    const m = month ? parseInt(month) - 1 : now.getMonth();
    const y = year ? parseInt(year) : now.getFullYear();
    const s = new Date(y, m, 1);
    const e = new Date(y, m + 1, 0, 23, 59, 59, 999);
    const q = { userId: req.user._id, date: { $gte: s, $lte: e } };
    const docs = await Attendance.find(q).sort({ date: -1 }).skip((page - 1) * limit).limit(parseInt(limit)).lean();
    const total = await Attendance.countDocuments(q);
    res.json({ items: docs, total });
  } catch (e) {
    next(e);
  }
});

router.get("/my-summary", requireAuth, async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const now = new Date();
    const m = month ? parseInt(month) - 1 : now.getMonth();
    const y = year ? parseInt(year) : now.getFullYear();
    const s = new Date(y, m, 1);
    const e = new Date(y, m + 1, 0, 23, 59, 59, 999);
    const docs = await Attendance.find({ userId: req.user._id, date: { $gte: s, $lte: e } }).lean();
    const present = docs.filter(d => d.status === "present").length;
    const late = docs.filter(d => d.status === "late").length;
    const half = docs.filter(d => d.status === "half-day").length;
    const hours = docs.reduce((a, b) => a + (b.totalHours || 0), 0);
    res.json({ present, late, halfDay: half, totalHours: parseFloat(hours.toFixed(2)) });
  } catch (e) {
    next(e);
  }
});

router.get("/today", requireAuth, async (req, res, next) => {
  try {
    const today = new Date();
    const s = startOfDay(today);
    const e = endOfDay(today);
    const doc = await Attendance.findOne({ userId: req.user._id, date: { $gte: s, $lte: e } }).lean();
    const checkedIn = !!doc?.checkInTime;
    const checkedOut = !!doc?.checkOutTime;
    res.json({ checkedIn, checkedOut, status: doc?.status || null });
  } catch (e) {
    next(e);
  }
});

router.get("/all", requireAuth, requireManager, async (req, res, next) => {
  try {
    const { employeeId, status, dateFrom, dateTo, page = 1, limit = 50 } = req.query;
    const usersQ = employeeId ? { employeeId } : {};
    const users = await User.find(usersQ).select("_id").lean();
    const ids = users.map(u => u._id);
    const q = {};
    if (ids.length) q.userId = { $in: ids };
    if (status) q.status = status;
    if (dateFrom || dateTo) {
      q.date = {};
      if (dateFrom) q.date.$gte = new Date(dateFrom);
      if (dateTo) q.date.$lte = new Date(dateTo);
    }
    const items = await Attendance.find(q).sort({ date: -1 }).skip((page - 1) * limit).limit(parseInt(limit)).lean();
    const total = await Attendance.countDocuments(q);
    res.json({ items, total });
  } catch (e) {
    next(e);
  }
});

router.get("/employee/:id", requireAuth, requireManager, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const items = await Attendance.find({ userId: id }).sort({ date: -1 }).skip((page - 1) * limit).limit(parseInt(limit)).lean();
    const total = await Attendance.countDocuments({ userId: id });
    res.json({ items, total });
  } catch (e) {
    next(e);
  }
});

router.get("/summary", requireAuth, requireManager, async (req, res, next) => {
  try {
    const { dateFrom, dateTo } = req.query;
    const q = {};
    if (dateFrom || dateTo) {
      q.date = {};
      if (dateFrom) q.date.$gte = new Date(dateFrom);
      if (dateTo) q.date.$lte = new Date(dateTo);
    }
    const items = await Attendance.find(q).lean();
    const present = items.filter(i => i.status === "present").length;
    const late = items.filter(i => i.status === "late").length;
    const half = items.filter(i => i.status === "half-day").length;
    res.json({ present, late, halfDay: half });
  } catch (e) {
    next(e);
  }
});

router.get("/export", requireAuth, requireManager, async (req, res, next) => {
  try {
    const { dateFrom, dateTo } = req.query;
    const q = {};
    if (dateFrom || dateTo) {
      q.date = {};
      if (dateFrom) q.date.$gte = new Date(dateFrom);
      if (dateTo) q.date.$lte = new Date(dateTo);
    }
    const items = await Attendance.find(q).populate({ path: "userId", select: "name email employeeId department" }).sort({ date: -1 }).lean();
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=attendance.csv");
    const header = ["employeeId", "name", "email", "department", "date", "checkInTime", "checkOutTime", "status", "totalHours"];
    const lines = [header.join(",")];
    for (const i of items) {
      const u = i.userId || {};
      const row = [u.employeeId || "", u.name || "", u.email || "", u.department || "", new Date(i.date).toISOString(), i.checkInTime ? new Date(i.checkInTime).toISOString() : "", i.checkOutTime ? new Date(i.checkOutTime).toISOString() : "", i.status || "", i.totalHours ?? ""].map(v => String(v).replace(/\n|\r|,/g, " "));
      lines.push(row.join(","));
    }
    res.send(lines.join("\n"));
  } catch (e) {
    next(e);
  }
});

router.get("/today-status", requireAuth, requireManager, async (req, res, next) => {
  try {
    const today = new Date();
    const s = startOfDay(today);
    const e = endOfDay(today);
    const items = await Attendance.find({ date: { $gte: s, $lte: e } }).populate({ path: "userId", select: "name email employeeId department" }).lean();
    const present = items.filter(i => i.status === "present").length;
    const late = items.filter(i => i.status === "late").length;
    const half = items.filter(i => i.status === "half-day").length;
    const absentIds = await User.find({ _id: { $nin: items.map(i => i.userId._id) } }).select("name email employeeId department").lean();
    res.json({ present, late, halfDay: half, absent: absentIds });
  } catch (e) {
    next(e);
  }
});

export default router;

