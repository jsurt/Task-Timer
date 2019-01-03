const express = require('express');
const app = express();
app.use(express.static('public'));
app.listen(process.env.PORT || 8080);

app.get('/', (req, res) => {
    res.sendStatus(200);
});     


module.exports = { app };