# Cuvutee - Sales CRM Frontend

React-based frontend for the Sales CRM application built with React JS and Vanilla CSS.

## Tech Stack
- **React 18**: Modern UI framework
- **Vite**: Ultra-fast build tool
- **Recharts**: Charting library for data visualization
- **Axios**: HTTP client for API calls
- **Vanilla CSS**: No Tailwind, pure CSS styling

## Project Structure

```
src/
├── components/         # Reusable components
├── pages/             # Page components
├── styles/            # Global and module styles
├── utils/             # Utility functions
├── hooks/             # Custom React hooks
├── context/           # React Context for state management
├── App.jsx            # Main app component
├── App.css            # Main app styles
├── index.css          # Global styles
└── main.jsx           # App entry point
```

## Installation

### Prerequisites
- Node.js 16 or higher
- npm or yarn

### Setup

```bash
cd frontend
npm install
```

## Development

### Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Environment Variables

Create a `.env` file in the frontend directory:

```
VITE_API_URL=http://localhost:5000/api
```

## Key Features

### Dashboard
- KPI cards showing key metrics
- Sales performance graph (past 2 weeks)
- Recent activity feed (7 latest activities)
- Active sales people list
- Team member search functionality

### Employee Management
- Employee list with pagination (8 per page)
- Create, edit, delete employees
- Bulk delete functionality
- Real-time search filtering

### Leads Management
- CSV upload for bulk lead import
- Manual lead creation
- Lead status updates (Hot, Warm, Cold, Scheduled)
- Language-based lead assignment
- Lead details viewing

### Admin Settings
- Profile management
- Configuration updates
- User settings

## CSS Conventions

### Global Utilities
- `.container`: Max-width container with padding
- `.flex`, `.flex-center`, `.flex-between`: Flexbox utilities
- `.grid`: Grid layout utility
- `.gap-1` to `.gap-4`: Gap spacing utilities
- `.mt-1` to `.mt-4`, `.mb-1` to `.mb-4`, `.p-1` to `.p-4`: Spacing utilities

### Component Styling
- Each component has its own CSS module in the styles folder
- Use BEM naming convention for CSS classes
- Maintain consistent spacing and color schemes

## State Management

Currently using React Context API for global state management. Structure:
- User authentication context
- Dashboard data context
- Lead management context

## API Integration

All API calls use Axios with interceptors for:
- Token attachment to requests
- Token refresh on 401 responses
- Error handling and logging

## Performance Optimization

- Lazy loading for routes using React.lazy()
- Memoization for expensive components
- Optimized re-renders using useCallback

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing Guidelines

1. Create a feature branch
2. Follow React best practices
3. Keep components small and focused
4. Use meaningful commit messages
5. Test before submitting

## Troubleshooting

### Port Already in Use
```bash
# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### Node Modules Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

## Deployment

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Deploy the dist folder to Netlify
```

### Docker
```bash
docker build -t cuvutee-frontend .
docker run -p 3000:3000 cuvutee-frontend
```

## Support

For issues and questions, please create an issue in the repository.
