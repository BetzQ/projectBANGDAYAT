import './App.css'
import HomePage from './pages/Home'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RegisterPage from './pages/Register'
import LoginPage from './pages/Login'
import DashboardPage from './pages/Dashboard'
import AdminDashboardPage from './pages/AdminDashboard'

function App() {
  function removeTokenIfNotDashboard() {
    const currentPath = window.location.pathname
    if (currentPath !== '/dashboard' && currentPath !== '/admindashboard') {
      // Hapus session bernama "token"
      sessionStorage.removeItem('token')
    }
  }

  removeTokenIfNotDashboard()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admindashboard" element={<AdminDashboardPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
