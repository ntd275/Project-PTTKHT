const jwt = require('jsonwebtoken');

exports.generateToken = function (user, secretSignature, tokenLife) {
  return new Promise((resolve, reject) => {
    // Định nghĩa những thông tin của user mà bạn muốn lưu vào token ở đây
    const userData = {
      accountId: user.accountId,
      accountName: user.accountName,
      role: user.role,
      userCode: user.userCode,
    }
    // Thực hiện ký và tạo token
    jwt.sign(
      userData,
      secretSignature,
      {
        algorithm: "HS256",
        expiresIn: tokenLife,
      },
      (error, token) => {
        if (error) {
          return reject(error);
        }
        resolve(token);
      });
  });
}

exports.verifyToken = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        return reject(error);
      }
      resolve(decoded);
    });
  });
}