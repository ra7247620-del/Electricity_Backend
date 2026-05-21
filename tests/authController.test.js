const request = require('supertest');
const app = require('../server');
const pool = require('../config/database');

describe('Auth Controller Tests', () => {
    let testUserId;
    let accessToken;
    let refreshToken;

    beforeAll(async () => {
        // Clean up test data
        await pool.execute('DELETE FROM users WHERE email LIKE ? OR email LIKE ?', ['test%@example.com', 'test2%@example.com']);
    });

    afterAll(async () => {
        // Clean up test data
        await pool.execute('DELETE FROM users WHERE email LIKE ? OR email LIKE ?', ['test%@example.com', 'test2%@example.com']);
        await pool.end();
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'test123'
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('id');
            expect(response.body.data.email).toBe('test@example.com');
            testUserId = response.body.data.id;
        });

        it('should fail with duplicate email', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser2',
                    email: 'test@example.com',
                    password: 'test123'
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });

        it('should fail with missing fields', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser3',
                    email: 'test3@example.com'
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login successfully with valid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'test123'
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('accessToken');
            expect(response.body.data).toHaveProperty('refreshToken');
            expect(response.body.data).toHaveProperty('user');
            
            accessToken = response.body.data.accessToken;
            refreshToken = response.body.data.refreshToken;
        });

        it('should fail with invalid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });

        it('should fail with non-existent email', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'test123'
                });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });
    });

    describe('POST /api/auth/refresh-token', () => {
        it('should refresh token successfully', async () => {
            const response = await request(app)
                .post('/api/auth/refresh-token')
                .send({
                    refreshToken: refreshToken
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('accessToken');
            expect(response.body.data).toHaveProperty('refreshToken');
            
            accessToken = response.body.data.accessToken;
            refreshToken = response.body.data.refreshToken;
        });

        it('should fail with invalid refresh token', async () => {
            const response = await request(app)
                .post('/api/auth/refresh-token')
                .send({
                    refreshToken: 'invalid_token'
                });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });
    });

    describe('POST /api/auth/logout', () => {
        it('should logout successfully', async () => {
            const response = await request(app)
                .post('/api/auth/logout')
                .set('Authorization', `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        it('should fail without token', async () => {
            const response = await request(app)
                .post('/api/auth/logout');

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });
    });
});
