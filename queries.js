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

    if (email && password) {
        pool.query("SELECT * FROM public.\"Users\" WHERE \"Email\" = $1 AND \"Password\" = $2",
            [email, password],
            (err, res) => {
                if (err) {
                    throw err;
                    response.status(500).send("An error has occurred while attempting to interact with the database");
                }
                else {

                    if (res.rowCount > 0) {
                        request.session.loggedin = true;
                        request.session.email = email;
                        request.session.userId = res.rows[0].UserID;
                        response.redirect("/search");
                    }
                    else {
                        //response.send("Incorrect Email and/or Password!");
                        // CURRENTLY NOT FINISHED, GOAL IS TO HAVE THIS REDIRECT SHOW ALERT AT TOP OF LOGIN PAGE
                        // WILL DISPLAY ERROR AND HYPERLINK ON PAGE TO REDIRECT BACK TO LOGIN
                        request.session.error = 'Incorrect username or password';
                        response.redirect(401, '/login');
                        //response.render('login', { error: request.session.error });
                    }
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
            else {
                //Populate result array with semesters
                let semesters = [];
                res.rows.forEach((elem) => {
                    let semester = elem.Term + " " + elem.Year;
                    semesters.push(semester);
                });
                response.status(200).json(semesters);
            }
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
            else {
                //Populate result array with departments
                let departments = [];
                res.rows.forEach((elem) => {
                    let department = elem.Abbreviation + " - " + elem.FullName;
                    departments.push(department);
                });
                response.status(200).json(departments);
            }
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
            else {
                //Populate result array with courses
                let courses = [];
                res.rows.forEach((elem) => {
                    let course = elem.CourseNum + " - " + elem.CourseTitle;
                    courses.push(course);
                });
                response.status(200).json(courses);
            }
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
            else {
                //Populate result array with professors
                let professors = [];
                res.rows.forEach((elem) => {
                    let professor = elem.LastName + ", " + elem.FirstName;
                    professors.push([professor, elem.UIN]);
                });
                response.status(200).json(professors);
            }
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
            else {
                //Return result array
                response.status(200).json(res.rows);
            }
        }
    )
}

//TODO: Test function - Function not currently implemented into site design
const getReviewsByUser = (request, response) => {
    console.log("Called getReviewsByUser");

    var userId = request.session.userId;

    pool.query("SELECT * FROM public.\"Reviews\" WHERE \"UserID\" = $1",
        [userId],
        (err, res) => {
            if (err) {
                response.status(500).send("An unknown error has occurred while attempting to interact with the database");
            }
            else {
                //Populate result array with Reviews entries associated with a particular User
                response.status(200).json(res.rows);
            }
        }
    )
}

//TODO: Write sorting part of query. Determine how to calculate Professor's rating
const getSectionsByCriteria = (request, response) => {
    console.log("Called getSectionsByCriteria");

    var semester = request.body.semester;
    var term = semester.split(' ')[0];
    var year = semester.split(' ')[1];
    var department = request.body.department;
    var courseNumber = request.body.courseNumber;
    var filter = request.body.filter;
    var filterQueryString = "";
    var filterQueryString2 = "";

    //console.log(term);
    //console.log(year);
    //console.log(department);
    //console.log(courseNumber);
    //console.log(filter);

    switch (filter) {
        case "Average GPA":
            filterQueryString = "";
            break;
        case "Communication of Course Material":
            filterQueryString = "public.\"Reviews\".\"Score_Communication\"";
            //filterQueryString2 = "\"Communication Rating\"";
            break
        case "Work Load":
            filterQueryString = "public.\"Reviews\".\"Score_WorkLoad\"";
            //filterQueryString2 = "\"Workload Rating\"";
            break;
        case "Fairness of Grading":
            filterQueryString = "public.\"Reviews\".\"Score_GradingConsistency\"";
            //filterQueryString2 = "\"Fairness of Grading Rating\"";
            break;
        case "Questions Encouraged":
            filterQueryString = "public.\"Reviews\".\"Score_QuestionsEncouraged\"";
            //filterQueryString2 = "\"Questions Encouraged Rating\"";
            break;
        case "Student Engagement":
            filterQueryString = "public.\"Reviews\".\"Score_StudentEngagement\"";
            //filterQueryString2 = "\"Student Engagement Rating\"";
            break;
        case "Committment to Students' Success":
            filterQueryString = "public.\"Reviews\".\"Score_CommittmentToStudents\"";
            //filterQueryString2 = "\"Commitment to Students Rating\"";
            break;
        case "Overall Recommendability":
            filterQueryString = "public.\"Reviews\".\"Score_OverallRecommendation\"";
            //filterQueryString2 = "\"Recommendability Rating\"";
            break;
    }

    var mySearch = "SELECT public.\"Sections\".*, AVG(" + filterQueryString + ") AS \"Rating\" " +
        "FROM public.\"Sections\" INNER JOIN public.\"Reviews\" " +
        "ON \"Sections\".\"ProfessorUIN\" = \"Reviews\".\"ProfessorUIN\" " +
        "WHERE \"Term\" = '" + term + "' AND \"Year\" = " + year + " AND \"Department\" = '" + department + "' AND \"CourseNum\" = " + courseNumber + " "+
        "GROUP BY \"Sections\".\"CRN\" " +
        "ORDER BY \"Rating\" DESC;";
    pool.query(
        mySearch,
        (err, res) => {
            if (err) {
                console.log(err);
                response.status(500).send("An unknown error has occurred while attempting to interact with the database");
            }
            else {
                //Populate result array with Section entries sorted according to User's preference

                response.status(200).json(res.rows);
            }
        }
    )
}

const postReview = (request, response) => {
    //console.log("Called postReview");

    var userId = request.session.userId;
    var professorUIN = request.body.professorUIN;
    var scoreCommunication = request.body.communication;
    var scoreWorkLoad = request.body.work_load;
    var scoreGrading = request.body.grading;
    var scoreQuestionsEncouraged = request.body.questions_encouraged;
    var scoreStudentEngagement = request.body.student_engagement;
    var scoreCommittment = request.body.committment;
    var scoreOverallRecommendation = request.body.overall_recommendation;

    pool.query("INSERT INTO public.\"Reviews\" (\"UserID\", \"ProfessorUIN\", \"Score_Communication\", \"Score_WorkLoad\", \"Score_GradingConsistency\", \"Score_QuestionsEncouraged\", \"Score_StudentEngagement\", \"Score_CommittmentToStudents\", \"Score_OverallRecommendation\")" +
        "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
        [userId, professorUIN, scoreCommunication, scoreWorkLoad, scoreGrading, scoreQuestionsEncouraged, scoreStudentEngagement, scoreCommittment, scoreOverallRecommendation],
        (err, res) => {
            if (err) {
                response.status(500).send("An error has occurred while attempting to interact with the database");
            }
            else {
                //Respond with 201 (Created) HTTP code
                response.sendStatus(201);
            }
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
    getSectionsByCriteria,
    postReview
}
