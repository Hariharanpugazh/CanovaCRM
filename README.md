# MERN-Cuvutee Sales CRM System

A comprehensive Sales CRM (Customer Relationship Management) system built with the MERN stack (MongoDB, Express, React, Node.js). Designed for efficient lead management, employee management, and real-time sales performance tracking.

## 📸 Project Overview

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  Frontend                Backend                Database      │
│  (React + CSS)          (Node + Express)      (MongoDB)       │
│  ├─ Dashboard           ├─ Auth API           ├─ Users       │
│  ├─ Employees Mgmt      ├─ Employee API       ├─ Leads       │
│  ├─ Leads Mgmt          ├─ Leads API          └─ Activities  │
│  └─ Settings            ├─ Dashboard API                      │
│                         └─ Lead Assignment                    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## ✨ Key Features

### 🎯 Dashboard
- Real-time KPI metrics (unassigned leads, weekly assignments, conversion rate)
- Sales performance graph (2-week trends)
- Recent activity feed
- Active sales team list
- Real-time team member search

### 👥 Employee Management
- Paginated employee list (8 per page)
- Create, edit, delete operations
- Bulk deletion support
- Language preference assignment
- Status tracking (Active/Inactive)

### 📊 Leads Management
- CSV bulk import with validation
- Manual lead creation
- Intelligent lead assignment (language + round-robin)
- Status tracking (Ongoing, Closed, Scheduled)
- Lead type classification (Hot, Warm, Cold)

### 🔐 Security & Access Control
- Role-based access (Admin vs Sales User)
- JWT authentication with token refresh
- Password hashing using bcryptjs
- Secure API endpoints

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Vanilla CSS, Recharts, Axios |
| **Backend** | Node.js, Express.js, Mongoose, JWT, Bcryptjs |
| **Database** | MongoDB with indexes for performance |
| **Deployment** | Vercel (Frontend), Heroku (Backend), MongoDB Atlas |

---

## 📦 Project Structure

```
MERN-Cuvutee/
│
├── frontend/                    # React Frontend (Port 3000)
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Page-level components
│   │   ├── styles/             # CSS modules
│   │   ├── utils/              # Helper functions & API client
│   │   ├── hooks/              # Custom React hooks
│   │   ├── context/            # Context API state
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── backend/                     # Node.js Backend (Port 5000)
│   ├── models/                 # MongoDB schemas
│   ├── routes/                 # API routes
│   ├── controllers/            # Route handlers & business logic
│   ├── middleware/             # Auth, upload middleware
│   ├── utils/                  # Helper utilities
│   ├── config/                 # Configuration files
│   ├── uploads/                # File upload directory
│   ├── server.js               # Main server file
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── PROJECT_DOCUMENTATION.md    # Complete documentation
├── QUICK_START.md             # Quick setup guide
└── README.md                  # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- MongoDB (local or Atlas)

### 🔑 Default Login Credentials

#### Admin Dashboard
```
Email:    admin@example.com
Password: admin@123
```

#### Employee Portal
```
Email:    aruna.kannada@example.com
Password: aruna.kannada@example.com
```

### Installation

**1. Clone the repository**
```bash
git clone <repository-url>
cd MERN-Cuvutee
```

**2. Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Update .env with MongoDB URI and JWT secret
npm run dev
```

**3. Frontend Setup** (in another terminal)
```bash
cd frontend
npm install
npm run dev
```

**4. Access the application**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API Docs: http://localhost:5000/api

---

## 📝 API Documentation

### Authentication
```
POST   /api/auth/login              # User login
POST   /api/auth/register           # User registration
GET    /api/auth/me                 # Current user (Protected)
```

### Employees (Admin Only)
```
GET    /api/employees               # List employees (paginated)
POST   /api/employees               # Create employee
PUT    /api/employees/:id           # Update employee
DELETE /api/employees/:id           # Delete employee
POST   /api/employees/bulk-delete   # Bulk delete
```

### Leads
```
GET    /api/leads/all               # All leads (Admin)
GET    /api/leads/my-leads          # User's leads
POST   /api/leads                   # Create lead (Admin)
POST   /api/leads/upload-csv        # CSV upload (Admin)
PUT    /api/leads/:id/status        # Update lead status
```

### Dashboard
```
GET    /api/dashboard/stats         # KPI cards
GET    /api/dashboard/graph         # Sales graph data
GET    /api/dashboard/activities    # Recent activities
GET    /api/dashboard/sales-people  # Sales team
GET    /api/dashboard/search-team   # Search team members
```

---

## 🗄️ Database Schema

### User Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "Admin" | "SalesUser",
  status: "Active" | "Inactive",
  languages: [String],
  employeeId: String (unique),
  assignedLeads: Number,
  closedLeads: Number,
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
  language: String,
  assignedTo: ObjectId (User),
  status: "Ongoing" | "Closed" | "Scheduled",
  type: "Hot" | "Warm" | "Cold" | "Scheduled",
  scheduledDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Activity Collection
