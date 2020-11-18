const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const dbstore = require('express-mysql-session');
const { database } = require('./keys');

// initializations
const app = express();


// settings
app.set('port', process.env.PORT || 8000);
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');


// middlewares
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false,
    store: new dbstore(database)
}));

app.use(flash());
app.use(morgan('dev'));
// enable only basic data, no images
app.use(express.urlencoded({ extends: false }));
// enable JSON
app.use(express.json());


// globals 
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    next();
})

// routes
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/links', require('./routes/links'));


// public files
app.use(express.static(path.join(__dirname, 'public')))

// Starting server
app.listen(app.get('port'), () => {
    console.log('Server on port:', app.get('port'));
});


