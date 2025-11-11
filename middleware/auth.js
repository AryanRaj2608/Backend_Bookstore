import jwt from "jsonwebtoken";
// const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const JWT_SECRET = "aditya-super-secret";

export const requireAuth = (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token)
      return res.status(401).json({ success: false, message: "Missing or invalid Authorization header" });

    const payload = jwt.verify(token, JWT_SECRET);
    // attach user info if needed
    req.user = { id: payload.sub, email: payload.email };
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Unauthorized", error: err.message });
  }
};
