// 404 for unknown routes
export const notFound = (req, res, next) => {
  res.status(404);
  res.json({ success: false, message: `Route ${req.originalUrl} not found` });
};

// generic error handler (if you ever call next(err))
export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.stack || err);

  const status = err.statusCode || 500;

  // Friendly, consistent JSON response
  res.status(status).json({
    success: false,
    message: err.message || "Something went wrong on the server",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

