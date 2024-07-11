const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    name: "Welcome to your to do list"
});

const item2 = new Item({
    name: "Hit + button to add a new item"
});

const item3 = new Item({
    name: "Hit --> to delete an item"
});

const defaultItems = [item1, item2, item3];

app.get("/", function (req, res) {
    let day = date.getDate();
    Item.find({})
        .then(function (docs) {
            if (docs.length === 0) {
                Item.insertMany(defaultItems)
                    .then(function (docs) {
                        console.log("Successfully inserted default items.");
                    })
                    .catch(function (err) {
                        console.log("Error inserting default items: ", err);
                    });
                res.redirect("/");
            } else {
                res.render("list", { listTitle: day, newItems: docs });
            }
        })
        .catch(function (err) {
            console.log(err);
        });
});

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema]
});

const List = mongoose.model("List", listSchema);

app.get("/:customListName", function (req, res) {
    const customListName = req.params.customListName;

    List.findOne({ name: customListName })
        .then(function (foundList) {
            if (!foundList) {
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + customListName);
            } else {
                res.render("list", { listTitle: foundList.name, newItems: foundList.items });
            }
        })
        .catch(function (err) {
            console.log(err);
        });
});

app.post("/", function (req, res) {
    const newItemName = req.body.newItem;
    const listName = req.body.list;

    const newItem = new Item({
        name: newItemName
    });

    if (listName === "Today") {
        newItem.save();
        res.redirect("/");
    } else {
        List.findOne({ name: listName })
            .then(function (foundList) {
                foundList.items.push(newItem);
                foundList.save();
                res.redirect("/" + listName);
            })
            .catch(function (err) {
                console.log(err);
            });
    }
});

app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;

    Item.findByIdAndRemove(checkedItemId)
        .then(function () {
            console.log("Successfully deleted checked item.");
            res.redirect("/");
        })
        .catch(function (err) {
            console.log(err);
        });
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});
