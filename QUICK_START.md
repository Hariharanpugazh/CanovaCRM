# Quick Start Guide

This guide will help you get the MERN-Cuvutee Sales CRM project up and running in minutes.

---

## 🚀 Quick Setup (10 minutes)

### 1. Backend Setup (5 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your MongoDB connection
# MONGODB_URI=mongodb://localhost:27017/cuvutee
# JWT_SECRET=your_secret_key_here

# Start MongoDB (in another terminal)
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Start backend server
npm run dev
```

✅ Backend running at: http://localhost:5000

### 2. Frontend Setup (5 minutes)

```bash
# In another terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend running at: http://localhost:3000

---

## 🔑 First Login

### Create Admin User

**Option 1: Via MongoDB Client**
```bash
mongosh
use cuvutee
```

Run this seed data (see seed script below).

**Option 2: Via API**
```bash
# Register as admin
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@cuvutee.com",
    "password": "admin123"
  }'

# Update role to admin (via database)
```

**Test Credentials:**
- Email: `admin@cuvutee.com`
- Password: `admin123` (you can change this)

---

## 🌱 Seed Initial Data

Create file `backend/seedData.js`:

```javascript
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Lead from './models/Lead.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Lead.deleteMany({});

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@cuvutee.com',
      password: adminPassword,
      role: 'Admin',
      status: 'Active',
      languages: ['Marathi', 'Kannada', 'Hindi', 'English', 'Bengali'],
      employeeId: 'ADMIN001'
    });

    console.log('Created admin:', admin.email);

    // Create sample sales users
    const marathiUserPassword = await bcrypt.hash('marathi123', 10);
    const marathi = await User.create({
      name: 'Raj Marathi',
      email: 'raj.marathi@cuvutee.com',
      password: marathiUserPassword,
      role: 'SalesUser',
      status: 'Active',
      languages: ['Marathi'],
      employeeId: 'EMP00001'
    });

    const kannadaUserPassword = await bcrypt.hash('kannada123', 10);
    const kannada = await User.create({
      name: 'Aruna Kannada',
      email: 'aruna.kannada@cuvutee.com',
      password: kannadaUserPassword,
      role: 'SalesUser',
      status: 'Active',
      languages: ['Kannada'],
      employeeId: 'EMP00002'
    });

    console.log('Created sales users');

    // Create sample leads
    const leads = await Lead.insertMany([
      {
        name: 'Ashok Kumar',
        email: 'ashok@example.com',
        source: 'Website',
        date: new Date('2024-01-15'),
        location: 'Pune',
        language: 'Marathi',
        assignedTo: marathi._id,
        status: 'Ongoing',
        type: 'Hot'
      },
      {
        name: 'Priya Singh',
        email: 'priya@example.com',
        source: 'Phone',
        date: new Date('2024-01-16'),
        location: 'Bangalore',
        language: 'Kannada',
        assignedTo: kannada._id,
        status: 'Ongoing',
        type: 'Warm'
      }
    ]);

    console.log('Created sample leads');

    console.log('✅ Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
```

**Run seeding:**
```bash
node backend/seedData.js
```

---

## ✅ Verify Setup

### 1. Check Backend
```bash
curl http://localhost:5000/api/health
# Expected: {"status":"Server is running",...}
```

### 2. Check Frontend
Open browser: http://localhost:3000

### 3. Test Login
- Enter credentials: `admin@cuvutee.com` / `admin123`
- Should see dashboard

---

## 📋 Common Commands

### Backend
```bash
cd backend

# Development
npm run dev

# Start
npm start

# Install new package
npm install package-name
```

### Frontend
```bash
cd frontend

# Development
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Install new package
npm install package-name
```

---

## 🗄️ MongoDB Commands

```bash
# Connect to MongoDB
mongosh

# List databases
show databases

# Use cuvutee database
use cuvutee

# List collections
show collections

# View users
db.users.find().pretty()

# View leads
db.leads.find().pretty()

# Count leads
db.leads.countDocuments()

# Clear collection
db.users.deleteMany({})
```

---

## 🐛 Quick Troubleshoot

| Problem | Solution |
|---------|----------|
| **Port already in use** | Kill process: `lsof -i :5000` or `:3000` |
| **MongoDB error** | Start MongoDB: `brew services start mongodb-community` |
| **Module not found** | `rm -rf node_modules && npm install` |
| **CORS error** | Check FRONTEND_URL in backend .env |
| **Token invalid** | Clear localStorage and login again |

---

## 📚 Next Steps

1. ✅ Setup complete!
2. Review [PROJECT_DOCUMENTATION.md](../PROJECT_DOCUMENTATION.md)
3. Check [Figma design](#) (to be provided)
4. Create components based on design
5. Implement missing features
6. Test thoroughly
7. Deploy to production

---

## 🔗 Useful Links

- **Figma Design**: [Link to be provided]
- **Backend Docs**: [backend/README.md](backend/README.md)
- **Frontend Docs**: [frontend/README.md](frontend/README.md)
- **MongoDB**: http://localhost:27017
- **Backend API**: http://localhost:5000
- **Frontend App**: http://localhost:3000

---

**Happy Coding! 🚀**
