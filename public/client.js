"use strict";

/* Styling for login/signup forms
$(function() {
    const $input = $('input');
    const $inputValue = $('input').val();
    if (!$inputValue) {
        $input.addClass('input-filled');
    }
})*/

// This code is to display the requested form, either login or sign up
function selectLoginOrSignupForm() {
  let $loginLink = $(".login-link");
  let $signupLink = $(".signup-link");
  let $loginForm = $(".login-form");
  let $signupForm = $(".signup-form");
  $signupLink.on("click", event => {
    event.preventDefault();
    if (!$signupLink.hasClass(".selected-form")) {
      $loginLink.removeClass("selected-form");
      $signupLink.addClass("selected-form");
      $loginForm.attr("hidden", true);
      $signupForm.attr("hidden", false);
    }
  });
  $loginLink.on("click", event => {
    event.preventDefault();
    if (!$loginLink.hasClass(".selected-form")) {
      $loginLink.addClass("selected-form");
      $signupLink.removeClass("selected-form");
      $loginForm.attr("hidden", false);
      $signupForm.attr("hidden", true);
    }
  });
}

selectLoginOrSignupForm();

// AJAX request to the backend for user sign up
function userSignUp() {
  $(".submit-signup").click(() => {
    const $password = $("#password").val();
    const $confirmPassword = $("#confirm-password").val();
    if ($password === $confirmPassword) {
      $(".signup-form").submit(event => {
        event.preventDefault();
        console.log("form submitted");
        postUserSignUp();
      });
    } else {
      event.preventDefault();
      alert("Passwords do not match");
      $("#password, #confirm-password").val("");
    }
  });
}

function postUserSignUp() {
  const settings = {
    url: "/users",
    type: "POST",
    dataType: "json",
    data: JSON.stringify({
      firstName: $("#firstName").val(),
      lastName: $("#lastName").val(),
      userName: $("#userName").val()
    }),
    contentType: "application/json; charset=utf-8",
    success: function() {
      console.log("data sent to server");
      $("input").val("");
    }
  };
  $.ajax(settings);
}

userSignUp();

function displayTimesData(data) {
  for (let i = 0; i < data.recordedTimes.length; i++) {
    $(".js-times").append(`
            <li class='time-item'>
                <div>${data.recordedTimes[i].time}</div>
                <div>${data.recordedTimes[i].notes}</div>
                <div>${data.recordedTimes[i].date}</div>
            </li>
        `);
  }
}

function getAndDisplayTimes() {
  getTimesData(displayTimesData);
}

function testDisplayData() {
  getAndDisplayTimes();
}

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

function listenForSpaceBarDown() {
  const $popup = $(".popup-div");
  $("body").keydown(function(e) {
    if (e.keyCode == 32 && !$popup.is(":visible")) {
      let $solvenotes = $("#solve-notes");

      if (timerStatus == 0) {
        resetTimer();
        $(
          ".logo-wrap, .instructions-div, .scramble-div, .stats-notes-section"
        ).hide();
        $("*").addClass("js-timer-ready-color");
        $(".timer-div").addClass("center-timer");
      }
    } else {
      console.log("test");
    }
  });
}

function listenForSpaceBarUp() {
  const $popup = $(".popup-div");
  $("body").keyup(function(e) {
    if (e.keyCode == 32 && !$popup.is(":visible")) {
      let $solvenotes = $("#solve-notes");

      if (timerStatus == 0) {
        startTimer();
        $("*").addClass("js-timer-running-color");
      } else {
        stopTimer();
        $(
          ".logo-wrap, .instructions-div, .scramble-div, .stats-notes-section"
        ).show();
        $("*")
          .removeClass("js-timer-running-color")
          .removeClass("js-timer-ready-color");
        $(".timer-div").removeClass("center-timer");
        showPopUpForm();
      }
    } else {
      console.log("test");
    }
  });
}

function showPopUpForm() {
  $(".opaque-background").addClass("js-opaque-background");
  $(".popup-div, .popup-title, .popup-data, .submit-notes").attr(
    "hidden",
    false
  );
  $(".solve-notes-form").addClass("popup-form");
  $(".new-solve-time").prepend(`${seconds} seconds`);
  $(".new-solve-alg").html(scrambleAlg);
}

// Generate random turns for a cube scramble
let scrambleAlg = [];

const dataForScrambleAlg = [
  "R",
  "R'",
  "R2",
  "L",
  "L'",
  "L2",
  "F",
  "F'",
  "F2",
  "B",
  "B'",
  "B2",
  "U",
  "U'",
  "U2",
  "D",
  "D'",
  "D2"
];

function generateScrambleAlg(data) {
  //let scrambleAlg = [];
  for (let i = 0; i < 20; i++) {
    let randomIndex = Math.floor(Math.random() * 18);
    scrambleAlg.push(`${data[randomIndex]}   `);
  }
  console.log(scrambleAlg);
  return scrambleAlg;
}

function displayScrambleAlg(data) {
  $(".js-scramble").append(generateScrambleAlg(dataForScrambleAlg));
}

$(function() {
  displayScrambleAlg(dataForScrambleAlg);
  listenForSpaceBarDown();
  listenForSpaceBarUp();
});
