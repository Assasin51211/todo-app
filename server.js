const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let todos = [];
let nextId = 1;

// GET /api/todos - returns all items
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// POST /api/todos - adds a new item with id, text, and completed fields (with input validation)
app.post('/api/todos', (req, res) => {
  const { text } = req.body || {};
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return res.status(400).json({ error: 'Valid text is required for todo item.' });
  }

  const newTodo = {
    id: nextId++,
    text: text.trim(),
    completed: false
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT /api/todos/:id - toggles completed status
app.put('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const todo = todos.find(t => String(t.id) === String(id));

  if (!todo) {
    return res.status(404).json({ error: 'Todo item not found.' });
  }

  if (req.body && typeof req.body.completed === 'boolean') {
    todo.completed = req.body.completed;
  } else {
    todo.completed = !todo.completed;
  }

  res.json(todo);
});

// DELETE /api/todos/:id - deletes an item
app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const index = todos.findIndex(t => String(t.id) === String(id));

  if (index === -1) {
    return res.status(404).json({ error: 'Todo item not found.' });
  }

  const [deletedTodo] = todos.splice(index, 1);
  res.json(deletedTodo);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
