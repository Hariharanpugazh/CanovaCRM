# MERN-Cuvutee: Sales CRM System
## Complete Project Documentation

---

## 📋 Project Overview

Cuvutee is a comprehensive Sales CRM (Customer Relationship Management) system designed for efficient lead management, employee management, and sales performance tracking. Built with the MERN stack (MongoDB, Express, React, Node.js), it features role-based access control, intelligent lead assignment, and real-time performance metrics.

### Key Objectives
- Automate lead distribution based on language preferences
- Track sales performance in real-time
- Manage employee and lead data efficiently
- Provide comprehensive dashboards and metrics
- Support bulk operations and CSV imports

---

## 🏗️ Project Structure

```
MERN-Cuvutee/
├── frontend/                 # React + Vanilla CSS frontend
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── styles/          # CSS modules
│   │   ├── utils/           # Helper functions
│   │   ├── hooks/           # Custom hooks
│   │   ├── context/         # Context API state
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── backend/                  # Node.js + Express backend
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API routes
│   ├── controllers/         # Route handlers
│   ├── middleware/          # Custom middleware
│   ├── utils/               # Utility functions
│   ├── config/              # Configuration
│   ├── uploads/             # File uploads
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
└── README.md                # This file
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern UI library
- **Vite**: Build tool and dev server
- **Recharts**: Data visualization
- **Axios**: HTTP client
- **CSS**: Vanilla CSS (NO Tailwind)

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication tokens
- **Bcryptjs**: Password hashing
- **Multer**: File uploads
- **CORS**: Cross-origin requests

---

## 📦 Installation & Setup

### Prerequisites
1. **Node.js** (v16 or higher)
2. **npm** or **yarn**
3. **MongoDB** (local or cloud)
4. **Git**

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd MERN-Cuvutee
```

### Step 2: Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/cuvutee
PORT=5000
JWT_SECRET=your_secret_key_change_this_in_production
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

Start MongoDB:
```bash
# macOS
brew services start mongodb-community

# Linux (Ubuntu)
sudo systemctl start mongod

# Windows
# MongoDB should start automatically if installed via installer
```

Start backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Step 3: Frontend Setup

```bash
cd ../frontend
npm install
```

Start development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

---

## 📊 Database Schema

### User Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "Admin" | "SalesUser",
  status: "Active" | "Inactive",
  languages: ["Marathi", "Kannada", ...],
  employeeId: String (unique),
  assignedLeads: Number,
  closedLeads: Number,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Lead Collection
