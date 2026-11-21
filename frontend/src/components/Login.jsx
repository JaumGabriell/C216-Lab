import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from './Icon'
import { login } from '../services/user'

export default function Login({ onAuthenticated }) {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function submit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    const form = new FormData(event.currentTarget)
    try {
      const session = await login(form.get('email'), form.get('password'))
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
          <span className="eyebrow">Bem-vindo de volta</span>
          <h1>Acesse sua conta</h1>
          <p>Entre para reservar ou gerenciar espaços.</p>
        </div>
        <form onSubmit={submit} className="auth-form">
          <label>E-mail<input name="email" type="email" required placeholder="voce@empresa.com"/></label>
          <label>Senha<input name="password" type="password" required placeholder="••••••••"/></label>
          {error && <div className="form-error">{error}</div>}
          <button className="primary auth-submit" disabled={submitting}>{submitting ? 'Entrando...' : 'Entrar'}</button>
        </form>
        <Link className="auth-switch" to="/cadastro">Não tem conta? Cadastre-se</Link>
      </section>
      <p className="auth-tip">Contas administrativas usam e-mails terminados em <strong>@admin.com</strong>.</p>
    </div>
  )
}