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

  addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
      addTask(taskText);
      taskInput.value = '';
      showMotivationalQuote();
    }
  });

  function addTask(taskText) {
    const li = document.createElement('li');
    li.textContent = taskText;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
      taskList.removeChild(li);
      clearErrorMessage();
    });

    const timerInput = document.createElement('input');
    timerInput.type = 'number';
    timerInput.placeholder = 'Minutes';
    timerInput.min = '1';

    const timerBtn = document.createElement('button');
    timerBtn.textContent = 'Start Timer';
    timerBtn.addEventListener('click', () => {
      const minutes = parseInt(timerInput.value);
      if (!isNaN(minutes) && minutes > 0) {
        startTimer(li, minutes);
        clearErrorMessage();
      } else {
        showErrorMessage('Please enter a valid number of minutes.');
      }
    });

    li.appendChild(timerInput);
    li.appendChild(timerBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  }

  function startTimer(taskElement, minutes) {
    let timeLeft = minutes * 60; // Convert minutes to seconds
    const timerDisplay = document.createElement('span');
    timerDisplay.textContent = formatTime(timeLeft);
    taskElement.appendChild(timerDisplay);

    const timerInterval = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = formatTime(timeLeft);
      if (timeLeft % 60 === 0) { // Show progress reminder every minute
        console.log("Progress reminder triggered");
        showProgressReminder();
      }
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        console.log("Timer ended");
        showMessage('Time is up! Take a short break and then continue.');
        taskElement.removeChild(timerDisplay);
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
    console.log("Motivational quote displayed");
    showMessage(motivationalQuotes[randomIndex]);
  }

  function showProgressReminder() {
    console.log("Progress reminder displayed");
    showMessage("Keep going! You're making progress!");
  }

  function showMessage(message) {
    console.log("Message displayed:", message);
    quoteMessageDiv.textContent = message;
    quoteMessageDiv.style.display = 'block';
  }

  function showErrorMessage(message) {
    console.log("Error message displayed:", message);
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
});
