import { afterEach, describe, expect, it, vi } from 'vitest'
import { login, logout, register } from '../../services/user'

afterEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
})

describe('user service', () => {
  it('faz login enviando email e senha', async () => {
    const session = {
      token: 'token-1',
      user: { name: 'João', email: 'joao@empresa.com', role: 'user' },
    }
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue(session),
    })

    await expect(login('joao@empresa.com', '123456')).resolves.toEqual(session)
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/auth/login'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'joao@empresa.com', password: '123456' }),
      }),
    )
  })

  it('retorna a mensagem da API ao falhar o cadastro', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 400,
      json: vi.fn().mockResolvedValue({ detail: 'E-mail já cadastrado' }),
    })

    await expect(register('João', 'joao@empresa.com', '123456'))
      .rejects.toThrow('E-mail já cadastrado')
  })

  it('faz logout autenticado', async () => {
    localStorage.setItem('roomly_session', JSON.stringify({ token: 'token-1' }))
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 204,
      json: vi.fn(),
    })

    await expect(logout()).resolves.toBeNull()
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/auth/logout'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer token-1' }),
      }),
    )
  })
})
