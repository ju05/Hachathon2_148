const { Router } = require("express");
const { 
    tasksPage,
    mainPage,
    loginPage,
    registerPage,
    getAllTasks,
    createTasksToDB, 
    

} = require("../controllers/todoController.js");
const { createTasks} = require("../models/todoModel.js");

const router = Router();

router.get("/tasks/:username", getAllTasks);
router.get("/home", mainPage);
router.get("/login", loginPage);
router.get("/register", registerPage);
// router.post("/tasks", tasksPage)
router.post("/tasks", createTasksToDB);


module.exports = {
  todoRouter: router,
};
