const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js");

// FOR DATABASE...........
const mongoose = require("mongoose");
const { getDay } = require("./date");

const app = express();

// Connect database to this server.......
mongoose.connect("mongodb://localhost:27017/todolistDB");

// database schema......

const itemSchema = mongoose.Schema({
  date: String,
  name:
  {type:String,
   required : [true, "name must be specified"]
  }
});

const Item = mongoose.model("Item",itemSchema);
app.set('view engine','ejs');

// const items = [{name:"Do Homework"},{name:"Go to market"},{name:"Lets Play"}];

// Item.insertMany(items,function(err)
// {
//   if(err)
//     console.log("ERROR : DATA  ARE NOT INSERTED IN DATABSE");
//   else
//    console.log("data inserted succesfully");
// });

// A new schema for express dynamic page creation testing...
const listSchema = mongoose.Schema({
  name : String,
  items : [itemSchema]
});

List = mongoose.model("List",listSchema);

var inputfromusers =[];
var worklists = [];
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static( "public"));

app.get("/", function(req,res)
{
  Item.find({},function(err,foundItems)
  {
    if(foundItems.length===0)  // default items in the list...
    {
      const items = [{date:date.getDate(),name:"Do Homework"},{date:date.getDate(),name:"Go to market"},{date:date.getDate(),name:"Lets Play"}];
      Item.insertMany(items,function(err)
      {
        if(err)
          console.log("ERROR : DATA  ARE NOT INSERTED IN DATABSE");
        else
         console.log("data inserted succesfully");
      });
      res.redirect("/");
    }
    else
    {
      // console.log(foundItems);
      res.render("list", {ListType: today,newInput :foundItems}); 
    }
    
  });
    let today = date.getDate() ;
      // render the list.ejs file. send data from server to the client side.
    // res.send("hii");
});

// app.get("/work",function(req,res)
// {
//     res.render("list",{ListType : "work",newInput: worklists});
// });

const defaultItems = [{date:date.getDate(),name:"Do Homework"},{date:date.getDate(),name:"Go to market"},{date:date.getDate(),name:"Lets Play"}]; 
app.get("/:custumListName", function(req,res)
{
  const custumListName = req.params.custumListName;

  List.findOne({name : custumListName}, function(err, founditem)
  {

      if(!err)
      {
        if(!founditem)
        {
          const list = new List({ name : custumListName, items:defaultItems});
          list.save();
          res.redirect("/"+custumListName);
        }
        else
        {
          res.render("list", {ListType: founditem.name,newInput :founditem.items});
        }
      }
      else
      {
        console.log("Something went wrong. Document verification not done");
      }
  });
  

});

app.post("/",function(req,res)
{
  var inputfromuser = req.body.newItem ;
  // console.log(req.body);
  const item = {date:date.getDate(),name:inputfromuser};
  const temp = date.getDay()+",";
  if(req.body.list===temp)
  {
    Item.insertMany(item);
    inputfromusers.push(inputfromuser);
    // console.log(req.body);
    res.redirect("/");
  }
  else
  {
    // worklists.push(inputfromuser);
    // res.redirect("/work");
    List.findOne({name : req.body.list},function(err, found)
    {
        found.items.push(item);
        found.save();
        res.redirect("/"+req.body.list);
    });


  }
  
  
  // res.render("list",{newInput: inputfromuser});  
});

app.post("/delete", function(req,res)
{
    var checkedItemID = req.body.checkbox;
    console.log(checkedItemID);
    Item.findByIdAndRemove(checkedItemID,function(err)
    {
      if(err)
        console.log(err);
      else
      {
        console.log("deleted item successfully");
        res.redirect("/");
      }
      
    });
    
    // res.redirect("/");
});
app.post("/work",function(req,res)
{
  // TODO
})

app.get("/about",function(req,res)
{
  res.render("about");
})
app.listen(3000,function()
{
  console.log("The server is started at port 3000");
});