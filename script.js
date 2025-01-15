document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('task');
  const addTaskBtn = document.getElementById('addTaskBtn');
  const taskList = document.getElementById('taskList');
  const quoteMessageDiv = document.getElementById('quoteMessage');
  const errorMessageDiv = document.getElementById('errorMessage');
  const streakCountDiv = document.getElementById('streakCount');

  const motivationalQuotes = [
    "You can do it!",
    "Keep pushing forward!",
    "Every step counts!",
    "Stay focused and keep going!",
    "Believe in yourself!"
  ];

  let streakCount = 0;
  let lastCompletionDate = null;
  let currentTimer = null; // Variable to keep track of the currently running timer

  function showError(message) {
    errorMessageDiv.textContent = message;
    errorMessageDiv.style.display = 'block';
    setTimeout(() => {
      errorMessageDiv.style.display = 'none';
      taskInput.value = '';
    }, 3000); // Adjust the time as needed
  }

  // Load tasks from local storage
  loadTasksFromLocalStorage();

  // Display a motivational quote immediately on page load
  showMotivationalQuote();

  addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
      if (currentTimer !== null) {
        showError('A timer is already running for another task.');
        return;
      }
      addTask(taskText);
      taskInput.value = '';
      showMotivationalQuote();
      saveTasksToLocalStorage();
    } else {
      showError('Please enter a task.');
    }
  });

  function addTask(taskText) {
    const li = createTaskElement(taskText);
    taskList.appendChild(li);
    clearErrorMessage(); // Clear error message when a new task is added
    setTimeout(clearErrorMessage, 5000); // Clear error message after 5 seconds
  }

  function createTaskElement(taskText) {
    const li = document.createElement('li');
    li.textContent = taskText;

    const deleteBtn = createButton('Delete', () => {
      taskList.removeChild(li);
      clearErrorMessage();
      saveTasksToLocalStorage();
    });

    const timerInput = createInput('number', 'Minutes', '1');
    const timerBtn = createButton('Start Timer', () => {
      const minutes = parseInt(timerInput.value);
      if (!isNaN(minutes) && minutes > 0) {
        if (currentTimer !== null) {
          showError('A timer is already running for another task.');
          setTimeout(clearErrorMessage, 5000); // Clear error message after 5 seconds
          return;
        }
        startTimer(li, minutes, timerInput);
        clearErrorMessage();
      } else {
        showError('Please enter a valid number of minutes.');
      }
    });

    li.appendChild(timerInput);
    li.appendChild(timerBtn);
    li.appendChild(deleteBtn);

    return li;
  }

  function createButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.addEventListener('click', onClick);
    return button;
  }

  function createInput(type, placeholder, min) {
    const input = document.createElement('input');
    input.type = type;
    input.placeholder = placeholder;
    if (min) input.min = min;
    return input;
  }

  function startTimer(taskElement, minutes, timerInput) {
    let timeLeft = minutes * 60; // Convert minutes to seconds
    const timerDisplay = document.createElement('span');
    timerDisplay.textContent = formatTime(timeLeft);
    taskElement.appendChild(timerDisplay);

    currentTimer = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = formatTime(timeLeft);
      if (timeLeft % 60 === 0) { // Show progress reminder every minute
        showMotivationalQuote();
      }
      if (timeLeft <= 0) {
        clearInterval(currentTimer);
        currentTimer = null; // Reset the timer after completion
        showMessage('Time is up! Take a short break and then continue.');
        taskElement.removeChild(timerDisplay);
        timerInput.value = ''; // Clear the timer input value
        incrementStreak();
      }
    }, 1000);
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  function showMotivationalQuote() {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    showMessage(motivationalQuotes[randomIndex]);
  }

  function showMessage(message) {
    quoteMessageDiv.textContent = message;
    quoteMessageDiv.style.display = 'block';
  }

  function showErrorMessage(message) {
    errorMessageDiv.textContent = message;
    errorMessageDiv.style.display = 'block';
  }

  function clearErrorMessage() {
    errorMessageDiv.textContent = '';
    errorMessageDiv.style.display = 'none';
  }

  function incrementStreak() {
    const today = new Date().toDateString();
    if (lastCompletionDate !== today) {
      streakCount++;
      lastCompletionDate = today;
      updateStreakCount();
    }
  }

  function updateStreakCount() {
    streakCountDiv.textContent = `Streak: ${streakCount} day(s)`;
    streakCountDiv.style.display = 'block';
  }

  function saveTasksToLocalStorage() {
    const tasks = [];
    taskList.querySelectorAll('li').forEach(taskElement => {
      const taskText = taskElement.childNodes[0].textContent.trim();
      tasks.push(taskText);
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(taskText => addTask(taskText));
  }
});
