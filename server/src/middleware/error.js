export default (err, req, res, next) => {
  const code = err.status || 500;
  const message = err.message || "Server error";
  res.status(code).json({ error: message });
};

