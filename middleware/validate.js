export const validate = (schema) => (req, res, next) => {
  const data = { body: req.body, params: req.params, query: req.query };

  const { error, value } = schema.validate(data, { abortEarly: false });

  if (error) {
    const details = error.details.map(d => d.message.replace(/["]/g, ""));
    return res.status(400).json({ success: false, message: "Validation error", errors: details });
  }

  // Don't overwrite req.query/body/params (they're getters). Store parsed values here:
  req.validated = value; // { body, params, query }
  return next();
};