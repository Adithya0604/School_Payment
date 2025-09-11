const ErrorCodes = require("./ErrorCodes");

async function errorHandle(err, request, response, next) {
  const status = err.statusCode;

  switch (status) {
    case ErrorCodes.Bad_Request:
      return response.status(ErrorCodes.Bad_Request).json({
        title: "Bad Request",
        message: err.message,
      });
    case ErrorCodes.Forbidden:
      return response.status(ErrorCodes.Forbidden).json({
        title: "Forbidden",
        message: err.message,
      });
    case ErrorCodes.Key_Duplicte:
      return response.status(ErrorCodes.Key_Duplicte).json({
        title: "Key_Duplicte",
        message: err.message,
      });
    case ErrorCodes.Method_Not_Allowed:
      return response.status(ErrorCodes.Method_Not_Allowed).json({
        title: "Method_Not_Allowed",
        message: err.message,
      });
    case ErrorCodes.Not_Found:
      return response.status(ErrorCodes.Not_Found).json({
        title: "Not_Found",
        message: err.message,
      });
    case ErrorCodes.Server_Error:
      return response.status(ErrorCodes.Server_Error).json({
        title: "Server_Error",
        message: err.message,
      });
    case ErrorCodes.Too_Many_Requests:
      return response.status(ErrorCodes.Too_Many_Requests).json({
        title: "Too_Many_Requests",
        message: err.message,
      });
    case ErrorCodes.Unauthorized:
      return response.status(ErrorCodes.Unauthorized).json({
        title: "Unauthorized",
        message: err.message,
      });
  }
}

module.exports = errorHandle;