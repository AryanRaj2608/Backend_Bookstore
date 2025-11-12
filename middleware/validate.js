// middleware/validate.js
// Validates request parts and stores parsed values in req.validated.
// Also attempts to copy validated parts into req.body/params/query when safe.

export const validate = (schema) => (req, res, next) => {
  const data = { body: req.body, params: req.params, query: req.query };

  const { error, value } = schema.validate(data, { abortEarly: false, allowUnknown: false });

  if (error) {
    const details = error.details.map(d => d.message.replace(/["]/g, ""));
    return res.status(400).json({ success: false, message: "Validation error", errors: details });
  }

  // Save parsed validated object (always)
  // value will usually be { body, params, query } if your schemas are structured that way.
  req.validated = value;

  // Try to copy validated parts back to req.body/params/query if they exist in value.
  // We use try/catch in case req.body/params/query are readonly/getters in some environments.
  try {
    if (value.body !== undefined) req.body = value.body;
  } catch (e) { /* ignore - keep req.validated as authoritative */ }

  try {
    if (value.params !== undefined) req.params = value.params;
  } catch (e) { /* ignore */ }

  try {
    if (value.query !== undefined) req.query = value.query;
  } catch (e) { /* ignore */ }

  return next();
};
