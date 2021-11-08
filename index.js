/*Constants and Imports*/
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries')
const port = 3000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
//Add support for CSS stylesheets in /content folder
app.use(express.static(__dirname + "/content"));

/*HTML Pages*/
//Render search.html
app.get(['/', '/search'], (request, response) => {
    response.sendFile(__dirname + "/content/search.html");
})
//Render review.html
app.get('/review', (request, response) => {
    response.sendFile(__dirname + "/content/review.html");
})

/*Database Queries*/
//Pull list of course numbers
app.get('/query/course-numbers', db.getCourseNumbers)
//Pull list of departments
app.get('/query/departments', db.getDepartments)
//Pull list of professors
app.get('/query/professors', db.getProfessors)
//Pull list of semesters
app.get('/query/semesters', db.getSemesters)

/*
//(http://localhost:3000/users)
app.get('/users', db.getUsers)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
*/

app.listen(port, () => {
  console.log('App running on port ${port}.')
})
