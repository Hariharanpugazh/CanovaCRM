# Canova CRM - Sales Management System

A modern Sales CRM built with **React, Node.js, and MongoDB**. Manage leads, employees, track attendance, and monitor real-time sales performance with intelligent lead assignment and role-based access control.

## Key Features

- **Dashboard**: Real-time KPI metrics, sales performance charts, recent activities, active sales team
- **Employee Management**: Create, edit, delete, bulk operations with status tracking
- **Leads Management**: CSV import, manual creation, intelligent language-based assignment
- **Attendance System**: Check-in/out, break tracking, activity logging
- **Real-time Search**: Case-insensitive team member and leads search
- **Role-Based Access**: Admin and Sales User roles with JWT authentication

## Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | React + Vanilla CSS |
| **Backend** | Node.js + Express |
| **Database** | MongoDB |

## Deployment Links

| Platform | URL |
|----------|-----|
| **Employee Portal** | [https://canovacrm-employee.harlee.pro](https://canovacrm-employee.harlee.pro) |
| **Admin Dashboard** | [https://canovacrm-admin.harlee.pro](https://canovacrm-admin.harlee.pro) |
| **Backend API** | [https://canovacrm-knj2.onrender.com](https://canovacrm-knj2.onrender.com) |
| **GitHub Repository** | [https://github.com/Hariharanpugazh/CanovaCRM](https://github.com/Hariharanpugazh/CanovaCRM) |

## Login Credentials

### Admin Dashboard
```
Email:    admin@cuvutee.com
Password: admin123
```

### Employee Portal
```
Email:    emp001@gmail.com
Password: emp001@gmail.com
```

## Quick Start

### Prerequisites
- Node.js 16+
- npm/yarn
- MongoDB

### Installation

**1. Clone Repository**
```bash
git clone https://github.com/Hariharanpugazh/CanovaCRM.git
cd MERN-Cuvutee
```

**2. Backend Setup**
```bash
cd backend
npm install
npm run dev
```

**3. Frontend Setup** (new terminal)
```bash
cd emp-frontend
npm install
npm run dev
```

**4. Admin Frontend Setup** (new terminal)
```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
├── backend/
│   ├── models/              # MongoDB schemas
│   ├── controllers/         # Business logic
│   ├── routes/              # API endpoints
│   ├── middleware/          # Auth, upload
│   └── utils/               # Helpers
├── emp-frontend/            # Employee Portal
│   └── src/
├── frontend/                # Admin Dashboard
│   └── src/
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Current user

### Employees
- `GET /api/employees` - List employees
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Leads
- `GET /api/leads/my-leads` - User's leads
- `GET /api/leads/scheduled-calls` - Scheduled leads
- `POST /api/leads/upload-csv` - CSV upload
- `PUT /api/leads/:id/status` - Update status

### Dashboard
- `GET /api/dashboard/stats` - KPI metrics
- `GET /api/dashboard/graph` - Sales graph
- `GET /api/dashboard/activities` - Recent activities

## Key Functionality

### Intelligent Lead Assignment
- Language-based matching
- Round-robin distribution
- Maximum 3 leads per user threshold
- Automatic activity logging

### Attendance Tracking
- Real-time check-in/out
- Break start/end with duration logging
- Activity feed integration
- Last 4 break logs display

### Sales Metrics
- Conversion Rate: (Closed Leads / Assigned Leads) × 100
- Unassigned Leads Count
- Weekly Assignment Count
- Active Sales People Count

## Database Collections

- **Users**: Admin and Sales employees with language preferences
- **Leads**: Sales leads with assignment tracking and status
- **Attendance**: Daily check-in/out and break records
- **Activities**: Audit log of all user actions

## Security

- JWT authentication with token-based sessions
- Password hashing (bcryptjs)
- Role-based access control (RBAC)
- CORS enabled for multi-frontend deployment
- Input validation and sanitization

## Environment Configuration

### Backend (.env)
```
MONGODB_URI=<your-mongodb-uri>
PORT=5000
JWT_SECRET=<your-secret>
FRONTEND_URL=<frontend-urls>
NODE_ENV=production
```

### Frontend (.env.local)
```
REACT_APP_API_URL=<backend-url>
```

## Support

For issues or questions:
1. Check GitHub repository
2. Review API documentation in backend
3. Check browser console for errors

---

**Version**: 1.0.0 | **Last Updated**: April 2026 | **Status**: Production Ready ✅
