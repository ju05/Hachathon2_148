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
        render(tasks);
    }
});

clearButton.addEventListener("click", () => {
    tasks = tasks.filter((task) => !task.status);
    render(tasks);
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
            date: new Date(task.date).toISOString(), // Ensure the date is valid
        }));
        render(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
});

// Render function with proper innerHTML updates
const render = (data) => {
    const rootElement = document.getElementById("listTasks");
    rootElement.innerHTML = "";

    if (!data || data.length === 0) {
        rootElement.innerHTML = `<p>No tasks available. Add a task to get started!</p>`;
        return;
    }

    const groupedTasks = data.reduce((acc, task) => {
        if (!acc[task.category]) acc[task.category] = [];
        acc[task.category].push(task);
        return acc;
    }, {});

    Object.keys(groupedTasks).forEach((category) => {
        const categoryDiv = document.createElement("div");
        categoryDiv.classList.add("category-section");

        // Use innerHTML for category header
        categoryDiv.innerHTML = `<h3>${category}</h3>`;

        groupedTasks[category].forEach((task) => {
            // Create a div for each task
            const taskDiv = document.createElement("div");
            taskDiv.classList.add("task-item");

            // Use innerHTML to structure the task
            taskDiv.innerHTML = `
                <input type="checkbox" ${task.status ? "checked" : ""}>
                <p style="text-decoration: ${task.status ? "line-through" : "none"};">
                    ${task.task || "No task description"}
                </p>
                <input type="number" value="${task.task_order || 0}" style="width: 50px;">
                <p>Deadline: ${
                    isNaN(new Date(task.date))
                        ? "Invalid Date"
                        : new Date(task.date).toLocaleDateString()
                }</p>
            `;

            // Create and add the color button dynamically
            const colorButton = document.createElement("button");
            colorButton.textContent = "Status Color";
            updateColor(colorButton, task.date);

            // Add event listeners dynamically
            const checkbox = taskDiv.querySelector("input[type='checkbox']");
            checkbox.addEventListener("change", () => {
                task.status = checkbox.checked;
                render(data);
            });

            const orderInput = taskDiv.querySelector("input[type='number']");
            orderInput.addEventListener("change", () => updateOrder(task, category, orderInput.value));

            taskDiv.appendChild(colorButton);
            categoryDiv.appendChild(taskDiv);
        });

        rootElement.appendChild(categoryDiv);
    });
};

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

// Function to update task order within categories
function updateOrder(taskToUpdate, category, newOrder) {
    const taskInCategory = tasks.filter((task) => task.category === category);
    const oldOrder = taskToUpdate.task_order;
    taskToUpdate.task_order = parseInt(newOrder, 10);

    taskInCategory.forEach((task) => {
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

    render(tasks); // Re-render with updated order
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
