'use strict'

const MOCK_DATA = {
    recordedTimes: [
        {
            "id": 111111,
            "time": 40.2,
            "notes": 'man, that was a great solve',
            "date": new Date()
        },
        {
            "id": 222222,
            "time": 35.2,
            "notes": 'hey that was better',
            "date": new Date()
        },
        {
            "id": 333333,
            "time": 41.1,
            "notes": 'oof, not as good',
            "date": new Date()
        },
        {
            "id": 444444,
            "time": 23.5,
            "notes": 'well that was great!!!',
            "date": new Date()
        },
        {
            "id": 555555,
            "time": 45.0,
            "notes": 'dang back to square one',
            "date": new Date()
        },
        {
            "id": 666666,
            "time": 39.3,
            "notes": 'ehhhhhhhh',
            "date": new Date()
        }
    ]
};

function getTimesData(callback) {
    setTimeout(() => {callback(MOCK_DATA)}, 500);
}

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

$(function() {
    getAndDisplayTimes();
});
