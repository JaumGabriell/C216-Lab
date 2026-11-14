export function UserList({ users }) {
  if (users.length === 0) {
    return (
      <p className="text-center text-gray-500">Nenhum usuário encontrado.</p>
    );
  }

  return (
    <ul className="space-y-2">
      {users.map((user) => (
        <li key={user.id} className="border-b border-slate-200 pb-2">
          <h3 className="font-medium">{user.name}</h3>
          <p className="text-sm text-gray-500">{user.email}</p>
        </li>
      ))}
    </ul>
  );
}
