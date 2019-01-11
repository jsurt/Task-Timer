'use strict'

// This code is to display the requested form, either login or sign up
function selectLoginOrSignupForm() {
    let $loginLink = $('.login-link');
    let $signupLink = $('.signup-link');
    let $loginForm = $('.login-form');
    let $signupForm = $('.signup-form');
    $signupLink.on('click', (event) => {
        event.preventDefault();
        if (!($signupLink.hasClass('.selected-form'))) {
            $loginLink.removeClass('selected-form');
            $signupLink.addClass('selected-form');
            $loginForm.attr('hidden', true);
            $signupForm.attr('hidden', false);
        } 
    });
    $loginLink.on('click', (event) => {
        event.preventDefault();
        if (!($loginLink.hasClass('.selected-form'))) {
            $loginLink.addClass('selected-form');
            $signupLink.removeClass('selected-form');
            $loginForm.attr('hidden', false);
            $signupForm.attr('hidden', true);
        } 
    });
}

selectLoginOrSignupForm();

// AJAX request to the backend for user sign up
function userSignUp() {
    $('.submit-signup').click(() => {
        $('.signup-form').submit((event) => {
            event.preventDefault();
            console.log('form submitted');
            postUserSignUp();
        });
    });   
}

function postUserSignUp() {
    const settings = {
        url: '/users',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
            userName: $('#userName').val()
        }),
        contentType: "application/json; charset=utf-8",
        success: function() {
            console.log('data sent to server');
            $('input').val('');
        }
    };
    $.ajax(settings);
}

userSignUp();


function displayTimesData(data) {
    for (let i = 0; i < data.recordedTimes.length; i++) {
        $('.js-times').append(`
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

function testFunction() {
     console.log('this is a test');
}


// Generate random turns for a cube scramble
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
    "D2",
];

function generateScrambleAlg(data) {
    let scrambleAlg = [];
    for (let i = 0; i < 20; i++) {
        let randomIndex = Math.floor(Math.random() * 18);
        scrambleAlg.push(`${data[randomIndex]}   `);
    }
    console.log(scrambleAlg);
    return scrambleAlg;
};

function displayScrambleAlg(data) {
    $('.js-scramble').append(generateScrambleAlg(dataForScrambleAlg));
};

generateScrambleAlg(dataForScrambleAlg);
displayScrambleAlg(dataForScrambleAlg);