```javascript
{
  type: String (Activity type),
  userId: ObjectId (User),
  leadId: ObjectId (Lead),
  description: String,
  details: Mixed,
  createdAt: Date
}
```

---

## 🔄 Lead Assignment Algorithm

The system uses intelligent lead assignment based on:

1. **Language Matching**: Assigns leads to users who speak that language
2. **Round-Robin Distribution**: Balances load among available users
3. **Threshold System**: Maximum 3 leads per user before moving to next
4. **Parallel Performance**: Uses Promise.all() for bulk operations

```
Algorithm Flow:
1. Admin creates/uploads lead(s)
2. System identifies users speaking lead's language
3. System counts current leads per user
4. Select user with least leads (if below threshold)
5. Assign lead and log activity
6. Update user's lead count
```

---

## 📊 Dashboard Metrics

| Metric | Formula |
|--------|---------|
| **Unassigned Leads** | Count of leads with null assignedTo |
| **Assigned This Week** | Count of leads created in current week |
| **Active Sales People** | Count of users with role=SalesUser and status=Active |
| **Conversion Rate** | (Closed Leads / Assigned Leads) × 100 |

---

## 🔑 Test Credentials

After running seed data:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@cuvutee.com | admin123 |
| Sales User (Marathi) | raj.marathi@cuvutee.com | marathi123 |
| Sales User (Kannada) | aruna.kannada@cuvutee.com | kannada123 |

---

## 📂 CSV File Format

**Required columns:**
```csv
name,email,source,date,location,language
John Doe,john@example.com,Website,2024-01-15,Mumbai,Marathi
Jane Smith,jane@example.com,Phone,2024-01-16,Bangalore,Kannada
```

**Validation Rules:**
- Email must be valid format
- Language must be: Marathi, Kannada, Hindi, English, or Bengali
- Date must be in valid format
- All columns are required

---

## ⚙️ Environment Configuration

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/cuvutee
PORT=5000
JWT_SECRET=your_secret_key_here
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
MAX_FILE_SIZE=5242880
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🔒 Security Features

- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ JWT-based authentication with 7-day expiry
- ✅ Role-based access control (RBAC)
- ✅ CORS enabled for cross-origin requests
- ✅ Helmet.js for HTTP security headers
- ✅ Input validation and sanitization
- ✅ Protected API endpoints

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy dist folder to Vercel
```

### Backend (Heroku)
```bash
heroku create app-name
git push heroku main
heroku config:set MONGODB_URI=<your_uri>
```

### Database (MongoDB Atlas)
1. Create account at mongodb.com/cloud/atlas
2. Create cluster and get connection string
3. Update MONGODB_URI in backend .env

---

## 📚 Documentation

- **[PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)** - Complete technical documentation
- **[QUICK_START.md](./QUICK_START.md)** - Quick setup guide
- **[frontend/README.md](./frontend/README.md)** - Frontend documentation
- **[backend/README.md](./backend/README.md)** - Backend documentation

---

## 🐛 Troubleshooting

### Common Issues

| Problem | Solution |
|---------|----------|
| MongoDB connection failed | Ensure MongoDB is running and URI is correct |
| Port 3000/5000 already in use | Kill the process: `lsof -i :3000` or `:5000` |
| CORS error | Check FRONTEND_URL in backend .env |
| Token invalid | Clear localStorage and login again |
| CSV upload fails | Verify CSV format and column names |

### Debug Mode

```bash
# Backend
DEBUG=* npm run dev

# Frontend
npm run dev -- --debug
```

---

## ✅ Implementation Checklist

- [x] Project structure setup
- [x] Backend API scaffolding
- [x] MongoDB models and schemas
- [x] Authentication system
- [x] Lead assignment logic
- [x] Frontend structure
- [x] API client integration
- [x] Utility functions
- [x] Custom hooks
- [ ] UI Components (in progress)
- [ ] Dashboard page (pending)
- [ ] Employee management pages (pending)
- [ ] Leads management pages (pending)
- [ ] Styling & CSS (pending)
- [ ] Testing (pending)
- [ ] Deployment (pending)

---

## 🔗 Useful Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Docs](https://docs.mongodb.com)
- [JWT.io](https://jwt.io)
- [Vite Documentation](https://vitejs.dev)

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/name`
2. Make your changes
3. Commit: `git commit -m "Add feature: description"`
4. Push: `git push origin feature/name`
5. Create a Pull Request

---

## 📞 Support

Need help?
1. Check the comprehensive [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)
2. Review [QUICK_START.md](./QUICK_START.md) for setup issues
3. Check backend/frontend README files
4. Review troubleshooting section above

---

## 📄 License

ISC License - Feel free to use this project

---

## 🎯 Project Status

**Status**: ✅ Setup Complete | 🔄 In Development

**Last Updated**: April 2024
**Version**: 1.0.0

---

**Ready to build! 🚀**

Next Steps:
1. ✅ Setup complete
2. 📖 Review documentation
3. 🎨 Check Figma design
4. 💻 Start building components
5. 🧪 Test thoroughly
6. 🌐 Deploy to production

Happy Coding! ✨
