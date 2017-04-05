var express = require("express");
var router = express.Router();
var async = require("async");
var sendResponse = require("./send_response.js");



router.post('/create', function(req, res, next)
{
	var name;
	var fees;
	var universityId;
	var courseDuration;
	var finalData = {};
	async.auto({
		checkData: function(callback) {
			if(!req.body.name) {
				var msg = "Please enter course name";
                return sendResponse.parameterMissingError(msg, res, 400);
			}
			if(!req.body.fees) {
				var msg = "Please enter course fees";
                return sendResponse.parameterMissingError(msg, res, 400);
			}
			if(!req.body.university_id) {
				var msg = "Please enter university id";
                return sendResponse.parameterMissingError(msg, res, 400);
			}
			if(!req.body.course_duration) {
				var msg = "Please enter course duration year";
                return sendResponse.parameterMissingError(msg, res, 400);
			}
			name = req.body.name;
			fees = req.body.fees;
			universityId = req.body.university_id;
			courseDuration = req.body.course_duration;
			callback(null);


		},
		createCourse:['checkData', function(result, callback)
		{
			var sql = "insert into courses(name, fees, course_duration, university_id) values(?, ?, ?, ?)";
			connection.query(sql, [name, fees, courseDuration, universityId], function(err, data)
			{
				if(err) {
					callback(err);
				} else {
					finalData.courseId = data.insertId;
					console.log(data.insertId)
					callback(null);
				}
			})
		}]
	}, function(err, result)
	{
		if (err) {
			var msg = err.toString() + "Something with user data";
			return sendResponse.sendErrorMessage(msg, res, 500);
		} else {
			var msg = " course creation successful ";
            return sendResponse.sendSuccessData(finalData, msg, res, 200);
		}

	})
})

router.post('/search', function(req, res, next)
{
	var finalData = {};
	var query;
	async.auto({
		checkData: function(callback) {
			if(!req.body.query) {
				var msg = "Please enter course name";
                return sendResponse.parameterMissingError(msg, res, 400);
			}
			query = req.body.query;
			callback(null);
		},
		searchCourse:['checkData', function(result, callback)
		{
			var sql = "select * from courses where name LIKE '%"+ query +"%'";
			console.log(sql);
			connection.query(sql, function(err, data)
			{
				if(err) {
					callback(err);
				} else {
					finalData = data;
					
					callback(null);
				}
			})
		}]

	}, function(err, result)
	{
		if (err) {
			var msg = err.toString() + "Something with user data";
			return sendResponse.sendErrorMessage(msg, res, 500);
		} else {
			var msg = "search result";
            return sendResponse.sendSuccessData(finalData, msg, res, 200);
		}

	})
})


module.exports = router;