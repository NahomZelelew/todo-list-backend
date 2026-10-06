const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Get all tasks
app.get('/api/tasks', async function(req, res) {
    try {
        const [tasks] = await db.query(
            'SELECT id, title, completed FROM tasks ORDER BY id ASC'
        );
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not get tasks' });
    }
});

// Add a task
app.post('/api/tasks', async function(req, res) {
    const title = req.body.title?.trim();

    if (!title) {
        return res.status(400).json({ error: 'Task title is required' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO tasks (title, completed) VALUES (?, false)',
            [title]
        );

        res.status(201).json({
            id: result.insertId,
            title: title,
            completed: 0
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not add task' });
    }
});

// Update completion status
app.put('/api/tasks/:id', async function(req, res) {
    const id = Number(req.params.id);
    const completed = Boolean(req.body.completed);

    if (!Number.isInteger(id)) {
        return res.status(400).json({ error: 'Invalid task id' });
    }

    try {
        const [result] = await db.query(
            'UPDATE tasks SET completed = ? WHERE id = ?',
            [completed, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ id: id, completed: completed });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not update task' });
    }
});

// Delete a task
app.delete('/api/tasks/:id', async function(req, res) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        return res.status(400).json({ error: 'Invalid task id' });
    }

    try {
        const [result] = await db.query(
            'DELETE FROM tasks WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not delete task' });
    }
});

app.listen(PORT, function() {
    console.log(`Server running at http://localhost:${PORT}`);
});
