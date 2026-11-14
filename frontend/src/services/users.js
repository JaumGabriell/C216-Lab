const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function listUsers() {
  const response = await fetch(`${API_URL}/users/`);
  if (!response.ok) {
    throw new Error("Erro ao listar usuários");
  }
  return response.json();
}

export async function createUser(user) {
  const response = await fetch(`${API_URL}/users/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error("Erro ao cadastrar usuário");
  }

  return response.json();
}
