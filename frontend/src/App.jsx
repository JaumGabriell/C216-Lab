import { useEffect, useState } from "react";
import { UserForm } from "./components/UserForm";
import { UserList } from "./components/UserList";
import { createUser, listUsers } from "./services/users";

export default function App() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await listUsers();
        setUsers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  async function addUser({ name, email, password }) {
    setError("");

    const normalizedName = name.trim().toLocaleLowerCase();
    const userAlreadyExists = users.some(
      (user) => user.name.trim().toLocaleLowerCase() === normalizedName,
    );

    if (userAlreadyExists) {
      setError(`Já existe um usuário com o nome "${name.trim()}".`);
      return false;
    }

    try {
      const newUser = await createUser({ name, email, password });
      setUsers((current) => [...current, newUser]);
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-xl space-y-6 p-4 sm:p-6">
      <h1 className="text-3xl font-bold">Gerenciador de Usuários</h1>

      {error && (
        <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <UserForm onAdd={addUser} />

      <section aria-labelledby="items-heading" className="space-y-3">
        <h2 id="items-heading" className="text-xl font-semibold">
          Usuários cadastrados
        </h2>

        {loading ? (
          <p className="text-sm text-slate-500">Carregando usuários...</p>
        ) : (
          <UserList users={users} />
        )}
      </section>
    </main>
  );
}
