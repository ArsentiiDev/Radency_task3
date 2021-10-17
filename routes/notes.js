"use strict";
const fs = require("fs");
const validation = require("../services/middlewares/validationMiddleWare");
const userSchema = require("../services/validations/uservalidation");

const express = require("express");
const postData = require("../repository/helpers");
const statsData = require("../repository/helpers");
const getExactNote = require("../repository/helpers");
const deleteExactNote = require("../repository/helpers");
const patchExactNote = require("../repository/helpers");
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
  data = JSON.stringify(postData(req.body,data));
  fs.writeFileSync("todos.json", data);
  res.status(200).send(req.body);
});

router.route("/").get((req, res) => {
  let content = fs.readFileSync("todos.json", "utf8");
  let todos = JSON.parse(content);
  res.send(todos);
});

router.route("/stats").get((req,res)=>{
  let data = fs.readFileSync("todos.json", "utf8");
  res.status(200).send(statsData(data))
})

router.route("/:id").get((req, res) => {
  let id = req.params.id;
  let content = fs.readFileSync("todos.json", "utf8");
  res.send(getExactNote(id,content))
});

router.route("/:id").delete((req, res) => {
  let id = req.params.id;
  let data = fs.readFileSync("todos.json", "utf8");
  let [status,todos] = deleteExactNote(id,data)
  console.log(todos)
  data = JSON.stringify(todos);
  fs.writeFileSync("todos.json", data);
  res.status(status).send(todos)
});

router.route("/:id").patch(validation(userSchema),addInfo,(req, res) =>{
  let todoID = req.params.id
  let [status,todo] = patchExactNote(todoID,req.body)
  res.status(status).send(todo)
});


module.exports = router;
