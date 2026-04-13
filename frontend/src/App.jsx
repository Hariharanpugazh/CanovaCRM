import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import Leads from './pages/Leads'
import Employees from './pages/Employees'
import './App.css'
import Layout from './components/Layout'

// Protected Route Component
// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated, loading } = useAuth()

//   if (loading) {
//     return <div className="loading">Loading...</div>
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />
//   }

//   return children
// }

// Login UI intentionally disabled.
// Requirement: no admin login in frontend; always land on /dashboard.
// (Keeping the old placeholder here commented for reference.)
/*
const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await login(email, password)
    if (!result.success) {
      setError(result.error)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>CanovaCRM</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@cuvutee.com"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="btn-login">Login</button>
        </form>
      </div>
    </div>
  )
}
*/

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Login is disabled: always redirect /login -> /dashboard */}
          <Route path="/login" element={<Navigate to="/dashboard" replace />} />

          {/* All app pages use the Layout (sidebar) */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="leads" element={<Leads />} />
            <Route path="employees" element={<Employees />} />
            <Route path="settings" element={<Settings />} />

            {/* Any unknown route should land on dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
