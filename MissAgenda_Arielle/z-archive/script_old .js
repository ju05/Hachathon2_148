const { getAllTasks } = require("../controllers/todoController");

let tasks = [];

const usernameInput = document.getElementById("usernameInput");
const header = document.querySelector("h1");

usernameInput.addEventListener("input", () => {
    const username = usernameInput.value.trim();
    header.textContent = username
        ? `Welcome, ${username}'s To Do Dashboard`
        : "Welcome to your To Do Dashboard";
});

const taskForm = document.getElementById("taskForm");
const submitButton = document.getElementById("submitTaskButton");
const clearButton = document.getElementById("clearCompletedButton");

submitButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const data = await handleSubmit();
    if (data) {
        addTask(data);
    }
});

clearButton.addEventListener("click", clearCompletedTasks);

const addTask = (data) => {
    if (data) {
        tasks.push(data);
        const listTasks = document.querySelector(".listTasks");
        displayTasks(listTasks);
    }
};
function updateColor(colorButton, deadline) {
    const today = new Date();
    const deadlineDate = new Date(deadline);

    if (deadlineDate > today) {
        const diff = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
        colorButton.style.backgroundColor = diff > 3 ? "green" : "orange";
    } else {
        colorButton.style.backgroundColor = "red";
    }
    colorButton.style.color = "white";
}
function updateOrder(taskToUpdate, category, newOrder) {
    const taskInCategory = tasks.filter(task => task.category === category);
    const oldOrder = taskToUpdate.order;
    taskToUpdate.order = parseInt(newOrder, 10);

    taskInCategory.forEach(task => {
        if (task !== taskToUpdate) {
            if (taskToUpdate.order > oldOrder && task.order > oldOrder && task.order <= taskToUpdate.order) {
                task.order -= 1;
            } else if (taskToUpdate.order < oldOrder && task.order < oldOrder && task.order >= taskToUpdate.order) {
                task.order += 1;
            }
        }
    });

    displayTasks(document.querySelector(".listTasks"));
}
function displayTasks(listTasks) {
    listTasks.innerHTML = ""; // Clear existing tasks

    if (tasks.length === 0) {
        listTasks.innerHTML = "<p>No tasks available. Add a task to get started!</p>";
        return;
    }

    const groupedTasks = tasks.reduce((acc, task) => {
        if (!acc[task.category]) acc[task.category] = [];
        acc[task.category].push(task);
        return acc;
    }, {});

    const sortedCategories = Object.keys(groupedTasks).sort();

    sortedCategories.forEach((category) => {
        const categorySection = document.createElement("div");
        categorySection.setAttribute("data-category", category);
        categorySection.classList.add("category-section");

        const categoryHeader = document.createElement("h3");
        categoryHeader.textContent = category;
        categorySection.appendChild(categoryHeader);

        groupedTasks[category].sort((a, b) => a.taskOrder - b.taskOrder);

        groupedTasks[category].forEach((task) => {
            const taskDiv = document.createElement("div");
            taskDiv.classList.add("task-item");

            const taskDescription = document.createElement("p");
            taskDescription.textContent = `Task: ${task.task}`;
            taskDiv.appendChild(taskDescription);

            const taskOrderInput = document.createElement("input");
            taskOrderInput.type = "number";
            taskOrderInput.value = task.taskOrder;
            taskOrderInput.style.width = "50px";
            taskOrderInput.addEventListener("change", () =>
                updateOrder(task, category, taskOrderInput.value)
            );
            taskDiv.appendChild(taskOrderInput);

            const taskStatus = document.createElement("p");
            taskStatus.textContent = `Status: ${task.status}`;
            taskDiv.appendChild(taskStatus);

            const taskDeadline = document.createElement("p");
            taskDeadline.textContent = `Deadline: ${task.deadline}`;
            taskDiv.appendChild(taskDeadline);

            const colorButton = document.createElement("button");
            colorButton.textContent = "Status Color";
            updateColor(colorButton, task.deadline);
            taskDiv.appendChild(colorButton);

            categorySection.appendChild(taskDiv);
        });
        console.log(data);
        render(data);
        listTasks.appendChild(categorySection);
    });
}


function clearCompletedTasks() {
    tasks = tasks.filter((task) => !task.completed);
    displayTasks(document.querySelector(".listTasks"));
}

const handleSubmit = async () => {
    const taskInput = document.getElementById("taskInput");
    const deadlineInput = document.getElementById("deadlineInput");
    const categoryInput = document.getElementById("categoryInput");
    const username = usernameInput.value.trim();
    const taskText = taskInput.value.trim();
    const deadline = deadlineInput.value;
    const category = categoryInput.value;

    const objJson = {
        task: taskText,
        category: category,
        date: deadline,
        username: username,
    };

    try {
        const options = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(objJson),
        };
        const res = await fetch("http://localhost:8008/todo/tasks", options);
        const data = await res.json();
        console.log(data);
        render(data);
    } catch (error) {
        console.log("Error submitting task:", error);
    }
};
const render = (arr) => {
  const html = arr.map((item) => {
    return `<div">
    <div ${username}>
    </div>
    <h1>Welcome to your To Do Dashboard</h1>
    <form id="taskForm">
        <div style="display: flex; gap: 10px;">
            < ${task}>
            <${category}>
            ${date}>
        </div>
    </form>
    <div ${tasks}></div>  
    </div>`;
  });
  document.getElementById("root").innerHTML = html.join("");
};


document.addEventListener("DOMContentLoaded", async () => {
    try {
        const username = "Canelle"; 
        const res = await fetch(`http://localhost:8008/todo/tasks/${username}`);
        if (!res.ok) {
            throw new Error(`Failed to fetch tasks: ${res.status}`);
        }
        const data = await res.json();
        tasks = data.map((task) => ({
            task: task.task,
            taskOrder: task.task_order,
            category: task.category,
            status: task.status ? "Completed" : "Pending",
            deadline: new Date(task.date).toISOString().split("T")[0],
        }));
        const listTasks = document.querySelector("#listTasks");
        displayTasks(listTasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
});
