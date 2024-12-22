const { db } = require("../config/data.js");
const { getAllTasksFromDB } = require("../models/todoModel.js");
const path = require("path");

const mainPage = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/main.html"));
};

const loginPage = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/login.html"));
};

const registerPage = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/register.html"));
};

const tasksPage = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/dashboardIndex.html"));
};

const getAllTasks = (req, res) => {
    getAllTasksFromDB()
        
        .then((data) => {
            console.log("Fetched tasks:", data); // Debugging
            res.json(data)
        })
        .catch((e) => {
            console.error("Error fetching tasks:", e); // Debugging
            res.status(404).json({ msg: "Tasks not found" });
        });
};
 
const createTasksToDB = (req, res) => {
    const { username, task, task_order, category, status, date } = req.body;//html
    console.log(username, task, task_order, category, status, date);
    db("tasks")
        .insert({ username, task, task_order, category, status, date })
        .then(() => {
            res.status(201).json({ message: "Task successfully created" });
        }) 
        
        .catch((e) => {
            console.error("Error creating task:", e); // Debugging
            res.status(500).json({ msg: "Failed to create task" });
        });
};

module.exports = {
    tasksPage,
    mainPage,
    loginPage,
    registerPage,
    getAllTasks,
    createTasksToDB, 
};
