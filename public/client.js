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

// For stopwatch
let status = 0;
let time = 0;

function startTimer() {
    status = 1;
    timer();
}

function stopTimer() {
    status = 0;
}

function resetTimer() {
    status = 0;
    time = 0;
}

function timer() {
    if (status == 1) {
        setTimeout(function() {
            time++
            let min = Math.floor(time/100/60);
            let sec = Math.floor(time/100);
            let millisec = time % 100;
            if (min < 10) {
                min = '0' + min;
            }
            if (sec >= 60) {
                sec = sec % 60;
            }
            if (sec < 10) {
                sec = '0' + sec;
            }
            //$('.timer-div').html(`${min} : ${sec} : ${millisec}`);
            $('.minutes').html(min);
            $('.seconds').html(sec);
            $('.milliseconds').html(millisec);
            timer();
        }, 10);
    }
}

//For starting and stopping timer
$('body').keydown(function(e){
    if (e.keyCode == 32) {
        if (status == 0) {
            resetTimer();
            $('.logo-wrap').hide();
            $('.instructions-div').hide();
            $('.scramble-div').hide();
            $('.stats-notes-section').hide();
            $('*').addClass('js-timer-ready-color');
            $('.timer-div').addClass('center-timer');
        }
    }
})

$('body').keyup(function(e){
    if(e.keyCode == 32){
        if (status == 0) {
            
            $('*').addClass('js-timer-running-color');
            $('.timer-div').addClass('center-timer');
            startTimer();
        } else {
            $('.logo-wrap').show();
            $('.instructions-div').show();
            $('.scramble-div').show();
            $('.stats-notes-section').show();
            $('*').removeClass('js-timer-running-color').removeClass('js-timer-ready-color');
            $('.timer-div').removeClass('center-timer');
            stopTimer();
            
        }
    }
 });


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

displayScrambleAlg(dataForScrambleAlg);


