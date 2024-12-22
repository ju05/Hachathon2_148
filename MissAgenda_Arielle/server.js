const express = require('express');
const app = express();
const cors = require("cors");
const path = require("path");

const { todoRouter } = require("./routes/todoRouter.js");
app.use(cors());
app.use('/', express.static(path.join(__dirname, 'public')));

const PORT = 8008;
app.listen(PORT, () => {
  console.log(`run on ${PORT}`);
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use("/todo", todoRouter);
