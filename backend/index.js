var express = require("express")
var app = express()
var bodyparser = require("body-parser")
var compiler = require("./compiler")
var mongo= require("./mongo")
var fs = require("fs")
var formidable = require("formidable");
var cors = require("cors")
var request = require("request")
var sql = require("./sql")
var mail = require('./mailer')
const opn = require('opn')

opn('http://localhost:5454/cravingf/index.html') \
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({
    extended : true
}));
app.set('view engine', 'ejs');

app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

  
app.post('/compiler', function(req, res){
    var cb = function(x){
        res.set('Content-Type', 'Application/json');
        res.send(x)
    }
    var code = req.body.code
    var extension = req.body.extension
    if(extension.indexOf("mysql") == -1){
        var file = req.body.file
    console.log("\n\n\n\n\n\n"+ code + "\n\n\n\n\n")
    var input = req.body.input
    var username = req.body.username
    var timeout = req.body.timeout
    var size = req.body.size
    compiler.compile_the_code(file,code,input,extension,username,cb,timeout,size)
    }
    else    
    {
        code = code.replace("\n","")
        sql.compile(code,cb)
    }

 });
app.post('/register', function(req, res){
        res.set('Content-Type', 'Application/json');

   mongo.insertRecord("swathi","REGISTER",req.body).then((d) => {console.log(d);fs.mkdirSync(req.body.email);res.send({op:d})}).catch((e) => {console.log(e);res.send({op:e})})

});

app.post('/forget', function(req, res){
    var pswd = ""
    res.set('Content-Type', 'Application/json');
    mongo.findRecord("swathi","REGISTER",{email : req.body.email}).then((d) => {
            console.log(d);
            if(d)
            mail.sendMail("CompileS",req.body.email,d.pwd,"your Password is " +d.pwd).then((d) =>{
                    res.send("Successfully sent to your mail")
            }).catch((e) => {
                res.send(e)
            })
            else
                res.send("No Record Found")
    }).catch((e) => {console.log(e);res.send(d)})


});
app.post("/git",function(req,res){
    var url = req.body.url
    console.log(url)
    request(url, function (error, response, body) {
       if(error){
        res.set('Content-Type', 'Application/json');
           res.send({err : error})
       }
       else{
        var data = (body) ? body : null
        res.set('Content-Type', 'Application/json');
        res.send({code : data})
       }
    });
})

app.post('/file',function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var oldpath = files.filetoupload.path;
        var newpath = __dirname + fields.username + files.filetoupload.name;
        fs.rename(oldpath, newpath, function (err) {
          if (err) throw err;
        fs.readFile(newpath,function(data,err){
            if(data)
                res.send(data.toString())
            else
                res.send(err.toString())
        })
        });  
    });
});


app.listen(3000,function(){
	console.log("Port Running on 3000")
});

 app.post('/login', function(req, res){ 
            res.set('Content-Type', 'Text/plain');
console.log(req.body)
mongo.findRecord("databasename","CollectionName",req.body).then((d) => {console.log(d);res.send(d)}).catch((e) => {console.log(e);res.send(d)})

 });


    
