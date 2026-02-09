import rateLimit from "express-rate-limit";

export const expenseLimiter = rateLimit({
  windowMs: 5 * 1000, // 5 seconds
  max: 1, // 1 request
  message: {
    message: "Please wait before adding another expense"
  }
});
