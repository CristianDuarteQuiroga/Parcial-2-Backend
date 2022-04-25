const express = require('express');
const bp = require('body-parser');
const morgan = require('morgan');


var bodyParser = require('body-parser')
var app = express()
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


app.use(morgan('dev'));

//config
app.set('port', 19991);

//routes
app.use(require('./routes/routes'));

//empezando server
app.listen(app.get('port'), () => {
    console.log(`server on port ${app.get('port')}`);
})