```javascript
{
  name: String,
  email: String,
  source: String,
  date: Date,
  location: String,
  language: "Marathi" | "Kannada" | "Hindi" | "English" | "Bengali",
  assignedTo: ObjectId (User reference),
  status: "Ongoing" | "Closed" | "Scheduled",
  type: "Hot" | "Warm" | "Cold" | "Scheduled",
  scheduledDate: Date (optional),
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Activity Collection
```javascript
{
  type: "LeadAssigned" | "LeadStatusUpdated" | "EmployeeCreated" | ...,
  userId: ObjectId (User reference),
  leadId: ObjectId (Lead reference, optional),
  description: String,
  details: Mixed,
  createdAt: Date
}
```

---

## 🔐 Authentication & Authorization

### Authentication Flow
1. User submits credentials
2. Backend validates and hashes password
3. JWT token generated with 7-day expiry
4. Token sent to frontend
5. Frontend stores token (localStorage)
6. Token included in Authorization header for all requests

### Role-Based Access Control

| Feature | Admin | Sales User |
|---------|-------|-----------|
| View Dashboard | ✓ | ✓ |
| Create Employees | ✓ | ✗ |
| Edit/Delete Employees | ✓ | ✗ |
| Upload CSV Leads | ✓ | ✗ |
| Create Lead Manually | ✓ | ✗ |
| View All Leads | ✓ | ✗ |
| View My Leads | ✗ | ✓ |
| Update Lead Status | ✓ | ✓ |
| Access Settings | ✓ | ✗ |

---

## 🎯 Core Features

### 1. Dashboard
- **KPI Cards**: Unassigned leads, weekly assignments, active users, conversion rate
- **Sales Graph**: 2-week conversion rate trend
- **Activity Feed**: Last 7 activities
- **Sales People List**: Active team members with metrics
- **Team Search**: Real-time search by name or ID

### 2. Employee Management
- **List View**: Paginated list (8 per page)
- **Create**: Auto-generated employee ID, default password = email
- **Edit**: Update name, status, language preferences
- **Delete**: Single or bulk deletion
- **Search/Filter**: By name, email, or employee ID

### 3. Lead Management
- **CSV Upload**: Bulk import with validation
- **Manual Creation**: Add single lead
- **Assignment**: Automatic based on language and threshold
- **Status Updates**: Ongoing → Closed/Scheduled
- **Lead Types**: Hot, Warm, Cold, Scheduled

### 4. Lead Assignment Algorithm
```
Round-Robin with Threshold (3 leads per user)
1. Identify users speaking the lead's language
2. Count current leads per user
3. Select user with lowest count (if below threshold)
4. If all at threshold, select user with lowest count anyway
5. Distribution stays balanced
```

### 5. Reports & Metrics
- **Conversion Rate**: (Closed Leads / Assigned Leads) × 100
- **Weekly Assignments**: Count of leads assigned this week
- **Active Sales Team**: Count of active users
- **Lead Distribution**: Balance among team members

---

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/login          - User login
POST   /api/auth/register       - User registration
GET    /api/auth/me             - Get current user (requires auth)
```

### Employees
```
GET    /api/employees                    - List employees (paginated, admin)
POST   /api/employees                    - Create employee (admin)
PUT    /api/employees/:id                - Update employee (admin)
DELETE /api/employees/:id                - Delete employee (admin)
POST   /api/employees/bulk-delete        - Bulk delete (admin)
```

### Leads
```
POST   /api/leads/upload-csv             - Upload CSV (admin)
POST   /api/leads                        - Create single lead (admin)
GET    /api/leads/all                    - Get all leads (admin)
GET    /api/leads/my-leads               - Get user's leads (auth)
PUT    /api/leads/:id/status             - Update lead status (auth)
```

### Dashboard
```
GET    /api/dashboard/stats              - KPI cards
GET    /api/dashboard/graph              - Sales graph data
GET    /api/dashboard/activities         - Recent activities
GET    /api/dashboard/sales-people       - Sales team list
GET    /api/dashboard/search-team        - Team member search
```

---

## 📝 CSV File Format

Required columns (in any order):
```csv
name,email,source,date,location,language
John Doe,john@example.com,Website,2024-01-15,Mumbai,Marathi
Jane Smith,jane@example.com,Phone,2024-01-16,Bangalore,Kannada
```

### Validation Rules
- Email must be valid format
- Language must be: Marathi, Kannada, Hindi, English, or Bengali
- Date must be valid date
- All columns required

---

## 🚀 Deployment

### Frontend Deployment (Vercel)
```bash
cd frontend
npm run build
# Deploy dist folder to Vercel
```

### Backend Deployment (Heroku)
```bash
# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret
heroku config:set FRONTEND_URL=your_frontend_url

# Deploy
git push heroku main
```

### Database (MongoDB Atlas)
1. Create account at mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Update MONGODB_URI in backend .env

---

## 🔍 Testing the Application

### 1. Create Admin User (First Time)
```bash
# Connect to MongoDB
mongosh

# Switch to database
use cuvutee

# Insert default admin
db.users.insertOne({
  name: "Admin User",
  email: "admin@cuvutee.com",
  password: "$2a$10$...", // bcrypt hash of "admin123"
  role: "Admin",
  status: "Active",
  languages: ["Marathi", "Kannada", "Hindi", "English", "Bengali"],
  createdAt: new Date()
})
```

