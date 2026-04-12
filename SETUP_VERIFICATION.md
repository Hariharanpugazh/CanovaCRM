# Setup Verification Checklist

Use this checklist to verify your MERN-Cuvutee project setup is complete and working correctly.

---

## ✅ Pre-Installation

- [ ] Node.js 16+ installed
- [ ] npm or yarn installed
- [ ] MongoDB installed or MongoDB Atlas account created
- [ ] Git installed
- [ ] Text editor/IDE ready (VS Code recommended)
- [ ] Terminal/Command prompt ready

**Check versions:**
```bash
node --version    # Should be v16 or higher
npm --version     # Should be v7 or higher
mongod --version  # For local MongoDB
```

---

## ✅ Backend Setup

### Installation
- [ ] Navigated to `backend` directory
- [ ] Ran `npm install` successfully
- [ ] All dependencies installed without errors

### Configuration
- [ ] Created `.env` file from `.env.example`
- [ ] Updated `MONGODB_URI` with correct connection string
- [ ] Updated `JWT_SECRET` with a secure key
- [ ] Updated `FRONTEND_URL` if changed

### Database
- [ ] MongoDB is running locally or MongoDB Atlas accessible
- [ ] Can connect to MongoDB with URI
- [ ] Database created: `cuvutee`

### Server Start
- [ ] Ran `npm run dev` successfully
- [ ] Server started on port 5000
- [ ] No console errors
- [ ] Health check endpoint works:
  ```bash
  curl http://localhost:5000/api/health
  # Expected response: {"status":"Server is running",...}
  ```

### API Structure
- [ ] All route files created:
  - [ ] `routes/authRoutes.js`
  - [ ] `routes/employeeRoutes.js`
  - [ ] `routes/leadRoutes.js`
  - [ ] `routes/dashboardRoutes.js`

- [ ] All controller files created:
  - [ ] `controllers/authController.js`
  - [ ] `controllers/employeeController.js`
  - [ ] `controllers/leadController.js`
  - [ ] `controllers/dashboardController.js`

- [ ] All model files created:
  - [ ] `models/User.js`
  - [ ] `models/Lead.js`
  - [ ] `models/Activity.js`

### Middleware
- [ ] Auth middleware in `middleware/authMiddleware.js`
- [ ] Upload middleware in `middleware/uploadMiddleware.js`
- [ ] CORS configured correctly
- [ ] Error handling implemented

### Utilities
- [ ] JWT utilities in `utils/jwtUtils.js`
- [ ] Lead assignment in `utils/leadAssignment.js`
- [ ] CSV parser in `utils/csvParser.js`

---

## ✅ Frontend Setup

### Installation
- [ ] Navigated to `frontend` directory
- [ ] Ran `npm install` successfully
- [ ] All dependencies installed without errors

### Configuration
- [ ] Vite configuration in `vite.config.js`
- [ ] Backend API proxy configured correctly
- [ ] Environment variables ready (if needed)

### Project Structure
- [ ] Folder structure created:
  - [ ] `src/components/`
  - [ ] `src/pages/`
  - [ ] `src/styles/`
  - [ ] `src/utils/`
  - [ ] `src/hooks/`
  - [ ] `src/context/`

### Core Files
- [ ] `src/main.jsx` - Entry point
- [ ] `src/App.jsx` - Main component
- [ ] `src/App.css` - App styles
- [ ] `src/index.css` - Global styles
- [ ] `public/index.html` - HTML template

### Utilities
- [ ] API client in `src/utils/apiClient.js`
- [ ] Helper functions in `src/utils/helpers.js`

### Hooks
- [ ] Custom hooks in `src/hooks/useForm.js`

### Context
- [ ] Auth context in `src/context/AuthContext.jsx`

### Development Server
- [ ] Ran `npm run dev` successfully
- [ ] Dev server started on port 3000
- [ ] No console errors
- [ ] Application loads in browser
- [ ] Can navigate without crashes

---

## ✅ Database Setup

### Collections
- [ ] Users collection created (auto-created by Mongoose)
- [ ] Leads collection created (auto-created by Mongoose)
- [ ] Activities collection created (auto-created by Mongoose)

### Indexes
- [ ] Index on User.email (unique)
- [ ] Index on Lead.language
- [ ] Index on Lead.assignedTo
- [ ] Index on Lead.status
- [ ] Index on Activity.createdAt

**Verify indexes (in MongoDB):**
```javascript
use cuvutee
db.leads.getIndexes()
// Should show indexes on language, assignedTo, status
```

---

## ✅ Integration Testing

