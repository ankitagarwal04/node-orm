var express = require("express");
var router = express.Router();
var async = require("async");
var sendResponse = require("./send_response.js");


router.post('/create', function(req, res, next)
{
	var name;
	var type;
	var rank;
	var yearOfEstablishment;
	var finalData = {};
	async.auto({
		checkData: function(callback) {
			if(!req.body.name) {
				var msg = "Please enter university name";
                return sendResponse.parameterMissingError(msg, res, 400);
			}
			if(!req.body.type) {
				var msg = "Please enter university type";
                return sendResponse.parameterMissingError(msg, res, 400);
			}
			if(!req.body.rank) {
				var msg = "Please enter university rank";
                return sendResponse.parameterMissingError(msg, res, 400);
			}
			if(!req.body.year_of_establishment) {
				var msg = "Please enter university year";
                return sendResponse.parameterMissingError(msg, res, 400);
			}
			name = req.body.name;
			type = req.body.type;
			rank = req.body.rank;
			yearOfEstablishment = req.body.year_of_establishment;
			callback(null);


		},
		createUniversity:['checkData', function(result, callback)
		{
			var sql = "insert into universities(name, type, rank, year_of_establishment) values(?, ?, ?, ?)";
			connection.query(sql, [name, type, rank, yearOfEstablishment], function(err, data)
			{
				if(err) {
					callback(err);
				} else {
					finalData.universityId = data.insertId;
					console.log(data);
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
			var msg = " university creation successful ";
            return sendResponse.sendSuccessData(finalData, msg, res, 200);
		}

	})
})


router.post('/search', function(req, res, next)
{
	var universityData = [];
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
		searchUniversity:['checkData', function(result, callback)
		{
			var sql = "select * from universities where name LIKE '%"+ query +"%' ";
			connection.query(sql, function(err, data)
			{
				if(err) {
					callback(err);
				} else {
					universityData = data;
					callback(null);
				}
			})
		}],
		searchAssocialtedCourses:['searchUniversity', function(result, callback)
		{
			var sql = "select * from courses where university_id = ? ";
			connection.query(sql, [universityData[0].id], function(err, data)
			{
				if(err) {
					callback(err);
				} else {
					universityData[0].courses = data;
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
            return sendResponse.sendSuccessData(universityData, msg, res, 200);
		}

	})
})




module.exports = router;