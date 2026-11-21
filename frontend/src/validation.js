export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return 'Informe um e-mail.'
  }

  const normalizedEmail = email.trim()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return 'Informe um e-mail válido.'
  }

  return ''
}

export function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return 'Informe uma senha.'
  }

  if (password.length < 6) {
    return 'A senha deve ter pelo menos 6 caracteres.'
  }

  return ''
}

export function validateName(name) {
  if (!name || typeof name !== 'string' || !name.trim()) {
    return 'Informe seu nome.'
  }

  if (name.trim().length > 100) {
    return 'O nome deve ter no máximo 100 caracteres.'
  }

  return ''
}