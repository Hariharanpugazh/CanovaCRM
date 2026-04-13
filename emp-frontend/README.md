# Employee Frontend - CanovaCRM

Employee management and lead tracking frontend for the CanovaCRM system built with React and Vanilla CSS. This is the employee-facing interface for the CanovaCRM Sales CRM system.

## Tech Stack
- **Framework**: React JS (v18.2.0)
- **Styling**: Vanilla CSS (CSS Variables for theming)
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **Charting**: Recharts

## Project Structure

```
emp-frontend/
├── public/
│   └── index.html                 # Main HTML template
├── src/
│   ├── pages/
│   │   ├── Login/                 # Employee login page
│   │   │   ├── Login.js
│   │   │   └── Login.css
│   │   ├── Home/                  # Dashboard with check-in/out, activities, leads
│   │   │   ├── Home.js
│   │   │   └── Home.css
│   │   ├── Leads/                 # Leads management and tracking
│   │   │   ├── Leads.js
│   │   │   └── Leads.css
│   │   ├── Schedule/              # Scheduled calls and meetings
│   │   │   ├── Schedule.js
│   │   │   └── Schedule.css
│   │   └── Profile/               # Employee profile management
│   │       ├── Profile.js
│   │       └── Profile.css
│   ├── components/
│   │   └── BottomNavigation/      # Mobile bottom navigation
│   │       ├── BottomNavigation.js
│   │       └── BottomNavigation.css
│   ├── styles/
│   │   ├── index.css              # Global styles and utilities
│   │   └── variables.css          # CSS custom properties
│   ├── utils/
│   │   ├── api.js                 # API client and endpoints
│   │   └── helpers.js             # Utility functions
│   ├── App.js                     # Main app component with routing
│   ├── App.css                    # App-level styles
│   └── index.js                   # React entry point
└── package.json                   # Dependencies and scripts
```

## Features

### 🔐 Login Page
- Email and password authentication
- Secure token-based sessions
- Mock authentication for development

### 🏠 Home Page (Dashboard)
- **Check-in/Check-out**: Log work hours with timestamps
- **Break Tracking**: Start/stop break with status indicator (animated pulse)
- **Break Logs**: View past 4 days of break logs with times and dates
- **Recent Activities**: Scrollable list of last 7 system activities
- **Assigned Leads Preview**: Quick view of 3 most recent assigned leads

### 👥 Leads Page
- View all assigned leads with detailed information
- Search leads by name or email
- Filter leads by status (All, Ongoing, Closed)
- Update lead type (Hot, Warm, Cold)
- Update lead status to Closed
- Validation: Prevent closing scheduled leads before scheduled time

### 📅 Schedule Page
- View scheduled calls and meetings
- Search schedules by name, number, or type
- Filter by schedule type (Referral, Cold Call)
- Display schedule details (Date, Contact, Type)

### 👤 Profile Page
- View employee profile information
- Edit profile details (name, email)
- Change password with confirmation
- Logout functionality
- Profile persistence with localStorage

## Getting Started

### Prerequisites
- Node.js 14+ and npm

### Installation

```bash
# Navigate to the project directory
cd emp-frontend

# Install dependencies
npm install
```

### Running the Project

```bash
# Start development server
npm start
```

The app will open at `http://localhost:3000`

**Default Test Credentials:**
- Email: `any@email.com`
- Password: `any_password`

### Building for Production

```bash
# Create optimized production build
npm run build
```

The build folder will contain production-ready files ready for deployment.

## Design Specifications

- **Design System**: Mobile-first responsive design based on Figma mockups
- **Colors**: Custom CSS variables defined in `variables.css`
- **Responsive**: Optimized for iPhone 6-8 screen size (mobile-first)
- **Typography**: System fonts with fallbacks
- **Spacing**: Consistent spacing scale using CSS custom properties
- **Status Indicators**: 
  - Ongoing: Blue indicator (•)
  - Closed: Green checkmark (✓)
  - Lead Types: Hot (Red), Warm (Orange), Cold (Blue)

## CSS Architecture

- **variables.css**: Brand colors, spacing scale, font sizes, border radius
- **index.css**: Global styles, utility classes, common components
- **Page-specific CSS**: Component-scoped styles for each page
- **No Tailwind**: Pure Vanilla CSS with CSS custom properties for maintainability

## API Integration

The app is configured to connect to a backend API. Update the API endpoints in `src/utils/api.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

### Available API functions:
- `authAPI.login()` - Employee login
- `employeeAPI.getProfile()` - Get employee profile
- `employeeAPI.checkIn()` - Log check-in
- `employeeAPI.checkOut()` - Log check-out
- `leadsAPI.getLeads()` - Get assigned leads
- `leadsAPI.updateLead()` - Update lead details
- `scheduleAPI.getSchedules()` - Get scheduled calls

## LocalStorage Data

The app uses localStorage for session persistence:
- `token` - Authentication token
- `userEmail` - Logged-in user email
- `userProfile` - Employee profile data
- `checkIn_[date]` - Check-in timestamp
- `checkOut_[date]` - Check-out timestamp
- `breakLogs` - Array of break logs

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- **Bundle Size**: ~57KB (gzipped)
- **Optimizations**: Code splitting, lazy loading ready
- **CSS**: Minimal, scoped styles

## Accessibility

- Semantic HTML structure
- Focus management for form inputs
- Clear visual indicators for states
- Readable font sizes and color contrast

## Development Notes

- No third-party UI libraries (no Material-UI, Bootstrap, etc.)
- Pure Vanilla CSS with CSS custom properties
- Mobile-first design approach
- LocalStorage for development/testing (replace with backend API calls)

## Future Enhancements

- [ ] Real API integration with backend
- [ ] Offline mode with service workers
- [ ] Advanced search and filters
- [ ] Lead analytics dashboard
- [ ] Notification system
- [ ] Dark mode support
- [ ] Multi-language support

## Links to Submit

When completing the project, provide:
- User Side (Employee Frontend) Deployed Link
- Backend Deployed Link
- GitHub Repository Link

## License

All rights reserved - CanovaCRM Project
