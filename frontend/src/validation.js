export const NAME_MAX_LENGTH = 100;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateUser({ name, email, password }) {
  const errors = {};

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();

  // Validação do nome
  if (!trimmedName) {
    errors.name = "O nome é obrigatório.";
  } else if (trimmedName.length > NAME_MAX_LENGTH) {
    errors.name = `O nome deve ter no máximo ${NAME_MAX_LENGTH} caracteres.`;
  }

  // Validação do e-mail
  if (!trimmedEmail) {
    errors.email = "O e-mail é obrigatório.";
  } else if (!EMAIL_REGEX.test(trimmedEmail)) {
    errors.email = "Informe um e-mail válido.";
  }

  // Validação da senha
  if (!password) {
    errors.password = "A senha é obrigatória.";
  }

  return {
    errors,
    values: {
      name: trimmedName,
      email: trimmedEmail,
      password,
    },
  };
}
