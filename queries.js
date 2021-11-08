const Pool = require('pg').Pool
const pool = new Pool({
    user: 'guru',
    host:  'tamucoursestats.cv3iclekihw6.us-east-2.rds.amazonaws.com',
    database: 'ClassStats',
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
    response.status(200).json("Success!");
}

const getDepartments = (request, response) => {
    console.log("Called getDepartments");
    response.status(200).json("Success!");
}

const getCourseNumbers = (request, response) => {
    console.log("Called getCourseNumbers");
    response.status(200).json("Success!");
}

const getProfessors = (request, response) => {
    console.log("Called getProfessors");

    response.status(200).json("Success!");
}

module.exports = {
    getUsers,
    createUser,
    updateUser,
    getSemesters,
    getDepartments,
    getCourseNumbers,
    getProfessors
}
