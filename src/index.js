const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');



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
app.use(morgan('dev'));
// enable only basic data, no images
app.use(express.urlencoded({ extends: false }));
// enable JSON
app.use(express.json());

// globals 
app.use((req, res, next) => {
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


