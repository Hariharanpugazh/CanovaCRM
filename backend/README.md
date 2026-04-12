# Cuvutee - Sales CRM Backend

Node.js + Express.js backend API for the Sales CRM application with MongoDB database.

## Tech Stack
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication
- **Bcryptjs**: Password hashing
- **Multer**: File upload middleware
- **CORS**: Cross-origin resource sharing

## Project Structure

```
backend/
├── models/            # MongoDB schemas
│   ├── User.js
│   ├── Lead.js
│   └── Activity.js
├── routes/            # API routes
│   ├── authRoutes.js
│   ├── employeeRoutes.js
│   ├── leadRoutes.js
│   └── dashboardRoutes.js
├── controllers/       # Route handlers
│   ├── authController.js
│   ├── employeeController.js
│   ├── leadController.js
│   └── dashboardController.js
├── middleware/        # Custom middleware
│   ├── authMiddleware.js
│   └── uploadMiddleware.js
├── utils/             # Utility functions
│   ├── jwtUtils.js
│   ├── leadAssignment.js
│   └── csvParser.js
├── config/            # Configuration files
├── uploads/           # File upload directory
├── server.js          # Main server file
├── package.json
├── .env.example
└── README.md
```

## Installation

### Prerequisites
- Node.js 16 or higher
- npm or yarn
- MongoDB 5.0 or higher

### Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/cuvutee
PORT=5000
JWT_SECRET=your_secret_key_here
FRONTEND_URL=http://localhost:3000
```

## Development

### Start Development Server
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

### Start Production Server
```bash
npm start
```

## Database Setup

### MongoDB Local Setup

```bash
# macOS (using Homebrew)
brew services start mongodb-community

# Windows (using Chocolatey)
choco install mongodb

# Linux (Ubuntu)
sudo systemctl start mongod
```

### MongoDB Atlas (Cloud)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user (requires token)

### Employees (Admin only)
- `GET /api/employees` - List all employees with pagination
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee
- `POST /api/employees/bulk-delete` - Bulk delete employees

### Leads
- `POST /api/leads/upload-csv` - Upload CSV leads (Admin only)
- `POST /api/leads` - Create single lead (Admin only)
- `GET /api/leads/all` - Get all leads (Admin only)
- `GET /api/leads/my-leads` - Get user's assigned leads
- `PUT /api/leads/:id/status` - Update lead status

### Dashboard
- `GET /api/dashboard/stats` - Get KPI cards data
- `GET /api/dashboard/graph` - Get sales graph data (2 weeks)
- `GET /api/dashboard/activities` - Get recent activities (7 latest)
- `GET /api/dashboard/sales-people` - Get active sales people list
- `GET /api/dashboard/search-team` - Search team members

## Lead Assignment Logic

### Rules
1. Leads are assigned based on language preference
2. Threshold: 3 leads per user
3. Uses round-robin distribution
4. Equal distribution among users with same language

### Process
1. Admin uploads CSV or creates lead
2. System identifies eligible users by language
3. System selects user with least leads (respecting threshold)
4. Lead assigned automatically
5. Activity logged

### Performance Optimization
- Uses `Promise.all()` for parallel operations
- MongoDB indexes on: `language`, `assignedTo`, `status`
- Batch inserts for CSV uploads

## Authentication Flow

1. User sends credentials to `/api/auth/login`
2. Password validated (bcrypt comparison)
3. JWT token generated
4. Token returned to client
5. Client includes token in Authorization header for protected routes
6. Server validates token on each request

## File Upload

### CSV Upload
- Endpoint: `POST /api/leads/upload-csv`
- Max file size: 5MB
- Supported format: CSV only
- Required columns: name, email, source, date, location, language
- Files stored in `/uploads` directory

## Error Handling

All errors return JSON with status and message:

```json
{
  "error": "Error description",
  "status": 400
}
```

Common status codes:
- 200: Success
- 201: Created
- 400: Bad request
- 401: Unauthorized
- 403: Forbidden
- 404: Not found
- 500: Server error

## Database Indexes

Automatically created on schema definition:
- `User.email` - Unique index
- `Lead.language` - Index
- `Lead.assignedTo` - Index
- `Lead.status` - Index
- `Activity.createdAt` - Descending index

## Security Features

- Password hashing with bcryptjs (10 salt rounds)
- JWT-based authentication
- Role-based access control (Admin vs SalesUser)
- Input validation and sanitization
- CORS enabled
- Helmet headers for security

## Rate Limiting (Future)

Recommended to add rate limiting middleware:

```bash
npm install express-rate-limit
```

## Logging

Uses Morgan for HTTP request logging. Logs include:
- Request method and URL
- Response status code
- Response time
- User IP address

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | Error if not set |
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment (development/production) | development |
| `JWT_SECRET` | JWT signing secret | Must be set in production |
| `FRONTEND_URL` | Frontend origin for CORS | http://localhost:3000 |
| `MAX_FILE_SIZE` | Max upload file size | 5MB |

## Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongosh

# Restart MongoDB
brew services restart mongodb-community  # macOS
sudo systemctl restart mongod            # Linux
```

### Port Already in Use
```bash
# macOS/Linux
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### JWT Token Issues
- Ensure `JWT_SECRET` is set in `.env`
- Check token expiration (currently 7 days)
- Validate token format (Bearer <token>)

## Performance Tips

1. Use MongoDB indexes effectively
2. Implement pagination for large datasets
3. Use batch operations for bulk inserts
4. Implement caching for frequently accessed data
5. Monitor database queries

## Testing

```bash
# Manual testing with cURL
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

## Deployment

### Heroku
```bash
npm install -g heroku
heroku login
heroku create your-app-name
git push heroku main
```

### AWS EC2
```bash
# Install Node.js and MongoDB on EC2
# Clone repository
# Install dependencies
# Set environment variables
# Start server with PM2
npm install -g pm2
pm2 start server.js --name "cuvutee-backend"
```

### Docker
```bash
docker build -t cuvutee-backend .
docker run -p 5000:5000 --env-file .env cuvutee-backend
```

## Contributing Guidelines

1. Create a feature branch from `main`
2. Follow Express.js best practices
3. Write meaningful commit messages
4. Add error handling for all endpoints
5. Test API endpoints before submitting

## Support

For issues and questions, please create an issue in the repository.

## License

ISC
