export function sendResponse(res, success, message, data = null, error = null, statusCode = 200) {
    return res.status(statusCode).json({ success, message, data, error });
  }
  