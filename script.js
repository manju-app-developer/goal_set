document.addEventListener("DOMContentLoaded", () => {
    // Load saved tasks, goals, and books
    loadTasks();

    // Task Management
    const taskInput = document.getElementById("task-input");
    const deadlineInput = document.getElementById("deadline-input");
    const categorySelect = document.getElementById("category");
    const taskList = document.getElementById("tasks");
    const addTaskButton = document.getElementById("add-task");

    addTaskButton.addEventListener("click", () => {
        const taskText = taskInput.value.trim();
        const deadline = deadlineInput.value;
        const category = categorySelect.value;

        if (taskText === "") return;

        const taskObj = { text: taskText, deadline, category };
        saveTask(taskObj);
        addTaskToUI(taskObj);

        taskInput.value = "";
        deadlineInput.value = "";
    });

    function saveTask(taskObj) {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.push(taskObj);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks() {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => addTaskToUI(task));
    }

    function addTaskToUI(taskObj) {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${taskObj.text}</strong> (${taskObj.category}) <br> ⏳ Deadline: ${taskObj.deadline} 
                        <button class="remove-task">❌</button>`;

        taskList.appendChild(li);

        li.querySelector(".remove-task").addEventListener("click", () => {
            removeTask(taskObj.text);
            li.remove();
        });
    }

    function removeTask(taskText) {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks = tasks.filter(task => task.text !== taskText);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Progress Tracker
    let xp = parseInt(localStorage.getItem("xp")) || 0;
    const xpDisplay = document.getElementById("xp-points");
    const progressBar = document.getElementById("progress-bar");
    const resetProgress = document.getElementById("reset-progress");

    function updateXP() {
        xpDisplay.textContent = `XP: ${xp}`;
        progressBar.value = xp % 100;
        localStorage.setItem("xp", xp);
    }

    addTaskButton.addEventListener("click", () => {
        xp += 10;
        updateXP();
    });

    resetProgress.addEventListener("click", () => {
        xp = 0;
        updateXP();
    });

    updateXP(); // Load XP on startup

    // Motivational Quotes
    const quotes = [
        "Success is not final, failure is not fatal: It is the courage to continue that counts. - Churchill",
        "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
        "You miss 100% of the shots you don’t take. - Wayne Gretzky"
    ];
    const quoteText = document.getElementById("quote-text");
    const fetchQuote = document.getElementById("fetch-quote");

    fetchQuote.addEventListener("click", () => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        quoteText.textContent = quotes[randomIndex];
    });

    // Reminder System
    const reminderTimeInput = document.getElementById("reminder-time");
    const setReminderButton = document.getElementById("set-reminder");
    const reminderStatus = document.getElementById("reminder-status");

    setReminderButton.addEventListener("click", () => {
        const reminderTime = reminderTimeInput.value;
        if (!reminderTime) {
            reminderStatus.textContent = "No reminder set.";
            return;
        }
        reminderStatus.textContent = `Reminder set for ${reminderTime}`;
        setTimeout(() => {
            alert("⏰ Time to focus on your tasks!");
        }, getTimeDifference(reminderTime));
    });

    function getTimeDifference(time) {
        const now = new Date();
        const [hours, minutes] = time.split(":").map(Number);
        const reminder = new Date();
        reminder.setHours(hours, minutes, 0, 0);
        return reminder - now;
    }

    // Daily Streak System
    let streak = parseInt(localStorage.getItem("streak")) || 0;
    const streakText = document.getElementById("streak-text");
    const resetStreak = document.getElementById("reset-streak");

    function updateStreak() {
        streakText.textContent = `Current Streak: ${streak} Days`;
        localStorage.setItem("streak", streak);
    }

    addTaskButton.addEventListener("click", () => {
        streak++;
        updateStreak();
    });

    resetStreak.addEventListener("click", () => {
        streak = 0;
        updateStreak();
    });

    updateStreak(); // Load streak on startup

    // Focus Mode
    let focusMode = localStorage.getItem("focusMode") === "true";
    const focusButton = document.getElementById("start-focus");
    const focusStatus = document.getElementById("focus-status");

    function updateFocusMode() {
        focusStatus.textContent = focusMode ? "Focus Mode: ON" : "Focus Mode: OFF";
        document.body.style.background = focusMode ? "#222" : "linear-gradient(135deg, #1b2a4e, #284e91)";
        localStorage.setItem("focusMode", focusMode);
    }

    focusButton.addEventListener("click", () => {
        focusMode = !focusMode;
        updateFocusMode();
    });

    updateFocusMode(); // Load focus mode on startup

    // Time Tracking
    let startTime, endTime;
    const startTracking = document.getElementById("start-tracking");
    const stopTracking = document.getElementById("stop-tracking");
    const trackedTime = document.getElementById("tracked-time");

    startTracking.addEventListener("click", () => {
        startTime = new Date();
        trackedTime.textContent = "Tracking...";
    });

    stopTracking.addEventListener("click", () => {
        if (startTime) {
            endTime = new Date();
            let timeSpent = Math.round((endTime - startTime) / 60000);
            trackedTime.textContent = `Total Time: ${Math.floor(timeSpent / 60)}h ${timeSpent % 60}m`;
        }
    });
});
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js")
        .then(() => console.log("Service Worker Registered"))
        .catch(err => console.log("Service Worker Registration Failed", err));
}
