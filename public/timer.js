"use strict";

window.onload = function() {
  getOldTasks();
};

function getOldTasks() {
  console.log("Getting tasks");
  const token = localStorage.getItem("token");
  const settings = {
    url: "http://localhost:8080/tasks",
    type: "GET",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ${token}`
    },
    success: function(data) {
      displayOldTasks(data);
    }
  };
  $.ajax(settings);
}

function displayOldTasks(data) {
  const tasks = data.tasks;
  const mostRecentTasks = tasks.slice(Math.max(tasks.length - 3, 1)).reverse();
  console.log(mostRecentTasks);
  const $task1 = $(".task1");
  const $task2 = $(".task2");
  const $task3 = $(".task3");
  /*const oldTaskTemplate = `
  <h3 class="prior-task-title column1-title">${mostRecentTasks[i].task}</h3>
  <ul class="task-details-list">
      <li class="prior-task-item date">${mostRecentTasks[i].date}</li>
      <li class="prior-task-item time">${mostRecentTasks[i].time}</li>
      <li class="prior-task-item notes">${mostRecentTasks[i].notes}</li>
  </ul>`;*/
  for (let i = 1; i < 4; i++) {
    $(`.task${i}`).html(`
    <h3 class="prior-task-title column1-title">${
      mostRecentTasks[i - 1].task
    }</h3>
    <ul class="task-details-list">
        <li class="prior-task-item date">${mostRecentTasks[i - 1].date}</li>
        <li class="prior-task-item time">${mostRecentTasks[i - 1].time}</li>
        <li class="prior-task-item notes">${mostRecentTasks[i - 1].notes}</li>
    </ul>
    <button class="delete-task" type="button">Delete</button>`);
  }
}

//Button for delete. Temporarily removed
//<button class="delete-task" type="button">Delete</button>

// For stopwatch
let timerStatus = 0;
let time = 0;
let seconds = 0;

function startTimer() {
  timerStatus = 1;
  timer();
}

function stopTimer() {
  timerStatus = 0;
  seconds = time * 0.01 + 0.01;
  console.log(seconds);
}

function resetTimer() {
  $(".seconds").html("0");
  $(".milliseconds").html("00");
  console.log(time);
  timerStatus = 0;
  time = 0;
}

function timer() {
  if (timerStatus == 1) {
    setTimeout(function() {
      time++;
      let min = Math.floor(time / 100 / 60);
      let sec = Math.floor(time / 100);
      let millisec = time % 100;
      if (min < 10) {
        min = "0" + min;
      }
      if (sec >= 60) {
        sec = sec % 60;
      }
      if (sec < 10) {
        sec = "0" + sec;
      }
      //$('.timer-div').html(`${min} : ${sec} : ${millisec}`);
      $(".minutes").html(min);
      $(".seconds").html(sec);
      $(".milliseconds").html(millisec);
      timer();
    }, 10);
  }
}

//Handle stopwatch
function handleTimer() {
  $(".timer-btn").click(event => {
    if (timerStatus == 0) {
      handleStartTimer();
    } else {
      handleStopTimer();
    }
  });
}

function handleStartTimer() {
  event.preventDefault();
  fadeOutPage();
  startTimer();
}

function fadeOutPage() {
  const fade = $(
    ".logo-wrap, .user-panel, .subheader, .prior-task, .btn-wrapper"
  );
  $(fade).addClass("js-fade-out-all");
  $(".start-timer-btn")
    .addClass("js-stop-timer-btn")
    .html("Stop");
}

function handleStopTimer() {
  event.preventDefault();
  fadeInPage();
  stopTimer();
  showPopUpForm();
}

function fadeInPage() {
  const fade = $(
    ".logo-wrap, .user-panel, .subheader, .prior-task, .btn-wrapper"
  );
  $(fade).removeClass("js-fade-out-all");
  $(".start-timer-btn")
    .removeClass("js-stop-timer-btn")
    .html("Start");
}

//When user stops timer
function showPopUpForm() {
  const newTask = $("#tasks option:selected").text();
  const today = new Date();
  const todayNeat = today.toLocaleDateString("en-US");
  $(".opaque-background").addClass("js-opaque-background");
  $(".popup-div").attr("hidden", false);
  $(".task-notes-form").addClass("js-popup-form");
  $(".popup-title").html(`${newTask}`);
  $(".new-task-date").html(`${todayNeat}`);
  $(".new-task-time").prepend(`${seconds} seconds`);
}

//After the timer has run and form is displayed
function handleTaskSubmit() {
  $(".submit-task").click(event => {
    const date = $(".new-task-date").text();
    const time = $(".new-task-time").text();
    const task = $(".popup-title").text();
    const notes = $("#task-notes").val();
    $(".task-notes-form").submit(event => {
      event.preventDefault();
      postNewTask(date, time, task, notes);
    });
  });
}

function postNewTask(date, time, task, notes) {
  const data = {
    date: date,
    time: time,
    task: task,
    notes: notes
  };
  const token = localStorage.getItem("token");
  const settings = {
    url: "http://localhost:8080/tasks",
    type: "POST",
    dataType: "json",
    data: data,
    xhrFields: {
      withCredentials: false
    },
    headers: {
      contentType: "application/x-www-form-urlencoded",
      contentType: "application/json",
      Authorization: `Bearer ${token}`
    },
    success: function() {
      console.log("Now we are cooking with gas");
      removePopup();
      getOldTasks();
    },
    error: function(err) {
      console.log(err);
    }
  };
  $.ajax(settings);
}

function handleDeleteTask() {
  $(".delete-task").click(event => {
    event.preventDefault();
    deleteTask();
  });
}

function deleteTask() {
  const token = localStorage.getItem("token");
  const settings = {
    url: "http://localhost:8080/:id",
    type: "DELETE",
    dataType: "json",
    headers: {
      Authorization: `Bearer ${token}`
    },
    success: function() {
      console.log("Now we are cooking with gas");
      getOldTasks();
    },
    error: function(err) {
      console.log(err);
    }
  };
  $.ajax(settings);
}

function handleDropTask() {
  $(".drop-task").click(event => {
    removePopup();
    $(".new-task-time").empty();
  });
}

function removePopup() {
  $(".opaque-background").removeClass("js-opaque-background");
  $(".popup-div").attr("hidden", true);
  $(".task-notes-form").removeClass("js-popup-form");
  $("#tasks").val("select-task");
  fadeInPage();
  resetTimer();
}

$(function() {
  handleTimer();
  handleTaskSubmit();
  handleDropTask();
  handleDeleteTask();
});

//Logout
$(function() {
  $(".logout-btn").click(function(event) {
    event.preventDefault();
    localStorage.setItem("token", "");
    window.location.href = "login.html";
  });
});
