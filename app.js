const express=require("express");
const bodyParser=require("body-parser");
const mongoose = require("mongoose");
const date=require(__dirname+"/date.js");

const app=express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemSchema = new mongoose.Schema({
    name: String
});

const item =mongoose.model("items",itemSchema);

const item1 = new item({
    name:"welcome to you to do list"
});

const item2 = new item({
    name:"Hit + button to add a new item"
});

const item3 = new item({
    name:"Hit --> to do delte a item"
});

const defaultItems=[item1,item2,item3];


app.get("/", function (req, res) {
    let day = date.getDate();
item.find({})
    .then(function (docs) {
        if (docs.length === 0) {
            item.insertMany(defaultItems)
                .then(function (docs) {
                    console.log("Successfully inserted");
                })
                .catch(function (err) {
                    console.log("Error");
                });
                res.redirect("/");
        }


        else{
                res.render("list", { listTitle: day, newItems: docs });
        }
    })
    .catch(function (err) {
        console.log(err);
    })
});


app.post("/",function(req,res){
    const newItem=req.body.newItem;
    const item4 = new item({
        name:newItem
    });

    item4.save();
    res.redirect("/")

});


app.post("/delete",function(req,res){
    const checkedItem = req.body.checkbox;
    item.findByIdAndDelete(checkedItem)
    .then(function(){
        res.redirect("/");
    })
    .catch(function(err){
        console.log(err);
    });
});

app.get("/work",function(req,res){
    res.render("list",{listTitle:"Work List",newItems:workItems});
});

app.listen(3000,function(){
    console.log("Server started on port 3000");
});