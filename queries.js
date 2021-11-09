const queryString = require('querystring');

const Pool = require('pg').Pool
const pool = new Pool({
    user: 'guru',
    host:  'tamucoursestats.cv3iclekihw6.us-east-2.rds.amazonaws.com',
    database: 'postgres_test', //'ClassStats',
    password: 'gurupassword0',
    port: 5432,
})

/*
const getUsers = (request, response) => {
    pool.query('SELECT * FROM users', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const createUser = (request, response) => {
    const { name, email } = request.body

    pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`User added with ID: ${results.insertId}`)
    })
}

const updateUser = (request, response) => {
    const id = parseInt(request.params.id)
    const { name, email } = request.body

    pool.query(
        'UPDATE users SET name = $1, email = $2 WHERE id = $3',
        [name, email, id],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send(`User modified with ID: ${id}`)
        }
    )
}
*/

const getSemesters = (request, response) => {
    console.log("Called getSemesters");

    pool.query("SELECT * FROM public.\"Semesters\"",
        (err, res) => {
            if (err) {
                throw err
            }

            //Populate result array with semesters
            let semesters = [];
            res.rows.forEach((elem) => {
                let semester = elem.Term + " " + elem.Year;
                console.log(semester); //For debugging
                semesters.push(semester);
            });
            response.status(200).json(semesters);
        }
    );
}

const getDepartments = (request, response) => {
    console.log("Called getDepartments");

    pool.query("SELECT * FROM public.\"Departments\"",
        (err, res) => {
            if (err) {
                throw err
            }

            //Populate result array with departments
            let departments = [];
            res.rows.forEach((elem) => {
                let department = elem.Abbreviation + " - " + elem.FullName;
                console.log(department); //For debugging
                departments.push(department);
            });
            response.status(200).json(departments);
        }
    );
}

const getCourseNumbers = (request, response) => {
    console.log("Called getCourseNumbers");

    const qStringParams = queryString.parse(request.params.department);
    pool.query("SELECT * FROM public.\"Courses\" WHERE \"Courses\".\"Department\" = $1",
        [qStringParams.department],
        (err, res) => {
            if (err) {
                throw err
            }

            //Populate result array with courses
            let courses = [];
            res.rows.forEach((elem) => {
                let course = elem.CourseNum + " - " + elem.CourseTitle;
                console.log(course); //For debugging
                courses.push(course);
            });
            response.status(200).json(courses);
        }
    );
}

const getProfessors = (request, response) => {
    console.log("Called getProfessors");
    pool.query("SELECT * FROM public.\"Professors\"",
        (err, res) => {
            if (err) {
                throw err
            }

            //Populate result array with professors
            let professors = [];
            res.rows.forEach((elem) => {
                let professor = elem.LastName + ", " + elem.FirstName;
                console.log(professor); //For debugging
                professors.push(professor);
            });
            response.status(200).json(professors);
        }
    );
}

module.exports = {
    //getUsers,
    //createUser,
    //updateUser,
    getSemesters,
    getDepartments,
    getCourseNumbers,
    getProfessors
}
