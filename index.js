// App direct dependencies
const express = require('express');
const session = require('express-session');
const router = require('./routes/workout_routes');
const path = require('path');
const mustache = require('mustache-express');
const bodyParser = require('body-parser');
const auth = require('./auth/auth');
const passport = require('passport');
// App setup
const app = express();
// Static resources setup
const public = path.join(__dirname, 'public');
console.log("public is:", public);
app.use(express.static('public'));
// Mustache templates setup
app.engine('mustache', mustache());
app.set('view engine', 'mustache');
// Body parser initialization
app.use(bodyParser.urlencoded({ extended: false }));
// Session cookie setup
app.use(session({ 
    secret: "ily",
    cookie: {
        maxAge: 1800000,
    },
    resave: false, 
    saveUninitialized: false 
}));
// Authentication setup
app.use(passport.initialize());
app.use(passport.session());
// Initialize authentication with passport
auth.setup(app)
// Use the router handling
app.use('/',router);
// Initialize the application
app.listen(3000,() => {
    console.log('Server started in port 3000. Ctrl^c to quit.');
})