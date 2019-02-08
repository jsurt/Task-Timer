exports.DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://localhost/task-timer";
exports.TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL || "mongodb://localhost/test-task-timer";
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = "VERYSECRETKEY";
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || "7d";
