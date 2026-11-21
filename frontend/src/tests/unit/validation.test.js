import { describe, expect, it } from 'vitest'
import { validateEmail, validateName, validatePassword } from '../../validation'

describe('validation helpers', () => {
  it('valida e-mail válido e inválido', () => {
    expect(validateEmail('joao@empresa.com')).toBe('')
    expect(validateEmail('joaoempresa.com')).toBe('Informe um e-mail válido.')
  })

  it('exige nome preenchido', () => {
    expect(validateName('João Silva')).toBe('')
    expect(validateName('   ')).toBe('Informe seu nome.')
  })

  it('exige senha com pelo menos seis caracteres', () => {
    expect(validatePassword('123456')).toBe('')
    expect(validatePassword('123')).toBe('A senha deve ter pelo menos 6 caracteres.')
  })
})
