// const { getAllTasks } = require("../controllers/todoController");

let tasks = [];

// Handle username input and update header dynamically
const usernameInput = document.getElementById("usernameInput");
const header = document.querySelector("h1");

usernameInput.addEventListener("input", () => {
    const username = usernameInput.value.trim();
    header.textContent = username
        ? `Welcome, ${username}'s To Do Dashboard`
        : "Welcome to your To Do Dashboard";
});

const submitButton = document.getElementById("submitTaskButton");
const clearButton = document.getElementById("clearCompletedButton");

// Event listener for submitting tasks
submitButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const data = await handleSubmit();
    if (data) {
        tasks.push(data);
        render(tasks);
    }
});

// Event listener for clearing completed tasks
clearButton.addEventListener("click", () => {
    tasks = tasks.filter((task) => !task.completed);
    render(tasks);
});

// Function to update task colors based on deadlines
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

// Update task order within categories
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

    render(tasks);
}

// Render tasks into the browser
const render = (data) => {
    const rootElement = document.getElementById("listTasks");
    rootElement.innerHTML = ""; // Clear previous content

    if (!data || data.length === 0) {
        rootElement.innerHTML = "<p>No tasks available. Add a task to get started!</p>";
        return;
    }

    // Group tasks by category
    const groupedTasks = data.reduce((acc, task) => {
        if (!acc[task.category]) acc[task.category] = [];
        acc[task.category].push(task);
        return acc;
    }, {});

    // Generate HTML for each category and its tasks
    Object.keys(groupedTasks).forEach((category) => {
        const categoryDiv = document.createElement("div");
        categoryDiv.classList.add("category-section");

        const categoryHeader = document.createElement("h3");
        categoryHeader.textContent = category;
        categoryDiv.appendChild(categoryHeader);

        groupedTasks[category].forEach((task) => {
            const taskDiv = document.createElement("div");
            taskDiv.classList.add("task-item");

            // Task description
            const taskDescription = document.createElement("p");
            taskDescription.textContent = `Task: ${task.task}`;
            taskDiv.appendChild(taskDescription);

            // Task order
            const taskOrderInput = document.createElement("input");
            taskOrderInput.type = "number";
            taskOrderInput.value = task.taskOrder;
            taskOrderInput.style.width = "50px";
            taskOrderInput.addEventListener("change", () => updateOrder(task, category, taskOrderInput.value));
            taskDiv.appendChild(taskOrderInput);

            // Task deadline
            const taskDeadline = document.createElement("p");
            taskDeadline.textContent = `Deadline: ${new Date(task.deadline).toLocaleDateString()}`;
            taskDiv.appendChild(taskDeadline);

            // Task status
            const taskStatus = document.createElement("p");
            taskStatus.textContent = `Status: ${task.status ? "Completed" : "Pending"}`;
            taskDiv.appendChild(taskStatus);

            // Status color button
            const colorButton = document.createElement("button");
            colorButton.textContent = "Status Color";
            updateColor(colorButton, task.deadline);
            taskDiv.appendChild(colorButton);

            // Append task to the category
            categoryDiv.appendChild(taskDiv);
        });

        // Append category to the root element
        rootElement.appendChild(categoryDiv);
    });
};

// Handle task submission
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
        return data;
    } catch (error) {
        console.log("Error submitting task:", error);
        return null;
    }
};

// Initialize tasks on page load
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
        render(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
});
