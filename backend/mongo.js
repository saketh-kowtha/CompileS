var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";



exports.insertRecord = function(dbName, collectionName, record){
	let promise = new Promise((resolve, reject) => {
		MongoClient.connect(url, function(err, db) {
		  if (err) reject(err);
		  var dbo = db.db(dbName);
		  dbo.collection(collectionName).insertOne(record, function(err, res) {
		    if (err) reject(err.message);
		    else resolve(res.insertedCount)
		    db.close();
		  });
		});	
	});
	return promise
}

exports.findRecord = function(dbName, collectionName, queryRecord){
	let promise = new Promise((resolve, reject) => {
		MongoClient.connect(url, function(err, db) {
		  if (err) reject(err);
		  var dbo = db.db(dbName);
			dbo.collection(collectionName).findOne(queryRecord, function(err, result) {
				if (err) reject(err.message);
				else resolve(result)
		    	db.close();
		  });
		});	
	});
	return promise
}

exports.deleteRecord = function(dbName, collectionName, record){
	let promise = new Promise((resolve, reject) => {
		MongoClient.connect(url, function(err, db) {
		  if (err) reject(err);
		  var dbo = db.db(dbName);
			dbo.collection(collectionName).deleteOne(record, function(err, obj) {
				if (err) reject(err.message);
				else resolve(obj.deletedCount)
		    	db.close();
		  });
		});	
	});
	return promise
}

exports.updateRecord = function(dbName, collectionName, currentRecord, newValues){
	let promise = new Promise((resolve, reject) => {
		MongoClient.connect(url, function(err, db) {
		  if (err) reject(err);
		  var dbo = db.db(dbName);
			dbo.collection(collectionName).updateOne(currentRecord, {$set : newValues}, function(err, res) {
				if (err) reject(err.message);
				else resolve(res.modifiedCount)
		    	db.close();
		  });
		});	
	});
	return promise
}

