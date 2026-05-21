const request = require('supertest');
const app = require('../server');
const pool = require('../config/database');

describe('Report Controller Tests', () => {
    let testUserId;
    let accessToken;
    let testReportId;

    beforeAll(async () => {
        // Clean up test data
        await pool.execute('DELETE FROM outage_reports WHERE location LIKE ?', ['Test Location%']);
        await pool.execute('DELETE FROM users WHERE email LIKE ?', ['reporttest@example.com']);
        
        // Create test user
        const [result] = await pool.execute(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            ['reporttest', 'reporttest@example.com', '$2a$10$X7OpF5W5W5W5W5W5W5W5W5W5W5W5W5W5W5W5W5W5W5W5W5W5W5', 'user']
        );
        testUserId = result.insertId;
    });

    afterAll(async () => {
        // Clean up test data
        await pool.execute('DELETE FROM outage_reports WHERE location LIKE ?', ['Test Location%']);
        await pool.execute('DELETE FROM users WHERE email LIKE ?', ['reporttest@example.com']);
        await pool.end();
    });

    beforeEach(async () => {
        // Login to get token
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'reporttest@example.com',
                password: 'admin123'
            });
        
        accessToken = response.body.data.accessToken;
    });

    describe('POST /api/reports', () => {
        it('should create a new report successfully', async () => {
            const response = await request(app)
                .post('/api/reports')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    location: 'Test Location 1',
                    severity: 'high',
                    outage_type: 'power_outage',
                    description: 'Test description'
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('id');
            expect(response.body.data.location).toBe('Test Location 1');
            
            testReportId = response.body.data.id;
        });

        it('should fail without authentication', async () => {
            const response = await request(app)
                .post('/api/reports')
                .send({
                    location: 'Test Location 2',
                    severity: 'medium',
                    outage_type: 'power_outage'
                });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });

        it('should fail with missing required fields', async () => {
            const response = await request(app)
                .post('/api/reports')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    location: 'Test Location 3'
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });

    describe('GET /api/reports/my-reports', () => {
        it('should get user reports successfully', async () => {
            const response = await request(app)
                .get('/api/reports/my-reports')
                .set('Authorization', `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
        });

        it('should fail without authentication', async () => {
            const response = await request(app)
                .get('/api/reports/my-reports');

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });
    });

    describe('GET /api/reports/dashboard-stats', () => {
        it('should get dashboard stats successfully', async () => {
            const response = await request(app)
                .get('/api/reports/dashboard-stats')
                .set('Authorization', `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('stats');
            expect(response.body.data).toHaveProperty('recentReports');
        });

        it('should fail without authentication', async () => {
            const response = await request(app)
                .get('/api/reports/dashboard-stats');

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });
    });

    describe('GET /api/reports/:id', () => {
        it('should get a specific report successfully', async () => {
            const response = await request(app)
                .get(`/api/reports/${testReportId}`)
                .set('Authorization', `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.id).toBe(testReportId);
        });

        it('should fail without authentication', async () => {
            const response = await request(app)
                .get(`/api/reports/${testReportId}`);

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });
    });
});