### Cross-Origin Communication
- [ ] Frontend can reach backend API
- [ ] CORS errors not present
- [ ] API responses received correctly

### Authentication Flow
- [ ] Can register new user (if enabled)
- [ ] Can login with valid credentials
- [ ] Token stored in localStorage
- [ ] Token sent in API request headers
- [ ] Logout clears token

### API Endpoints
*Test each endpoint:*

```bash
# Health Check
curl http://localhost:5000/api/health

# Auth
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cuvutee.com","password":"admin123"}'

# Employees (requires auth token)
curl http://localhost:5000/api/employees \
  -H "Authorization: Bearer <token>"

# Dashboard
curl http://localhost:5000/api/dashboard/stats \
  -H "Authorization: Bearer <token>"
```

---

## ✅ Documentation

- [ ] `README.md` created and filled
- [ ] `PROJECT_DOCUMENTATION.md` created
- [ ] `QUICK_START.md` created
- [ ] `backend/README.md` created
- [ ] `frontend/README.md` created
- [ ] API documentation complete

---

## ✅ Git & Version Control

- [ ] `.gitignore` files created for both frontend and backend
- [ ] `node_modules` not tracked
- [ ] `.env` files not tracked
- [ ] Secrets not committed

---

## ✅ File Structure Verification

### Backend File Count
```
backend/
├── models/ (3 files: User.js, Lead.js, Activity.js)
├── routes/ (4 files: auth, employee, lead, dashboard)
├── controllers/ (4 files: auth, employee, lead, dashboard)
├── middleware/ (2 files: auth, upload)
├── utils/ (3 files: jwt, assignment, csv)
├── server.js
├── package.json
├── .env.example
└── README.md
```
- [ ] Count matches expected (17 files + folders)

### Frontend File Count
```
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── styles/
│   ├── utils/ (2 files: apiClient.js, helpers.js)
│   ├── hooks/ (1 file: useForm.js)
│   ├── context/ (1 file: AuthContext.jsx)
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── public/
│   └── index.html
├── vite.config.js
├── package.json
└── README.md
```
- [ ] Required files present

---

## ✅ Performance Check

### Backend
- [ ] Server starts in < 5 seconds
- [ ] API responds in < 300ms
- [ ] No memory leaks logged
- [ ] Database queries optimized

### Frontend
- [ ] Page loads in < 2 seconds
- [ ] No console errors
- [ ] Responsive to user input
- [ ] CSS loads without issues

---

## ✅ Security Check

### Backend
- [ ] Passwords not logged in console
- [ ] JWT_SECRET set to secure value
- [ ] CORS origin restricted
- [ ] No sensitive data in response headers
- [ ] Input validation implemented
- [ ] SQL injection prevention (using MongoDB)

### Frontend
- [ ] Token not exposed in URL
- [ ] Token stored securely (localStorage with caution)
- [ ] No credentials in API calls (except header)
- [ ] No hardcoded secrets in code

---

## ✅ Final Verification

### Manual Testing
- [ ] Can access homepage
- [ ] Can navigate without errors
- [ ] API calls successful
- [ ] Data displayed correctly
- [ ] Forms validate inputs
- [ ] Error messages shown appropriately

### Browser Console
- [ ] No red error messages
- [ ] No security warnings
- [ ] No CORS errors
- [ ] No deprecation warnings

### Terminal Output
- [ ] Backend server running cleanly
- [ ] Frontend dev server running cleanly
- [ ] MongoDB connection successful
- [ ] No warning messages

---

## 🚀 Ready for Development!

If all checkboxes are checked, your project is ready for:
1. ✅ Component development
2. ✅ Feature implementation
3. ✅ UI/UX design implementation
4. ✅ Testing
5. ✅ Deployment

---

## 📋 Next Steps

- [ ] Review Figma design
- [ ] Plan component hierarchy
- [ ] Create component files
- [ ] Implement styling
- [ ] Add interactivity
- [ ] Test all features
- [ ] Setup deployment

---

## 🔧 Quick Troubleshoot

**If something is missing:**

1. **Check backend models:**
   ```bash
   ls -la backend/models/
   # Should show: User.js, Lead.js, Activity.js
   ```

2. **Check frontend structure:**
   ```bash
   ls -la frontend/src/
   # Should show all required folders
   ```

3. **Verify package.json:**
   ```bash
   cat backend/package.json | grep dependencies
   cat frontend/package.json | grep dependencies
   ```

4. **Re-install dependencies:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

---

**Setup Verification Complete!** ✨

Your MERN-Cuvutee project is ready for development. 🎉
