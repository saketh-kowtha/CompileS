var find = require('find-process')
var exec = require('child_process').exec
var os = require('os')
var env = ""
var count = 0
var count1 = 0	
os.type().indexOf("Win") != -1 ? env = "win" : env = "unix"
var cmd = {
	unix : function(id){
		return "kill -9  " +id
	},
	win : function(id){
		return "TASKKILL /PID " + id + " /F" 
	}
}
var killProcess = function (name){
	count = 0
	let promise = new Promise(function(resolve, reject){
		find('name', name).then(function (list) {
		console.log(list) 
				if(list.length != 0){
					list.map(function(id){
						count++
						if(id.name.indexOf(name) != -1){
							exec(cmd[env](id.pid), {timeout : 2000, killSignal : 'SIGTERM'},function(err,op,ser){
								if(err || ser){
									reject(err)
								}
							})
							count1++
						}
					})
					resolve("killed " + count1)
				}
				else{
					reject("OK")
				}
			}, function (err) {
				reject(err); 
		}).catch((e) => {reject(e)})
	})
	return promise
}
module.exports.killProcess = killProcess
