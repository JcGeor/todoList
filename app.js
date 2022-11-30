/*
In this project I learned how to use the database service MongoDb along with with the mongoose
npm package to make handing data very easy. I first connect to the database instance via mongoose.connect()
I have a local instance of mongodb running in another terminal using the mongosh command which starts it up
for me. After connection I use express to handle get and post request to local host 3000 and use body parser 
in order for me to acces the requests as json objects. I preset the connection to connect to the todoList db
and which allowed me to interact with only that data base. Using json I was able to make two differenct types 
of Schema. Schema is the way in which data is organized and thus I had one for a sigular item that just had a name atribute 
as well as a list Schema which allowed me to incorporate the item schema into the one of the atributes. I then 
created a mongoose model which act as handle for mongoDB operations. It specifies the collection you are working with 
as well as it lets you use it as a construtor function to make induvidual documents to add to collection in a db specified 
by the mongoose.model(). I created two main pages to mess with MongoDB. One being the regular / home path and one
for custom paths /:custompath. I still do not fully understand why the notation is /: to specify a custom path or what Dr
China said is actually a parameter. I will do more research on url requests because of this. I was then able to 
use the mongoose functions to do dynamic CRUD(create read update delete) operations in order to move around with the 
home todo lists. I was also able to use the said very confusing custom parameter/path in order to create custom
lists. All in all it was fun as this project gave me better understadning of a NoSQl database as well as it 
being my first time with a database it started the wheels for what will be something I must understand at a 
fundamental level.
*/
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname+"/date.js");
const _ = require("lodash");
app = express();

//console.log(date);
    //deprecated since we are using mongoose and mongodb
 //let items = ["Cook Food", "Buy Food", "Eat food"];
 //let work = [];

                                            //todoList is the name of the database we are using
//mongoose.connect("mongodb://localhost:27017/todoList");

mongoose.connect("mongodb+srv://Big-Dog:SuckIt@cluster0.ed4kpbk.mongodb.net/todoList?retryWrites=true&w=majority")


const itemsSchema = {
  name:String
}

const listSchema = {
  name:String,
  items:[itemsSchema]
}

const List = mongoose.model("list",listSchema);
                            //items is the name of the collections where we will store the documents useing the Item constructor
const Item = mongoose.model("item",itemsSchema);
    //to stop duplicating of items
const item1 = new Item({
  name:"Hello and welcome"
});
const item2 = new Item({
name:"Hit + to add a new item"
});
const item3 = new Item({
name:"<-- to line out an item"
});
const defaultItems = [item1,item2,item3];




app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static('public'))

app.get("/", function(req, res) {
  let day = date.day();
  let items = []

  Item.find({},function(err,foundItems){
    if(err){
      console.log(err);
    }
    else{
        if(foundItems.length ===0){
            Item.insertMany(defaultItems,function(err){
              if(err){
                console.log(err)
              }
              else{
                console.log("Default items added");
                res.redirect("/");
                

              }
            })
        }
        else{        
      //console.log(items);
      res.render("lists", {
        Title: "Today",
        newItem: foundItems
      });
    }
    }
  })
})

app.get("/:customListName",function(req,res){
  const customListName = _.capitalize(req.params.customListName);
  console.log(customListName);
  List.findOne({name:customListName},function(err,foundList){
    if(!err){
      if(!foundList){
        console.log("Does not exist");
        const list = new List({
          name:customListName,
          items:defaultItems
        })
        list.save();
        res.redirect("/"+customListName);
      }
      else{
        console.log("It exists");
        res.render("lists",{Title:customListName,newItem:foundList.items});
      }
    }
  })
  
})



app.post("/", function(req, res) {

  // WE store thease varible to tell what list they are in and what is it they are tying to add
  const item = req.body.text;
  const listName = req.body.list;


    let newItem = new Item({
      name:item
    });
      //checks if the list being used is the default one via usage of the title
    if(listName === "Today"){
      newItem.save(function(err){
        if(err){
          console.log("err")
        }
        else{
          console.log("Shit be good");
        }
      })
      res.redirect("/");
    }
    else{
      List.findOne({name:listName},function(err,foundList){
        foundList.items.push(newItem);
        foundList.save();
        res.redirect("/"+listName);
      })
    }
    
  
  }
)


app.post("/delete",function(req,res){
  const Name = req.body.name;
  const list = req.body.list;

  if(list === "Today"){
    console.log(Name);
    Item.deleteOne({name:Name},function(err){
      if(err){
        console.log(err)
      }
      else{
        console.log(Name+" has been deleted");
      }
    });
    res.redirect("/");
  }
  else{
    List.findOneAndUpdate(
      {name:list},
      {$pull:{items:{name:Name}}},
      function(err,foundItem){
        if(!err){
          res.redirect("/"+list);
        }
      }
    )
  }
})

app.listen(3000, () => {
  console.log("It be good chief")
})
