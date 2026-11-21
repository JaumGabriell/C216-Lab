import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../../App'

vi.mock('../../components/Login', () => ({
  default: ({ onAuthenticated }) => (
    <button
      onClick={() => {
        const session = {
          token: 'token-1',
          user: { name: 'João', email: 'joao@empresa.com', role: 'user' },
        }
        localStorage.setItem('roomly_session', JSON.stringify(session))
        onAuthenticated(session)
      }}
    >
      Entrar no sistema
    </button>
  ),
}))

vi.mock('../../components/SingUp', () => ({
  default: () => <h1>Página de cadastro</h1>,
}))

vi.mock('../../components/User', () => ({
  default: ({ session }) => <h1>Olá, {session.user.name}</h1>,
}))

vi.mock('../../components/Admin', () => ({
  default: ({ session }) => <h1>Painel de {session.user.name}</h1>,
}))

function renderApp(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('redireciona usuário não autenticado para login', async () => {
    renderApp('/')

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Entrar no sistema' })).toBeInTheDocument()
    })
  })

  it('atualiza a sessão e navega para reservas após autenticar', async () => {
    const user = userEvent.setup()
    renderApp('/login')

    await user.click(screen.getByRole('button', { name: 'Entrar no sistema' }))

    expect(await screen.findByRole('heading', { name: 'Olá, João' })).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('roomly_session')).token).toBe('token-1')
  })

  it('exibe cadastro para usuário não autenticado', async () => {
    renderApp('/cadastro')

    expect(await screen.findByRole('heading', { name: 'Página de cadastro' })).toBeInTheDocument()
  })

  it('redireciona sessão administrativa para o painel', async () => {
    localStorage.setItem('roomly_session', JSON.stringify({
      token: 'admin-token',
      user: { name: 'Admin', email: 'admin@admin.com', role: 'admin' },
    }))

    renderApp('/')

    expect(await screen.findByRole('heading', { name: 'Painel de Admin' })).toBeInTheDocument()
  })
})
