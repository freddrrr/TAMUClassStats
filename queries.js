const queryString = require('querystring');

const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'guru',
    host: 'tamucoursestats.cv3iclekihw6.us-east-2.rds.amazonaws.com',
    database: 'postgres_test', //'ClassStats',
    password: 'gurupassword0',
    port: 5432,
});

//Used in development to populate DB. Not for use in release
/*
const fs = require('fs');
const lineReader = require("line-reader")
const populateDepartments = (requests, response) => {
    lineReader.eachLine("output.csv", function (line) {
        let parts = line.split(',')
        let abbrv = parts[0]
        let full = parts[1]

        pool.query("INSERT INTO \"Departments\" VALUES ($1, $2)",
            [abbrv, full]
        )
    });
}
*/

const authenticateUser = (request, response) => {
    //console.log("Called authenticateUser");

    var email = request.body.email;
    var password = request.body.password;

    console.log(email)
    console.log(password);

    if (email && password) {
        pool.query("SELECT * FROM public.\"Users\" WHERE \"Email\" = $1 AND \"Password\" = $2",
            [email, password],
            (err, res) => {
                if (err) {
                    throw err;
                    response.status(500).send("An error has occurred while attempting to interact with the database");
                }

                if (res.rowCount > 0) {
                    request.session.loggedin = true;
                    request.session.email = email;
                    response.redirect("/search");
                }
                else {
                    // CURRENTLY NOT FINISHED, GOAL IS TO HAVE THIS REDIRECT SHOW ALERT AT TOP OF LOGIN PAGE
                    // WILL DISPLAY ERROR AND HYPERLINK ON PAGE TO REDIRECT BACK TO LOGIN
                    request.session.error = 'Incorrect username or password';
                    response.redirect(401, '/login');
                    //response.render('login', { error: request.session.error });
                }
            }
        )
    }
    else {
        response.send("Please enter Email and Password");
    }
}

const getSemesters = (request, response) => {
    //console.log("Called getSemesters");

    pool.query("SELECT * FROM public.\"Semesters\"",
        (err, res) => {
            if (err) {
                response.status(500).send("An error has occurred while attempting to interact with the database");
            }

            //Populate result array with semesters
            let semesters = [];
            res.rows.forEach((elem) => {
                let semester = elem.Term + " " + elem.Year;
                //console.log(semester);
                semesters.push(semester);
            });
            response.status(200).json(semesters);
        }
    );
}

const getDepartments = (request, response) => {
    //console.log("Called getDepartments");

    pool.query("SELECT * FROM public.\"Departments\"",
        (err, res) => {
            if (err) {
                response.status(500).send("An error has occurred while attempting to interact with the database");
            }

            //Populate result array with departments
            let departments = [];
            res.rows.forEach((elem) => {
                let department = elem.Abbreviation + " - " + elem.FullName;
                //console.log(department);
                departments.push(department);
            });
            response.status(200).json(departments);
        }
    );
}

const getCourseNumbersByDepartment = (request, response) => {
    //console.log("Called getCourseNumbersByDepartment");

    const qStringParams = queryString.parse(request.params.department);
    pool.query("SELECT * FROM public.\"Courses\" WHERE \"Department\" = $1",
        [qStringParams.department],
        (err, res) => {
            if (err) {
                response.status(500).send("An error has occurred while attempting to interact with the database");
            }

            //Populate result array with courses
            let courses = [];
            res.rows.forEach((elem) => {
                let course = elem.CourseNum + " - " + elem.CourseTitle;
                //console.log(course);
                courses.push(course);
            });
            response.status(200).json(courses);
        }
    );
}

const getProfessors = (request, response) => {
    //console.log("Called getProfessors");

    pool.query("SELECT * FROM public.\"Professors\"",
        (err, res) => {
            if (err) {
                response.status(500).send("An error has occurred while attempting to interact with the database");
            }

            //Populate result array with professors
            let professors = [];
            res.rows.forEach((elem) => {
                let professor = elem.LastName + ", " + elem.FirstName;
                //console.log(professor);
                professors.push(professor);
            });
            response.status(200).json(professors);
        }
    );
}

const getCourseSectionsByCourseNum = (request, response) => {
    console.log("Called getCourseSectionsByCourseNum");

    pool.query("", //TODO: Write course section retrieval query
        (err, res) => {
            if (err) {
                response.status(500).send("An error has occurred while attempting to interact with the database");
            }

            //Return result array
            response.status(200).json(res.rows);
        }
    )
}

const getReviewsByUser = (request, response) => {
    console.log("Called getReviewsByUser");

    pool.query("", //TODO: Write review retrieval query...need to first incorporate Users table
        (err, res) => {
            if (err) {
                response.status(500).send("An unknown error has occurred while attempting to interact with the database");
            }
            
            //TODO: Return array of particular format
        }
    )
}

const postReview = (request, response) => {
    console.log("Called postReview");

    pool.query("", //TODO: Write insertion query...need to first incorporate Reviews table
        (err, res) => {
            if (err) {
                response.status(500).send("An error has occurred while attempting to interact with the database");
            }

            //Respond with 201 (Created) HTTP code
            response.sendStatus(201);
        }
    )
}

module.exports = {
    //populateDepartments,

    authenticateUser,
    getSemesters,
    getDepartments,
    getCourseNumbersByDepartment,
    getProfessors,
    getCourseSectionsByCourseNum,
    getReviewsByUser,
    postReview
}
