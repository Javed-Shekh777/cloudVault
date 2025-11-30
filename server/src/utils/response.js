// utils/response.js
exports.successResponse = (res, message = "OK", data = {}, status = 200) => {
  return res.status(status).json({
    status: "success",
    message,
    data
  });
};

exports.errorResponse = (res, message = "Error", code = 400, errors = null) => {
  return res.status(code).json({
    status: "fail",
    message,
    errors
  });
};
