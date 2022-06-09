const validator=require('validator');
const express = require("express");
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded();
const mysql = require('mysql')
const alert=require('alert');


const app = express();
app.use("/assets",express.static("assets"));


const connection = new mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "nodejs"
});

// connect to the database
connection.connect(function(error){
    if (error) throw error
    else console.log("connected to the database successfully!")
});


app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html");
})

app.post("/",encoder, function(req,res){
    var username = req.body.username;
    var password = req.body.password;

    connection.query("select * from loginuser where user_name = ? and user_pass = ?",[username,password],function(error,results,fields){
        if (results.length > 0) {
            // alert("Login Successful!");
            res.redirect("/L1");
        } else {
            alert("Login Failed! Please provide the right credentials!");
            res.redirect("/");
        }
        res.end();
    })
})

// when login is success
app.get("/L1",function(req,res){
    res.sendFile(__dirname + "/L1.html")
})


app.get("/weekend",function(req,res){  
    res.sendFile(__dirname+"/weekend.html")
})
app.get("/insert",function(req,res){  
    res.sendFile(__dirname+"/insert.html")
})
app.get("/modify",function(req,res){  
    res.sendFile(__dirname+"/modify.html")
})
app.get("/delete",function(req,res){  
    res.sendFile(__dirname+"/delete.html")
})
app.get("/modweek",function(req,res){  
    res.sendFile(__dirname+"/modweek.html")
})
app.get("/insertweek",function(req,res){  
    res.sendFile(__dirname+"/insertweek.html")
})

app.post("/weekend",encoder, function(req,res){
    var tl = req.body.tl;
    var ga = req.body.a;
    var gb = req.body.b;
    var gc = req.body.c;
    var gd = req.body.d;
    var myarr = []

    connection.query("select employee.emp_name,employee.emp_grp from employee LEFT JOIN (SELECT employee.emp_name ,count(*) as count,max(weekendshifts.date) as recent_date FROM employee INNER JOIN weekendshifts ON employee.emp_id=weekendshifts.emp_id group by emp_name ) AS emp_count on employee.emp_name=emp_count.emp_name ORDER BY emp_grp,count,recent_date;" ,function(err,result,fields){
    
        if (err) throw err;
    
       result =JSON.parse( JSON.stringify(result));
        myarr = algo(result,tl,ga,gb,gc,gd);
        console.log(myarr);
        console.log(typeof(myarr));
        if(myarr.length>0){
            var html = '' ;
            html+="<body>";
            html+="<style>";
            html+="body{background-image: url('/assets/cohesity.jpg');}";
            html+=".styled-table";
            html+="{";
            html+= "border-collapse: collapse;"
            html+=    "margin: 150px 500px;"
            html+=    "font-size: 0.9em;"
            html+=     "position: relative;"
            html+=    "font-family: sans-serif;"
            html+=    "min-width: 400px;"
            html+=   "box-shadow: 0 0 20px rgba(255, 255, 255, 255);"
            html+=   "background-color: rgba(255, 255, 255, 255);"
            html+=   ";"
            html+="}";
            html+=".styled-table thead tr { background-color: #f9f9f9; text-align: right;}";
            html+=".styled-table th,.styled-table td { padding: 12px 15px;}";
            html+=".styled-table tbody tr {border-bottom: 1px solid #000;}";

            html+="</style>"
            html+="<table class='styled-table'>"
            for(let i=0;i<myarr.length;i++)
            { 
                html = html+"<tr> <td>";
                html = html + myarr[i].emp_name+"</td>";
                html = html + "<td>" + myarr[i].emp_grp+"</td> "+"</tr>";                
                // s=s+myarr[i].emp_name+"  "+myarr[i].emp_grp;
            }
            html+="<tr>"+"<td>"+"Total Tech Lead:"+tl+"</td>"+"</tr>";
            html+="<tr>"+"<td>"+"Total A Employee:"+ga+"</td>"+"</tr>";
            html+="<tr>"+"<td>"+"Total B Employee:"+gb+"</td>"+"</tr>";
            html+="<tr>"+"<td>"+"Total C Employee:"+gc+"</td>"+"</tr>";
            html+="<tr>"+"<td>"+"Total D Employee:"+gd+"</td>"+"</tr>";
            
            html = html + "</table>";
            html+="</body>";
           res.send(html);
        }else{
            
            res.redirect('/weekend');
        }
        
        
    })
  
})

