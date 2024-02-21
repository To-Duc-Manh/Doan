const express = require('express');
const path = require('path');
const handlebars = require('express-handlebars');
const ejs = require('ejs');
const app = express();
const port = 3000;
const connect = require('./config/db');
const bodyParser = require('body-parser');
const route = require('./routes');

const session = require('express-session');


app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}))

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

// template engine
app.engine('hbs', handlebars.engine({
    extname: '.hbs',
}));
app.engine('ejs', ejs.renderFile);
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'resources/views'));

//route
route(app);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})