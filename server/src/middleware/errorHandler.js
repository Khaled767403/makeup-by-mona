export function notFoundHandler(req, res, next) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.code === "P2002") {
    return res.status(409).json({ message: `A record with this ${err.meta?.target?.join(", ") || "value"} already exists.` });
  }
  if (err.code === "P2025") {
    return res.status(404).json({ message: "Record not found." });
  }
  if (err.name === "ZodError") {
    return res.status(400).json({ message: "Validation error", errors: err.errors });
  }

  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Internal server error" });
}

export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
