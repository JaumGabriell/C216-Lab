import { expect, test } from "@playwright/test";

test("cadastra um item e o exibe na listagem", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Nome").fill("Item 1");
  await page.getByLabel("Descrição").fill("Descrição do item 1");

  await page.getByRole("button", { name: "Adicionar item" }).click();

  await expect(
    page.getByRole("listitem").getByRole("heading", { name: "Item 1" }),
  ).toBeVisible();
  await expect(page.getByText("Nenhum item cadastrado.")).toBeHidden();
});
