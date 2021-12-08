/*Constants and Imports*/
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const db = require('./queries');
const session = require('express-session');
const port = 3001;

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
//Add support for CSS stylesheets in /content folder
app.use(express.static(__dirname + "/content"));
app.use(session({
    secret: '2]fL>9VD=[;u9FJ',
    resave: true,
    saveUninitialized: true
}));

/*HTML Pages*/
//Render login.html
app.get(['/', '/login'], (request, response) => {
    if (request.session.loggedin) {
        response.redirect("/search");
    }
    else {
        response.sendFile(__dirname + "/content/login.html");
    }
})
//Render search.html
app.get('/search', (request, response) => {
    if (!request.session.loggedin) {
        response.redirect("/login");
    }
    else {
        response.sendFile(__dirname + "/content/search.html");
    }
})
//Render review.html
app.get('/review', (request, response) => {
    if (!request.session.loggedin) {
        response.redirect("/login");
    }
    else {
        response.sendFile(__dirname + "/content/review.html");
    }
})

/*Database Queries*/
//Perform user authentication
app.post('/auth', db.authenticateUser)
//Post a new review to the database
app.post('/post-review', db.postReview)
//Pull list of course numbers
app.get('/query/course-numbers/:department', db.getCourseNumbersByDepartment)
//Pull list of departments
app.get('/query/departments', db.getDepartments)
//Pull list of professors
app.get('/query/professors', db.getProfessors)
//Pull list of semesters
app.get('/query/semesters', db.getSemesters)
//Perform course search
app.post('/query/search', db.getSectionsByCriteria)

/*Development Endpoints (i.e. not active for release)*/
//app.get("/dev/dept", db.populateDepartments)

app.listen(port, () => {
  console.log('App running on port %s.', port)
})
