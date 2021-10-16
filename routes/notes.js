"use strict";
const fs = require("fs");
const validation = require("../services/middlewares/validationMiddleWare");
const userSchema = require("../services/validations/uservalidation");

const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  console.log(req.url, "@", Date.now());
  next();
});
const addInfo = (req, res, next) => {
  const date = new Date().toLocaleDateString().split(".").join("/");
  let dates = req.body.content.match(
    /([\d]+)([\-\./])([\d]+)([\-\./])([\d]+)/gm
  );
  req.body.date = date;
  req.body.dates = dates;
  next();
};

router.route("/").post(validation(userSchema), addInfo, (req, res) => {
  let data = fs.readFileSync("todos.json", "utf8");
  let todos = JSON.parse(data);

  let todo = {
    ...req.body,
  };
  console.log(todo);
  const id = Math.max.apply(
    Math,
    todos.map((o) => o.id)
  );
  todo.id = id + 1;
  todos.push(todo);
  data = JSON.stringify(todos);
  fs.writeFileSync("todos.json", data);
  res.status(200).send(req.body);
});

router.route("/").get((req, res) => {
  console.log("here");
  let content = fs.readFileSync("todos.json", "utf8");
  let todos = JSON.parse(content);
  res.send(todos);
});

router.route("/stats").get((req,res)=>{

  console.log('here')
  let data = fs.readFileSync("todos.json", "utf8");
  let todos = JSON.parse(data);

  let response = {

  }
  response.amount = todos.length 

  res.status(200).send(response)
})


router.route("/:id").get((req, res) => {
  let id = req.params.id;
  let content = fs.readFileSync("todos.json", "utf8");
  let todos = JSON.parse(content);
  let todo;
  console.log(todos);

  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id == id) {
      todo = todos[i];
      break;
    }
  }

  if (todo) {
    res.send(todo);
  } else {
    res.status(404).send("User isn't found");
  }
});

router.route("/:id").delete((req, res) => {
  let id = req.params.id;
  let data = fs.readFileSync("todos.json", "utf8");
  let todos = JSON.parse(data);
  let index = -1;

  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id == id) {
      index = i;
      break;
    }
  }

  if (index > -1) {
    let todo = todos.splice(index, 1)[0];

    for (let i = 0; i < todos.length; i++) {
      todos[i].id = i + 1;
    }

    let data = JSON.stringify(todos);
    fs.writeFileSync("todos.json", data);
    res.send(todo);
  } else {
    res.status(404).send("User isn't found by ID");
  }
});
router.route("/:id").patch(validation(userSchema),(req, res) =>{

  
  let todoID = req.params.id

  const todoName = req.body.name
  const todoCategory = req.body.category 
  const todoContent = req.body.content 


  let data = fs.readFileSync("todos.json", "utf8");
  let todos = JSON.parse(data);
  let todo

  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id == todoID) {
      todo = todos[i];
      break;
    }
  }

  if (todo) {
   
    todo.name = todoName;
    todo.category = todoCategory;
    todo.content = todoContent;

   
    data = JSON.stringify(todos);
    fs.writeFileSync("todos.json", data);
    res.send(todo);
  } else {
    res.status(404).send(todo);
  }
});

module.exports = router;
