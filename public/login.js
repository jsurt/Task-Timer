("use strict");

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

//User login
function handleUserLogin() {
  $(".submit-login").click(() => {
    const username = $("#login-username").val();
    const password = $("#login-password").val();
    $(".login-form").submit(event => {
      event.preventDefault();
      postUserLogin(username, password);
    });
  });
}

function postUserLogin(username, password) {
  console.log("Sending ajax request for login");
  const settings = {
    url: "http://localhost:8080/auth/login",
    type: "POST",
    dataType: "json",
    data: JSON.stringify({
      username: username,
      password: password
    }),
    contentType: "application/json; charset=utf-8",
    success: function(data) {
      localStorage.setItem("token", data.authToken);
      const token = localStorage.getItem("token");
      $("input").val("");
      requestTimerPage(token);
    },
    error: function(err) {
      console.log(err);
      $(".demo-info")
        .html("Incorrect username or password!")
        .addClass("login-error");
    }
  };
  $.ajax(settings);
}

//User Signup
function handleUserSignUp() {
  $(".submit-signup").click(() => {
    const $password = $("#create-password").val();
    const $confirmPassword = $("#create-confirm-password").val();
    if ($password === $confirmPassword) {
      $(".signup-form").submit(event => {
        event.preventDefault();
        const firstName = $("#firstName").val();
        const lastName = $("#lastName").val();
        const username = $("#create-username").val();
        const password = $password;
        postUserSignUp(firstName, lastName, username, password);
        console.log("form submitted");
      });
    } else {
      event.preventDefault();
      alert("Passwords do not match");
      $("#password, #confirm-password").val("");
    }
  });
}

function postUserSignUp(firstName, lastName, username, password) {
  console.log("Sending ajax request");
  const settings = {
    url: "http://localhost:8080/users",
    type: "POST",
    dataType: "json",
    data: JSON.stringify({
      firstName: firstName,
      lastName: lastName,
      username: username,
      password: password
    }),
    contentType: "application/json; charset=utf-8",
    success: function() {
      console.log("data sent to server");
      $("input").val("");
    }
  };
  $.ajax(settings);
}

//Go to user's timer page
function requestTimerPage(token) {
  const settings = {
    url: "http://localhost:8080/tasks",
    type: "GET",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ${token}`
    },
    success: function(tasks) {
      window.location.href = "timer.html";
    }
  };
  $.ajax(settings);
}

$(function() {
  handleUserLogin();
  handleUserSignUp();
});

// Generate random turns for a cube scramble
/*let scrambleAlg = [];

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
});*/
