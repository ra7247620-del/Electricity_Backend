# PowerOutage Tracker

A production-ready full-stack web application for tracking and managing power outages.

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla), Bootstrap 5
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JWT (Access + Refresh tokens)
- **Password Hashing**: bcryptjs
- **Testing**: Jest, Supertest

## Features

### User Features
- User registration and login
- JWT authentication with refresh token rotation
- Create power outage reports
- View personal report history
- Real-time dashboard with statistics
- Notifications for status updates

### Admin Features
- Admin dashboard with comprehensive statistics
- View and manage all outage reports
- Update report status (pending, in_progress, resolved, rejected)
- Manage users (view, update role, delete)
- User role management (user/admin)

## Project Structure

```
poweroutage-tracker/
├── config/
│   └── database.js          # MySQL database configuration
├── controllers/
│   ├── adminController.js   # Admin operations
│   ├── authController.js    # Authentication operations
│   ├── notificationController.js
│   └── reportController.js  # Report operations
├── database/
│   └── schema.sql           # Database schema
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   └── errorHandler.js      # Global error handler
├── models/
│   ├── Notification.js
│   ├── OutageReport.js
│   ├── RefreshToken.js
│   └── User.js
├── public/
│   ├── css/
│   │   └── styles.css       # Custom styles
│   ├── js/
│   │   ├── admin.js         # Admin dashboard logic
│   │   ├── auth.js          # Authentication utilities
│   │   └── dashboard.js     # User dashboard logic
│   ├── admin.html           # Admin dashboard
│   ├── dashboard.html       # User dashboard
│   ├── index.html           # Home page
│   ├── login.html           # Login page
│   └── register.html        # Registration page
├── routes/
│   ├── adminRoutes.js       # Admin API routes
│   ├── authRoutes.js        # Authentication API routes
│   ├── notificationRoutes.js
│   └── reportRoutes.js      # Report API routes
├── services/
│   ├── adminService.js      # Admin business logic
│   ├── authService.js       # Authentication business logic
│   ├── notificationService.js
│   └── reportService.js     # Report business logic
├── tests/
│   ├── adminController.test.js
│   ├── authController.test.js
│   └── reportController.test.js
├── utils/
│   ├── jwt.js               # JWT utilities
│   └── response.js          # Response handler
├── .env                     # Environment variables (not in git)
├── .env.example             # Environment variables template
├── .gitignore
├── package.json
├── server.js                # Entry point
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd poweroutage-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=3000
   NODE_ENV=development
   
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=poweroutage_tracker
   DB_PORT=3306
   
   JWT_ACCESS_SECRET=your_access_secret_key_change_this_in_production
   JWT_REFRESH_SECRET=your_refresh_secret_key_change_this_in_production
   JWT_ACCESS_EXPIRY=15m
   JWT_REFRESH_EXPIRY=7d
   
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Set up the database**
   ```bash
   mysql -u root -p < database/schema.sql
   ```
   
   Or manually execute the SQL file in your MySQL client:
   ```sql
   source database/schema.sql
   ```

   This will:
   - Create the `poweroutage_tracker` database
   - Create all required tables
   - Insert a default admin user (email: `admin@poweroutage.com`, password: `admin123`)

5. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Access the application**
   - Open your browser and navigate to: `http://localhost:3000`
   - Default admin credentials:
     - Email: `admin@poweroutage.com`
     - Password: `admin123`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile

### Reports
- `POST /api/reports` - Create a new report (authenticated)
- `GET /api/reports/my-reports` - Get user's reports (authenticated)
- `GET /api/reports/dashboard-stats` - Get dashboard statistics (authenticated)
- `GET /api/reports/all` - Get all reports (admin only)
- `GET /api/reports/:id` - Get specific report (authenticated)
- `PUT /api/reports/:id/status` - Update report status (admin only)

### Notifications
- `GET /api/notifications` - Get user notifications (authenticated)
- `GET /api/notifications/unread-count` - Get unread count (authenticated)
- `PUT /api/notifications/:id/read` - Mark notification as read (authenticated)
- `PUT /api/notifications/mark-all-read` - Mark all as read (authenticated)

### Admin
- `GET /api/admin/dashboard` - Get admin dashboard data (admin only)
- `GET /api/admin/users` - Get all users (admin only)
- `PUT /api/admin/users/:id/role` - Update user role (admin only)
- `DELETE /api/admin/users/:id` - Delete user (admin only)

## Testing

Run the test suite:
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### Test Coverage
- Authentication controller tests
- Report controller tests
- Admin controller tests

## Security Features

- **Password Hashing**: All passwords are hashed using bcryptjs
- **JWT Authentication**: Access tokens with short expiry (15 minutes)
- **Refresh Tokens**: Long-lived refresh tokens (7 days) stored in database
- **Token Rotation**: New refresh tokens issued on each refresh
- **CORS Protection**: Configurable CORS settings
- **Input Validation**: Request validation on all endpoints
- **Role-Based Access Control**: Admin-only endpoints protected

## Response Format

All API responses follow this structure:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (development only)"
}
```

## Default Admin User

The application comes with a default admin user:
- **Email**: admin@poweroutage.com
- **Password**: admin123

**Important**: Change this password immediately after first login in production!

## Development

### Adding New Features

1. **Add Model**: Create in `models/` directory
2. **Add Service**: Create in `services/` directory for business logic
3. **Add Controller**: Create in `controllers/` directory for request handling
4. **Add Routes**: Create in `routes/` directory for API endpoints
5. **Add Tests**: Create in `tests/` directory

### Code Style

- Use async/await for asynchronous operations
- Follow the layered architecture: Routes → Controllers → Services → Models
- Use the ResponseHandler utility for consistent API responses
- Add error handling with try-catch blocks
- Write tests for new features

## Troubleshooting

### Database Connection Issues
- Ensure MySQL is running
- Check database credentials in `.env`
- Verify database exists and schema is imported

### Authentication Issues
- Clear browser localStorage if experiencing login issues
- Check JWT secrets in `.env`
- Verify token expiry settings

### Port Already in Use
- Change PORT in `.env` file
- Or kill the process using the port:
  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  
  # Linux/Mac
  lsof -ti:3000 | xargs kill -9
  ```

## Production Deployment

1. **Set environment variables**
   ```env
   NODE_ENV=production
   JWT_ACCESS_SECRET=<strong-random-secret>
   JWT_REFRESH_SECRET=<strong-random-secret>
   ```

2. **Use a process manager** (PM2)
   ```bash
   npm install -g pm2
   pm2 start server.js --name poweroutage-tracker
   pm2 startup
   pm2 save
   ```

3. **Set up reverse proxy** (Nginx)
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Enable HTTPS** (Let's Encrypt)
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

## License

ISC

## Support

For issues and questions, please open an issue on the repository.
