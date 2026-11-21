import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.clear())

  await page.route('**/auth/login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        token: 'e2e-token',
        user: { name: 'João Silva', email: 'joao@empresa.com', role: 'user' },
      }),
    })
  })

  await page.route('**/auth/register', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        token: 'e2e-register-token',
        user: { name: 'Maria Souza', email: 'maria@empresa.com', role: 'user' },
      }),
    })
  })

  await page.route('**/spaces', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    })
  })

  await page.route('**/reservations', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    })
  })
})

test('usuário pode entrar e ver a área de reservas', async ({ page }) => {
  await page.goto('/login')

  await page.getByLabel('E-mail').fill('joao@empresa.com')
  await page.getByLabel('Senha').fill('123456')
  await page.getByRole('button', { name: 'Entrar' }).click()

  await expect(page).toHaveURL(/\/reservas$/)
  await expect(page.getByRole('heading', { name: 'Olá, João Silva' })).toBeVisible()
})

test('usuário pode criar uma conta e acessar reservas', async ({ page }) => {
  await page.goto('/cadastro')

  await page.getByLabel('Nome completo').fill('Maria Souza')
  await page.getByLabel('E-mail').fill('maria@empresa.com')
  await page.getByLabel('Senha').fill('123456')
  await page.getByRole('button', { name: 'Criar conta' }).click()

  await expect(page).toHaveURL(/\/reservas$/)
  await expect(page.getByRole('heading', { name: 'Olá, Maria Souza' })).toBeVisible()
})

test('rota protegida redireciona visitante para login', async ({ page }) => {
  await page.goto('/reservas')

  await expect(page).toHaveURL(/\/login$/)
  await expect(page.getByRole('heading', { name: 'Acesse sua conta' })).toBeVisible()
})
