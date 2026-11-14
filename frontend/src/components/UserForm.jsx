import { useState } from "react";
import { validateUser } from "../validation";

export function UserForm({ onAdd }) {
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const result = validateUser({
      name,
      email,
      password,
    });

    setErrors(result.errors);

    if (Object.keys(result.errors).length > 0) {
      return;
    }

    onAdd(result.values);

    setName("");
    setEmail("");
    setPassword("");
    setErrors({});
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
    >
      {/* Nome */}
      <div className="space-y-1">
        <label htmlFor="user-name" className="block text-sm font-medium">
          Nome do Usuário
        </label>

        <input
          id="user-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Digite o nome"
          required
          className="w-full rounded border border-slate-300 p-2 text-sm"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "user-name-error" : undefined}
        />
        {errors.name && (
          <p id="user-name-error" role="alert" className="text-sm text-red-700">
            {errors.name}
          </p>
        )}
      </div>

      {/* E-mail e Senha */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="user-email" className="block text-sm font-medium">
            E-mail
          </label>

          <input
            id="user-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="usuario@email.com"
            required
            className="w-full rounded border border-slate-300 p-2 text-sm"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "user-email-error" : undefined}
          />
          {errors.email && (
            <p
              id="user-email-error"
              role="alert"
              className="text-sm text-red-700"
            >
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="user-password" className="block text-sm font-medium">
            Senha
          </label>

          <input
            id="user-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Digite a senha"
            required
            className="w-full rounded border border-slate-300 p-2 text-sm"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={
              errors.password ? "user-password-error" : undefined
            }
          />
          {errors.password && (
            <p
              id="user-password-error"
              role="alert"
              className="text-sm text-red-700"
            >
              {errors.password}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
      >
        Adicionar Usuário
      </button>
    </form>
  );
}
