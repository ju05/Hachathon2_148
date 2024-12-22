const { db } = require("../config/data.js");

const getAllTasksFromDB = () => {
  // Correctly set the WHERE clause for "username"
  return db("tasks")
    .select("task", "task_order", "category", "status", "date")
    .where("username", "Canelle"); // Corrected syntax
};


getAllTasksFromDB()
   .then((tasks) => {
    // Process the tasks here
    const parsedTasks = tasks.map(task => ({
      username: "Canelle", // Adding username to match script.js structure
      task: task.task,
      category: task.category,
      taskOrder: task.task_order,
      status: task.status ? "Completed" : "Pending",
      deadline: new Date(task.date).toISOString().split("T")[0] // Convert to YYYY-MM-DD format
    }));
    console.log("Parsed tasks:", parsedTasks);
  })
  .catch(err => {
    console.error("Error fetching tasks:", err);
  });

const createTasks = async (username, task, task_order, category, status, date) => {
    try {
        const result = await db("tasks").insert(
            { username, task, task_order, category, status, date },
            ["id", "username", "task", "task_order", "category", "status", "date"]
        );
        return result;
    } catch (error) {
        console.error("Error in createTasks:", error.message);
        throw error;
    }
};
module.exports = {
  getAllTasksFromDB,
  createTasks
};
