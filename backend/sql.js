var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    multipleStatements: true

  }); 
con.connect(function(err){
    if(err) throw err
    console.log("Connected!!!")
})
var sql = function(query,cb){
     

    con.query(query, function (err, result) {
        if (err) 
        {
            cb({error : err});
            // con.end()
        }
        else 
        {
            cb({op:result})
            // con.end()
        }
            console.log(result)
    });

}
module.exports.compile = sql