exports.sendErrorMessage = function(msg, res, status) {
  var errResponse = {
    status: status,
    message: msg
  };
  sendData(errResponse, res);
};


exports.parameterMissingError = function (msg,res, status) {

    var errResponse = {
        status: status,
        message: msg
    }
    sendData(errResponse,res);
};

exports.sendSuccessMessage = function (msg,res,status) {

    var errResponse = {
        status: status,
        message: msg
    };
    sendData(errResponse,res);
};

exports.sendSuccessData = function (data,message,res,status) {

    var successResponse = {
        status: status,
        message: message,
        data: data
    };
    sendData(successResponse,res);
};


function sendData(data, res) {
  res.type("json");
  res.jsonp(data);
}