function algo(result,tl,a,b, c, d)
{
    var myarr = []
    var TL= result.filter(obj => {
        return obj.emp_grp === 'TL'
      })
    var tl = TL.slice(0,tl)
    myarr.push(...tl)
    //  console.log(TL.slice(0,a))
      var A=result.filter(obj => {
        return obj.emp_grp === 'A'
      })
      var ga = A.slice(0,a)
      myarr.push(...ga)
    //  console.log(A.slice(0,b))
      var B=result.filter(obj => {
        return obj.emp_grp === 'B'
      })
      var gb = B.slice(0,b)
      myarr.push(...gb)
    //   console.log(B.slice(0,c))
      var C=result.filter(obj => {
        return obj.emp_grp === 'C'
      })
      var gc= C.slice(0,c)
      myarr.push(...gc)
      var D=result.filter(obj => {
        return obj.emp_grp === 'D'
      })
      var gd= D.slice(0,d)
      myarr.push(...gd)
    //   console.log(C.slice(0,d))
    
      return myarr;
    //   console.log(TL,A,B,C)
}

app.post("/insert",encoder, function(req,res){
    var emp_name = req.body.emp_name;
    
    var emp_id = req.body.emp_id;
   
    var emp_grp=req.body.emp_grp;
    
    
    var sql = `INSERT INTO employee (emp_id,emp_name,emp_grp ) VALUES ('${emp_id}', '${emp_name}', '${emp_grp}' )`;
    
    connection.query(sql,function (err, data) {
        if (err) alert(err) ;
        else{ alert("Inserted Successfully!");}
        });
        
    
    res.redirect('/insert');
    // res.end();
    

});

app.post("/modify",encoder, function(req,res){
    var emp_name = req.body.emp_name;
    
    var emp_id = req.body.emp_id;
    // console.log(emp_id);
    var emp_grp=req.body.emp_grp;
    // console.log(emp_grp);
    
    
    var sql =  `UPDATE employee SET emp_grp= '${emp_grp}' WHERE emp_id = '${emp_id}'`;

    connection.query(sql,function (err, data) {
        if (err) alert(err) ;
        else{ alert("Modified Successfully!");}
        });
    res.redirect('/modify');
    // res.end();
    
});

app.post("/delete",encoder, function(req,res){
    var emp_name = req.body.emp_name;
    
    var emp_id = req.body.emp_id;
    // console.log(emp_id);
    
    
    
    var sql =  `DELETE from employee WHERE emp_id = '${emp_id}'`;

    connection.query(sql,function (err, data) {
        if (err) alert(err) ;
        else{ alert("Delete Successfully!");}
        });
    res.redirect('/delete');
    
    // res.end();
});

app.post("/modweek",encoder, function(req,res){
    var emp_id = req.body.emp_name;
    var date=req.body.date;
    console.log(date);
    var emp_sid=req.body.emp_swap;
    
    // console.log(emp_id);
    
    
    
    var sql =  `UPDATE weekendshifts SET emp_id= '${emp_sid}' WHERE emp_id = '${emp_id}' and date='${date}'`;

    connection.query(sql,function (err, data) {
        if (err) alert(err) ;
        else{ alert("Modified Successfully!");}
        });
    res.redirect('/modweek');
   

    // res.end();
});

app.post("/insertweek",encoder, function(req,res){
    var emp_id = req.body.emp_id;
    
    var date = req.body.date;
    var shift=req.body.shift;
    // console.log(emp_id);
    
    
    
    var sql =  `INSERT INTO weekendshifts (emp_id,date,quarter,shift) VALUES ('${emp_id}', '${date}', 'Q2','${shift}' )`;

    connection.query(sql,function (err, data) {
        if (err) alert(err) ;
        else{ alert("Inserted  Successfully!");}
        });
    res.redirect('/insertweek');
    
    // res.end();
});





// set app port 
app.listen(4000);



