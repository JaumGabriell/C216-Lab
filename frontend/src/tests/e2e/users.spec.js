import { expect, test } from "@playwright/test";

test("cadastra um usuário e mantém os dados após atualizar a página", async ({
  page,
}) => {
  const uniqueId = Date.now();

  const name = `Usuário E2E ${uniqueId}`;
  const email = `e2e-${uniqueId}@example.com`;
  const password = "Teste123456";

  await page.goto("/");

  // Preenche o formulário
  await page.getByLabel("Nome do Usuário").fill(name);
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("Senha").fill(password);

  // Cadastra o usuário
  await page.getByRole("button", { name: "Adicionar Usuário" }).click();

  // Verifica se apareceu na listagem
  let userItem = page.getByRole("listitem").filter({
    hasText: email,
  });

  await expect(userItem).toBeVisible();
  await expect(userItem).toContainText(name);

  // Atualiza a página
  await page.reload();

  // Verifica se o usuário continua cadastrado
  userItem = page.getByRole("listitem").filter({
    hasText: email,
  });

  await expect(userItem).toBeVisible();
  await expect(userItem).toContainText(name);
  await expect(userItem).toContainText(email);

  // A senha não deve aparecer na listagem
  await expect(userItem).not.toContainText(password);
});
