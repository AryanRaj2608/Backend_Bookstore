// Generic validator for body/params/query using Joi schemas
export const validate =
  (schema) =>
  (req, res, next) => {
    const data = {
      body: req.body,
      params: req.params,
      query: req.query,
    };
    const { error } = schema.validate(data, { abortEarly: false });
    if (!error) return next();

    const details = error.details.map(d => d.message.replace(/["]/g, ""));
    return res.status(400).json({ success: false, message: "Validation error", errors: details });
  };
