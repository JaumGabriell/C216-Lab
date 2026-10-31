import { render, screen } from "@testing-library/react";
import useEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { ItemForm } from "../../components/ItemForm";

it("chama onAdd com os dados do formulário", async () => {
  const onAdd = vi.fn();
  render(<ItemForm onAdd={onAdd} />);

  const user = useEvent.setup();

  await user.type(screen.getByLabelText(/nome/i), "Item 1");
  await user.type(screen.getByLabelText(/descrição/i), "Descrição do item 1");
  await user.click(screen.getByRole("button", { name: /adicionar/i }));

  expect(onAdd).toHaveBeenCalledOnce();
  expect(onAdd).toHaveBeenCalledWith({
    name: "Item 1",
    description: "Descrição do item 1",
  });
});
