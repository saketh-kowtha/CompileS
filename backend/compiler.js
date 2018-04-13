var fs = require("fs")
var exec  = require('child_process').exec;
var killProcess = require('./find-process')
var os = require("os")
function getCodeSize(code) {
    return bytesToSize(encodeURI(code).split(/%..|./).length - 1);
}
function bytesToSize(bytes) {
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   if (bytes == 0) return '0 Byte';
   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

function compile(fileName,code,input,extension,path,cb,timeout =5000,size  = 100,timeout_server = 10){
	var promise = new Promise(function(resolve,reject){
		fs.writeFile( path  + "/" + fileName + extension , code  , function(err){
			if(err){
				reject(err);
			}else{
				fs.writeFile( path + "/" + fileName + "input.txt" , input , function (err){
					if(err){
						reject(err)
					}else{
						var cmd = "";
						switch(extension){
							case ".py" :
										cmd = "cd " + path + " && python " + fileName + extension + " < " + fileName + "input.txt"
										break;
							case ".c" :
										cmd = "cd " + path + " && gcc -o  " + fileName + " " + fileName + extension
										break;
							case ".cpp" :
										cmd = "cd " + path + " && g++ -o  " + fileName + " " + fileName + extension
										break;
							case ".java" : 
										cmd = "cd " + path + " && javac " + fileName + extension
										break;
							case ".pl" :
										cmd = "cd " + path + " && perl " + fileName + extension + " < " + fileName + "input.txt"
										break;
							case ".rb" :
										cmd = "cd " + path + " && ruby " + fileName + extension + " < " + fileName + "input.txt"
										break;
							case ".js" :
										cmd = "cd " + path + " && ruby " + fileName + extension + " < " + fileName + "input.txt"
										break;
							case ".php" :
										cmd = "cd " + path + " && php " + fileName + extension + " < " + fileName + "input.txt"
										break;
							case ".hs" :
										cmd = "cd " + path + " && runhaskell " + fileName + extension + " < " + fileName + "input.txt"
										break;
						}
						// var cmd = "python " + fileName + extension
						exec(cmd ,{timeout : Number(timeout_server) * 1000, killSignal : 'SIGTERM'},function(err,op,ser){
							var res = {}
							if(( (extension == ".c") || (extension == ".cpp") || (extension == ".java") || (extension == ".vb") || (extension == ".cs")) && !err ){
								var cmd = ""

								switch(extension){
									case ".c" :
										if((os.type().indexOf("Win")) != -1)
											cmd = "cd " + path + " && " + (((os.type().indexOf("Win")) != -1) ? ""+fileName : "./"+fileName ) + " < " + fileName + "input.txt"
										else
											cmd = path+"/./"+fileName + " < " + path + "/" +fileName+"input.txt"
										break;
									case ".cpp" :
										if((os.type().indexOf("Win")) != -1)
											cmd = "cd " + path + " && " + (((os.type().indexOf("Win")) != -1) ? ""+fileName : "./"+fileName ) + " < " + fileName + "input.txt"
										else
											cmd = path+"/./"+fileName + " < " + path + "/" +fileName+"input.txt"							
										break;
									case ".java" :
										if((os.type().indexOf("Win")) != -1)
											cmd = "cd " + path + " && java " + fileName  + " < " + fileName + "input.txt"
										else
											cmd = "cd " + path + " && " + " java " + fileName + " < " + fileName + "input.txt"
										break;
								}
								console.log(cmd)
								exec(cmd,{timeout : Number(timeout_server) * 1000 , killSignal : 'SIGTERM'},function(er,op,ser){

									res.op = op
									res.error  = ser
									res.opsignal = er
									resolve(res)
									console.log(res)
								})
                        }
							else{

									res.op = op
									res.error  = ser
									res.opsignal = err
									resolve(res)
									console.log(res)
							}
						})
					}
				})
			}
		})			
	})
	return promise
}

function compile_the_code(fileName,c,input,extension,username,cb,timeout,size,timeout_server = 10){
	var start = new Date(), finish; 
	compile(fileName,c.trim(),input,extension,__dirname + (os.type().indexOf("Win") == -1 ? "/":"\\") +username,cb).then((data) => {
	finish = new Date();

	data.exeTime = (Number(finish.getTime() - start.getTime())) * 0.001
	delete data.opsignal
	data.size = getCodeSize(c.trim())
	if(data.exeTime > timeout)
		data.time = "Time Limit Exceeded"
	if(Number((data.size).split(" ")[0]) > size)
		data.memory = "Memory Limit Exceeded"
	console.log(data)
	
	 killProcess.killProcess(fileName).then((d)=>{
		 if(Number((d.split(" "))[1]) != 0 ) 
		 data.error = "Program has error" 
		else
		 data.status = "ok"
		 cb(data)
		 console.log("\n\n\n\n\n\killed\n\n\n\n\n")
	 }).catch((e)=>{console.log(e) ;cb(data)})

	}).catch((er) => {
		cb({op:"Something Wrong"})
		console.log(er)
		})
}
module.exports.compile_the_code = compile_the_code
