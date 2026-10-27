const API_URL = '/api/todos';

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const errorMessage = document.getElementById('error-message');

function showError(msg) {
  errorMessage.textContent = msg;
  errorMessage.className = 'error-message';
  setTimeout(() => {
    errorMessage.className = 'error-messageHidden';
  }, 3000);
}

async function fetchTodos() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to fetch tasks');
    const todos = await res.json();
    renderTodos(todos);
  } catch (err) {
    showError(err.message);
  }
}

function renderTodos(todos) {
  todoList.innerHTML = '';
  if (todos.length === 0) {
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'todo-content';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => toggleTodo(todo.id, checkbox.checked));

    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = todo.text;

    contentDiv.appendChild(checkbox);
    contentDiv.appendChild(span);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-delete';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

    li.appendChild(contentDiv);
    li.appendChild(deleteBtn);

    todoList.appendChild(li);
  });
}

async function addTodo(text) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to add task');
    }

    todoInput.value = '';
    fetchTodos();
  } catch (err) {
    showError(err.message);
  }
}

async function toggleTodo(id, completed) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed })
    });

    if (!res.ok) throw new Error('Failed to update task');
    fetchTodos();
  } catch (err) {
    showError(err.message);
  }
}

async function deleteTodo(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    if (!res.ok) throw new Error('Failed to delete task');
    fetchTodos();
  } catch (err) {
    showError(err.message);
  }
}

todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (text) {
    addTodo(text);
  }
});

document.addEventListener('DOMContentLoaded', fetchTodos);
