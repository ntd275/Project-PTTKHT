require("dotenv").config();
exports.port = process.env.PORT || 3001
exports.accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "1h";
exports.accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "ACCESS_TOKEN_SECRET";
exports.refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "30d";
exports.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "REFRESH_TOKEN_SECRET";
exports.refreshTokenCookieLife = process.env.COOKIE_LIFE || 30 * 24 * 60 * 60 * 1000;
exports.dbHost = process.env.DB_HOST || "172.0.0.1"
exports.db = process.env.DB || "SOLIENLACDIENTU"
exports.userDB = process.env.USER_DB || "root";
exports.passwordDB = process.env.PASSWORD_DB || "";
exports.saltRounds = Number(process.env.SALT_ROUNDS) || 10
