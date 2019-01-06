exports.DATABASE_URL = process.env.DATABASE_URL ||
                      'mongodb://localhost/cube-js';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
                      'mongodb://localhost/test-cube-js';
exports.PORT = process.env.PORT || 8080;