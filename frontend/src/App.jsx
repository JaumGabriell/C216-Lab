import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Admin from './components/Admin'
import Login from './components/Login'
import SingUp from './components/SingUp'
import User from './components/User'
import './App.css'

function getSession() {
  try {
    return JSON.parse(localStorage.getItem('roomly_session') || 'null')
  } catch {
    return null
  }
}

function App() {
  const [session, setSession] = useState(getSession)

  return (
    <Routes>
      <Route path="/login" element={!session?.token ? <Login onAuthenticated={setSession} /> : <Navigate to={session.user.role === 'admin' ? '/admin' : '/reservas'} replace />} />
      <Route path="/cadastro" element={!session?.token ? <SingUp onAuthenticated={setSession} /> : <Navigate to={session.user.role === 'admin' ? '/admin' : '/reservas'} replace />} />
      <Route path="/admin" element={session?.token && session.user.role === 'admin' ? <Admin session={session} /> : <Navigate to="/login" replace />} />
      <Route path="/reservas" element={session?.token ? <User session={session} /> : <Navigate to="/login" replace />} />
      <Route path="/" element={session?.token ? <Navigate to={session.user.role === 'admin' ? '/admin' : '/reservas'} replace /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to={session?.token ? (session.user.role === 'admin' ? '/admin' : '/reservas') : '/login'} replace />} />
    </Routes>
  )
}

export default App
