const express = require("express");
const fs = require("fs");

const notes = require('./routes/notes')

const app = express();
app.use(express.json())
app.use('/api/notes',notes)

app.listen(3001, function() {
  console.log("Server started");
});