export function ItemList({ items }) {
  if (items.length === 0) {
    return <p className="text-center text-gray-500">Nenhum item encontrado.</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id} className="border-b border-slate-200 pb-2">
          <h3 className="font-medium">{item.name}</h3>
          <p className="text-sm text-gray-500">{item.description}</p>
        </li>
      ))}
    </ul>
  );
}
