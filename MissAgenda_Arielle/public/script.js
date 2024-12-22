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

// Event listeners for buttons
const submitButton = document.getElementById("submitTaskButton");
const clearButton = document.getElementById("clearCompletedButton");

submitButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const data = await handleSubmit();
    if (data) {
        tasks.push(data);
        appendTaskToDOM(data); // Append only the new task
    }
});

clearButton.addEventListener("click", () => {
    tasks = tasks.filter((task) => !task.status);
    clearAndReloadTasks(); // Clear completed tasks and reload the list
});

// Fetch tasks on page load
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch(`http://localhost:8008/todo/tasks/Canelle`);
        const data = await res.json();
        console.log("Fetched data:", data); // Debugging
        tasks = data.map((task) => ({
            task: task.task,
            task_order: task.task_order,
            category: task.category,
            status: task.status,
            date: task.date,
        }));
        clearAndReloadTasks(); // Load all tasks on page load
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
});

// Append a single task to the DOM
function appendTaskToDOM(task) {
    const rootElement = document.getElementById("listTasks");
    const categoryDiv = getCategoryDiv(rootElement, task.category);
console.log(task.category);

    const taskDiv = createTaskElement(task);
    categoryDiv.appendChild(taskDiv);
}

// Clear the task list and reload all tasks
function clearAndReloadTasks() {
    const rootElement = document.getElementById("listTasks");
    rootElement.innerHTML = ""; // Clear all existing tasks

    const groupedTasks = tasks.reduce((acc, task) => {
        if (!acc[task.category]) acc[task.category] = [];
        acc[task.category].push(task);
        return acc;
    }, {});

    Object.keys(groupedTasks).forEach((category) => {
        const categoryDiv = getCategoryDiv(rootElement, category);
        groupedTasks[category].forEach((task) => {
            const taskDiv = createTaskElement(task);
            categoryDiv.appendChild(taskDiv);
        });
    });
}

// Get or create a category div
function getCategoryDiv(rootElement, category) {
    let categoryDiv = document.querySelector(`[data-category="${category}"]`);
    if (!categoryDiv) {
        categoryDiv = document.createElement("div");
        categoryDiv.classList.add("category-section");
        categoryDiv.setAttribute("data-category", category);
        categoryDiv.innerHTML = `<h3>${category}</h3>`;
        rootElement.appendChild(categoryDiv);
    }
    return categoryDiv;
}

// Create a task element
function createTaskElement(task) {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task-item");

    // Checkbox for task status
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.status;
    checkbox.addEventListener("change", () => {
        task.status = checkbox.checked;
        toggleTaskCompletion(taskDiv, task.status);
    });
    taskDiv.appendChild(checkbox);

    // Task description
    const taskDescription = document.createElement("p");
    taskDescription.textContent = task.task || "No task description";
    if (task.status) taskDescription.style.textDecoration = "line-through";
    taskDiv.appendChild(taskDescription);

    // Task order
    const taskOrderInput = document.createElement("input");
    taskOrderInput.type = "number";
    taskOrderInput.value = task.task_order || 0;
    taskOrderInput.style.width = "50px";
    taskOrderInput.addEventListener("change", () => updateOrder(task, taskOrderInput.value));
    taskDiv.appendChild(taskOrderInput);

    // Task deadline
    const taskDeadline = document.createElement("p");
    const deadlineDate = new Date(task.date);
    taskDeadline.textContent = `Deadline: ${
        isNaN(deadlineDate) ? "Invalid Date" : deadlineDate.toLocaleDateString()
    }`;
    taskDiv.appendChild(taskDeadline);

    // Status color button
    const colorButton = document.createElement("button");
    colorButton.textContent = "Status Color";
    updateColor(colorButton, task.date);
    taskDiv.appendChild(colorButton);

    return taskDiv;
}

// Toggle task completion (strikethrough)
function toggleTaskCompletion(taskDiv, isCompleted) {
    const taskDescription = taskDiv.querySelector("p");
    taskDescription.style.textDecoration = isCompleted ? "line-through" : "none";
}

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

// Function to update task order
function updateOrder(taskToUpdate, newOrder) {
    const oldOrder = taskToUpdate.task_order;
    taskToUpdate.task_order = parseInt(newOrder, 10);

    const categoryTasks = tasks.filter((task) => task.category === taskToUpdate.category);
    categoryTasks.forEach((task) => {
        if (task !== taskToUpdate) {
            if (
                taskToUpdate.task_order > oldOrder &&
                task.task_order > oldOrder &&
                task.task_order <= taskToUpdate.task_order
            ) {
                task.task_order -= 1;
            } else if (
                taskToUpdate.task_order < oldOrder &&
                task.task_order < oldOrder &&
                task.task_order >= taskToUpdate.task_order
            ) {
                task.task_order += 1;
            }
        }
    });

    clearAndReloadTasks(); // Reload the task list after updating order
}

// Handle task submission
const handleSubmit = async () => {
    const taskInput = document.getElementById("taskInput");
    const deadlineInput = document.getElementById("deadlineInput");
    const categoryInput = document.getElementById("categoryInput");
    const username = usernameInput.value.trim();

    const newTask = {
        task: taskInput.value.trim(),
        category: categoryInput.value,
        date: deadlineInput.value,
        username: username,
        status: false,
        task_order: tasks.length + 1,
    };

    try {
        const res = await fetch("http://localhost:8008/todo/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTask),
        });
        return await res.json();
    } catch (error) {
        console.error("Error submitting task:", error);
        return null;
    }
};
