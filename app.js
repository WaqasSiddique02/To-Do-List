const express=require("express");
const bodyParser=require("body-parser");
const date=require(__dirname+"/date.js");

const app=express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

var items=[];
var workItems=[];

app.get("/",function(req,res){
   let day=date.getDate();
    res.render("list",{listTitle:day,newItems:items});
});


app.post("/",function(req,res){
    var newItem=req.body.newItem;

    if(req.body.list==="Work"){
        workItems.push(newItem);
        res.redirect("/work");
    }

    else{
    items.push(newItem);
    res.redirect("/")
    }
});

app.get("/work",function(req,res){
    res.render("list",{listTitle:"Work List",newItems:workItems});
});

app.listen(3000,function(){
    console.log("Server started on port 3000");
});