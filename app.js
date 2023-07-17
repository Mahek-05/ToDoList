//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const List = require(__dirname + "/schema.js");
const path = require('path');
const app = express();

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

// mongoose.connect("mongodb://127.0.0.1:27017/toDoListDb");
const PORT = process.env.PORT || 3000

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

async function addItem(itemName) {
    try {
        const i = await List.create ({
          name: itemName,
        });
        console.log(i);
    } catch(error) {
        console.log(error);
    }
}

async function retrieveItem() {
  try {
    const docs = await List.find({});
    const listItems = docs.map(doc => doc.name);
    return listItems;
  } catch (error) {
    console.log(error);
    return []; // Return an empty array or handle the error as needed
  }
}

async function removeveItem(item) {
  try {
    await List.deleteOne({name: item});
  } catch (error) {
    console.log(error);
  }
}

app.get("/", async function(req, res) {
  try {
    const listItems = await retrieveItem();
    res.render("list", { day: "Today", listItems: listItems });
  } catch (error) {
    console.log(error);
    res.render("list", { day: "Today", listItems: [] }); // Handle the error as needed
  }
})

app.post("/", async function(req, res) {
  let item = req.body.newItem;
  await addItem(item);
  res.redirect("/");
});

app.post("/remove", async function(req, res) {
  let item = req.body.input
  await removeveItem(item);
  res.redirect("/");
});

// app.listen(3000, function(){
//   console.log("Server started on port 3000.");
// });

//Connect to the database before listening
connectDB().then(() => {
  app.listen(PORT, () => {
      console.log("listening for requests");
  })
})
