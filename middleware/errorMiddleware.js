// 404 for unknown routes
export const notFound = (req, res, next) => {
  res.status(404);
  res.json({ success: false, message: `Route ${req.originalUrl} not found` });
};

// generic error handler (if you ever call next(err))
export const errorHandler = (err, req, res, next) => {
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(status).json({
    success: false,
    message: err.message || "Server error",
    // stack: process.env.NODE_ENV === "production" ? undefined : err.stack, // uncomment to hide in prod
  });
};
