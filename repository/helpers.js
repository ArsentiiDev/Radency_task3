const fs = require("fs");

function postData(body,data) {

    let todos = JSON.parse(data);
    let todo = {
        ...body
    }
    const id = Math.max.apply(
        Math,
        todos.map((o) => o.id)
      );
      todo.id = id + 1;
      todos.push(todo);
      return todos
}

function statsData(data) {
    let todos = JSON.parse(data);
    let response = {
    }
    response.amount = todos.length 
    return response
}

function getExactNote(id,content){
    let todos = JSON.parse(content);
    let todo;
  
    for (let i = 0; i < todos.length; i++) {
      if (todos[i].id == id) {
        todo = todos[i];
        break;
      }
    }
    
  if (todo) {
    return todo;
  } else {
    return "User isn't found";
  }
}

function deleteExactNote(id,data) {

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
    return [200, todos]
} else return [404, "User isn't found"]
}

function patchExactNote(id,data) {


    const todoName = data.name
  const todoCategory = data.category 
  const todoContent = data.content 
  const todoDates = data.dates
  const todoDate = data.date


  let content = fs.readFileSync("todos.json", "utf8");
  let todos = JSON.parse(content);
  let todo

  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id == id) {
      todo = todos[i];
      break;
    }
  }

  if (todo) {
   
    todo.name = todoName;
    todo.category = todoCategory;
    todo.content = todoContent;
    todo.dates = todoDates;
    todo.date = todoDate

   
    data = JSON.stringify(todos);
    fs.writeFileSync("todos.json", data);
    return [200,todo]
  } else {
    return [404,todo]
  }
}
module.exports = postData
module.exports = statsData
module.exports = getExactNote
module.exports = deleteExactNote
module.exports = patchExactNote