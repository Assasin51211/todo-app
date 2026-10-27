const request = require('supertest');
const app = require('../server');

describe('To-Do API Endpoints', () => {
  beforeEach(() => {
    if (typeof app.resetState === 'function') {
      app.resetState();
    }
  });

  describe('GET /api/todos', () => {
    it('should return an empty array initially', async () => {
      const res = await request(app).get('/api/todos');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe('POST /api/todos', () => {
    it('should create a new todo item when valid text is provided', async () => {
      const res = await request(app)
        .post('/api/todos')
        .send({ text: 'Buy groceries' });

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({
        id: 1,
        text: 'Buy groceries',
        completed: false
      });
    });

    it('should return 400 when text is missing or empty string', async () => {
      const resMissing = await request(app)
        .post('/api/todos')
        .send({});
      expect(resMissing.statusCode).toBe(400);
      expect(resMissing.body).toHaveProperty('error');

      const resEmpty = await request(app)
        .post('/api/todos')
        .send({ text: '   ' });
      expect(resEmpty.statusCode).toBe(400);
      expect(resEmpty.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/todos/:id', () => {
    it('should toggle the completed status of an existing todo', async () => {
      const createRes = await request(app)
        .post('/api/todos')
        .send({ text: 'Clean room' });

      const todoId = createRes.body.id;

      const toggleRes1 = await request(app)
        .put(`/api/todos/${todoId}`)
        .send();
      expect(toggleRes1.statusCode).toBe(200);
      expect(toggleRes1.body.completed).toBe(true);

      const toggleRes2 = await request(app)
        .put(`/api/todos/${todoId}`)
        .send();
      expect(toggleRes2.statusCode).toBe(200);
      expect(toggleRes2.body.completed).toBe(false);
    });

    it('should return 404 for non-existent todo ID', async () => {
      const res = await request(app).put('/api/todos/999').send();
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('should delete an existing todo item', async () => {
      const createRes = await request(app)
        .post('/api/todos')
        .send({ text: 'Walk dog' });

      const todoId = createRes.body.id;

      const deleteRes = await request(app).delete(`/api/todos/${todoId}`);
      expect(deleteRes.statusCode).toBe(200);
      expect(deleteRes.body.id).toBe(todoId);

      const getRes = await request(app).get('/api/todos');
      expect(getRes.body).toEqual([]);
    });

    it('should return 404 when deleting a non-existent todo', async () => {
      const res = await request(app).delete('/api/todos/999');
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });
});
