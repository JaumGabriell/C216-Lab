import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from './Icon'
import { register } from '../services/user'

export default function SingUp({ onAuthenticated }) {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function submit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    const form = new FormData(event.currentTarget)
    try {
      const session = await register(form.get('name'), form.get('email'), form.get('password'))
      localStorage.setItem('roomly_session', JSON.stringify(session))
      onAuthenticated(session)
      navigate(session.user.role === 'admin' ? '/admin' : '/reservas', { replace: true })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-brand"><div className="brand-mark"><Icon name="door" size={24}/></div><span>Roomly</span></div>
      <section className="auth-card">
        <div className="auth-heading">
          <span className="eyebrow">Criar conta</span>
          <h1>Cadastre-se</h1>
          <p>Crie sua conta para reservar espaços.</p>
        </div>
        <form onSubmit={submit} className="auth-form">
          <label>Nome completo<input name="name" required maxLength="100" placeholder="Seu nome"/></label>
          <label>E-mail<input name="email" type="email" required placeholder="voce@empresa.com"/></label>
          <label>Senha<input name="password" type="password" required minLength="6" placeholder="••••••••"/></label>
          {error && <div className="form-error">{error}</div>}
          <button className="primary auth-submit" disabled={submitting}>{submitting ? 'Criando conta...' : 'Criar conta'}</button>
        </form>
        <Link className="auth-switch" to="/login">Já possui conta? Entrar</Link>
      </section>
    </div>
  )
}