### 2. Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cuvutee.com","password":"admin123"}'
```

### 3. Test CSV Upload
- Use provided test CSV file
- Upload through admin dashboard
- Verify leads assigned to users

### 4. Test Lead Assignment
- Create employees with different languages
- Upload CSV with mixed languages
- Verify even distribution

---

## ⚙️ Performance Optimization

### Backend
- ✓ MongoDB indexes on frequently queried fields
- ✓ Promise.all() for parallel operations
- ✓ Pagination with limits
- ✓ Batch inserts for bulk uploads

### Frontend
- ✓ Lazy loading for routes
- ✓ Component memoization
- ✓ Efficient state management
- ✓ Optimized CSS (no unused styles)

---

## 🐛 Troubleshooting

### Issue: "MongoDB connection failed"
```bash
# Check MongoDB is running
mongosh

# Reset connection string in .env
MONGODB_URI=mongodb://localhost:27017/cuvutee
```

### Issue: "CORS error"
```bash
# Ensure FRONTEND_URL in backend .env matches frontend URL
FRONTEND_URL=http://localhost:3000
```

### Issue: "Token expired"
```javascript
// Token expires in 7 days
// Need to login again to get new token
// Consider implementing token refresh logic
```

### Issue: "CSV upload fails"
```bash
# Check file size (max 5MB)
# Verify CSV columns match requirements
# Ensure language values are exact matches
```

---

## 📚 Project Constraints & Requirements

### Mandatory
- ✓ React JS + Vanilla CSS ONLY (NO Tailwind)
- ✓ Node.js + Express.js backend
- ✓ MongoDB database
- ✓ Role-based access control
- ✓ Language-based lead assignment
- ✓ CSV bulk upload support
- ✓ Dashboard with KPI cards
- ✓ Sales performance graph

### Performance
- ✓ Lead assignment with Promise.all()
- ✓ MongoDB indexes on key fields
- ✓ Pagination for large datasets
- ✓ Optimized queries

### Security
- ✓ Password hashing (bcrypt)
- ✓ JWT authentication
- ✓ CORS enabled
- ✓ Input validation

---

## 📖 File Naming Conventions

### Frontend
- Components: `PascalCase.jsx`
- Hooks: `useHookName.js`
- Utilities: `camelCase.js`
- Styles: `componentName.css` or `componentName.module.css`

### Backend
- Models: `PascalCase.js`
- Controllers: `camelCaseController.js`
- Routes: `camelCaseRoutes.js`
- Middleware: `camelCaseMiddleware.js`
- Utilities: `camelCase.js`

---

## 🔄 Development Workflow

1. **Always sync with main branch**
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make changes and test locally**

4. **Commit with clear messages**
   ```bash
   git commit -m "Add feature: description"
   ```

5. **Push and create pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

---

## 📞 Support & Contact

For issues, questions, or suggestions:
1. Check README files in frontend and backend folders
2. Check troubleshooting section above
3. Review code comments and documentation
4. Create an issue in the repository

---

## ✅ Checklist Before Submission

- [ ] Figma design matches implementation
- [ ] All features from SRD implemented
- [ ] Responsive design tested
- [ ] No console errors
- [ ] All API endpoints working
- [ ] CSV upload tested
- [ ] Lead assignment tested
- [ ] Dashboard metrics calculated correctly
- [ ] Authentication working
- [ ] No Tailwind CSS used
- [ ] Vanilla CSS only
- [ ] Database indexes created
- [ ] Environment variables configured
- [ ] README files complete
- [ ] GitHub repository linked

---

## 📅 Timeline

- **Week 1**: Project setup, database design
- **Week 2**: Backend API development
- **Week 3**: Frontend development
- **Week 4**: Integration and UI polish
- **Week 5**: Testing and deployment

---

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Manual](https://docs.mongodb.com/manual)
- [JWT.io](https://jwt.io)
- [CSS-Tricks](https://css-tricks.com)

---

**Last Updated**: April 2024
**Version**: 1.0.0
**Status**: Ready for Development
