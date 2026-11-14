import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";

import { UserForm } from "../../components/UserForm";

it("chama onAdd com os dados do formulário", async () => {
  const onAdd = vi.fn();
  const user = userEvent.setup();

  render(<UserForm onAdd={onAdd} />);

  await user.type(screen.getByLabelText("Nome do Usuário"), "João Gabriel");

  await user.type(screen.getByLabelText("E-mail"), "joao@email.com");

  await user.type(screen.getByLabelText("Senha"), "123456");

  await user.click(screen.getByRole("button", { name: "Adicionar Usuário" }));

  expect(onAdd).toHaveBeenCalledOnce();

  expect(onAdd).toHaveBeenCalledWith({
    name: "João Gabriel",
    email: "joao@email.com",
    password: "123456",
  });
});

it("define os campos como obrigatórios", () => {
  render(<UserForm onAdd={vi.fn()} />);

  expect(screen.getByLabelText("Nome do Usuário")).toBeRequired();
  expect(screen.getByLabelText("E-mail")).toBeRequired();
  expect(screen.getByLabelText("Senha")).toBeRequired();

  expect(screen.getByLabelText("E-mail")).toHaveAttribute("type", "email");

  expect(screen.getByLabelText("Senha")).toHaveAttribute("type", "password");
});
