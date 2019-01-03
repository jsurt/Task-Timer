const express = require('express');
const app = express();
app.use(express.static('public'));
app.listen(process.env.PORT || 8080);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
    res.status(200);
});     

app.get('/timer', (req, res) => {
    res.sendFile(__dirname + '/public/timer.html');
    res.status(200);
});

app.get('/times', (req, res) => {
    res.sendFile(__dirname + '/public/times.html');
    res.status(200);
});

module.exports = { app };