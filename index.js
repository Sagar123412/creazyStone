const express = require('express');

const app = express();

app.use(express.json());

const pool = require('./config/db');


//routes

//get all todos

app.get('/', async (req, res) => {
    try {
        // Query to fetch data from the database
        const result = await pool.query('SELECT * FROM todo');

        // Send the fetched data as a JSON response
        res.json(result.rows);
    } catch (err) {
        // Handle errors
        res.status(500).json({ error: 'Internal server error' });
    }
});



//add todo

app.post("/todos", async (req, res) => {
    try {
        const { description } = req.body;
        const newTodo = await pool.query(
            "INSERT INTO todo (description) VALUES($1) RETURNING *",
            [description]
        );

        res.json(newTodo.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});



// update todo

app.put("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;

        const updateTodo = await pool.query(
            "UPDATE todo SET description = $1 WHERE todo_id = $2",
            [description, id]
        );

        res.json("Todo was updated!");
    } catch (err) {
        console.error(err.message);
    }
});

//delete todo

//here $1 are getting dianamic data 

app.delete("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [
            id
        ]);
        res.json("Todo was deleted!");
    } catch (err) {
        console.log(err.message);
    }
});

app.listen(3000, () => {
    console.log('server running on port 3000')
})