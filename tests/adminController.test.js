const request = require('supertest');
const app = require('../server');
const pool = require('../config/database');

describe('Admin Controller Tests', () => {
    let adminAccessToken;
    let userAccessToken;
    let testUserId;

    beforeAll(async () => {
        // Clean up test data
        await pool.execute('DELETE FROM users WHERE email LIKE ?', ['admintest@example.com']);
        await pool.execute('DELETE FROM users WHERE email LIKE ?', ['usertest@example.com']);
        
        // Create admin user
        await pool.execute(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            ['admintest', 'admintest@example.com', '$2a$10$X7OpF5W5W5W5W5W5W5W5W5W5W5W5W5W5W5W5W5W5W5W5W5W5W5', 'admin']
        );
        
        // Create regular user
        const [result] = await pool.execute(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            ['usertest', 'usertest@example.com', '$2a$10$X7OpF5W5W5W5W5W5W5W5W5W5W5W5W5W5W5W5W5W5W5W5W5W5W5', 'user']
        );
        testUserId = result.insertId;
    });

    afterAll(async () => {
        // Clean up test data
        await pool.execute('DELETE FROM users WHERE email LIKE ?', ['admintest@example.com']);
        await pool.execute('DELETE FROM users WHERE email LIKE ?', ['usertest@example.com']);
        await pool.end();
    });

    beforeEach(async () => {
        // Login as admin
        const adminResponse = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'admintest@example.com',
                password: 'admin123'
            });
        adminAccessToken = adminResponse.body.data.accessToken;

        // Login as regular user
        const userResponse = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'usertest@example.com',
                password: 'admin123'
            });
        userAccessToken = userResponse.body.data.accessToken;
    });

    describe('GET /api/admin/dashboard', () => {
        it('should get admin dashboard successfully', async () => {
            const response = await request(app)
                .get('/api/admin/dashboard')
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('totalUsers');
            expect(response.body.data).toHaveProperty('totalReports');
            expect(response.body.data).toHaveProperty('stats');
        });

        it('should fail without admin role', async () => {
            const response = await request(app)
                .get('/api/admin/dashboard')
                .set('Authorization', `Bearer ${userAccessToken}`);

            expect(response.status).toBe(403);
            expect(response.body.success).toBe(false);
        });

        it('should fail without authentication', async () => {
            const response = await request(app)
                .get('/api/admin/dashboard');

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });
    });

    describe('GET /api/admin/users', () => {
        it('should get all users successfully', async () => {
            const response = await request(app)
                .get('/api/admin/users')
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
        });

        it('should fail without admin role', async () => {
            const response = await request(app)
                .get('/api/admin/users')
                .set('Authorization', `Bearer ${userAccessToken}`);

            expect(response.status).toBe(403);
            expect(response.body.success).toBe(false);
        });
    });

    describe('PUT /api/admin/users/:id/role', () => {
        it('should update user role successfully', async () => {
            const response = await request(app)
                .put(`/api/admin/users/${testUserId}/role`)
                .set('Authorization', `Bearer ${adminAccessToken}`)
                .send({
                    role: 'admin'
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.role).toBe('admin');
        });

        it('should fail without admin role', async () => {
            const response = await request(app)
                .put(`/api/admin/users/${testUserId}/role`)
                .set('Authorization', `Bearer ${userAccessToken}`)
                .send({
                    role: 'admin'
                });

            expect(response.status).toBe(403);
            expect(response.body.success).toBe(false);
        });

        it('should fail with invalid role', async () => {
            const response = await request(app)
                .put(`/api/admin/users/${testUserId}/role`)
                .set('Authorization', `Bearer ${adminAccessToken}`)
                .send({
                    role: 'invalid_role'
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });

    describe('DELETE /api/admin/users/:id', () => {
        it('should delete user successfully', async () => {
            // Create a test user to delete
            const [result] = await pool.execute(
                'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
                ['deletetest', 'deletetest@example.com', '$2a$10$X7OpF5W5W5W5W5W5W5W5W5W5W5W5W5W5W5W5W5W5W5W5W5W5W5', 'user']
            );
            const deleteUserId = result.insertId;

            const response = await request(app)
                .delete(`/api/admin/users/${deleteUserId}`)
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        it('should fail without admin role', async () => {
            const response = await request(app)
                .delete(`/api/admin/users/${testUserId}`)
                .set('Authorization', `Bearer ${userAccessToken}`);

            expect(response.status).toBe(403);
            expect(response.body.success).toBe(false);
        });
    });
});
