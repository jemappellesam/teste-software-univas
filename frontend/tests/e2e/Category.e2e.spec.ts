import { test, expect } from '@playwright/test'

test.describe('Categorias', () => {
  test('navega para categorias e lista itens do backend', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: 'Categorias' }).click()

    await expect(page.getByRole('heading', { name: /Categorias/i })).toBeVisible()

    const table = page.getByRole('table')
    await expect(table).toBeVisible()

    const rows = table.getByRole('row') 
    const firstDataRow = rows.nth(1)
    await expect(firstDataRow.getByRole('cell').first()).not.toHaveText('-')

    await expect(firstDataRow.getByRole('button', { name: /Editar/i })).toBeVisible()
    await expect(firstDataRow.getByRole('button', { name: /Excluir/i })).toBeVisible()
  });
 test('editar uma categoria existente', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: 'Categorias' }).click()
    await expect(page.getByRole('heading', { name: /Categorias/i })).toBeVisible()

    const firstRow = page.locator('table tbody tr').first()
    const originalName = await firstRow.locator('td').first().innerText()

    await firstRow.getByRole('button', { name: /Editar/i }).click()

    const nameInput = page.locator('#category-name')
    const descriptionInput = page.locator('#category-description')

    await expect(nameInput).toBeVisible()
    await expect(descriptionInput).toBeVisible()

    const updatedName = originalName + ' Atualizada'
    await nameInput.fill(updatedName)
    await descriptionInput.fill('Descrição alterada pelo teste')

    await page.getByRole('button', { name: /Atualizar/i }).click()

    const updatedCell = page.locator('table tbody tr').first().locator('td').first()
    await expect(updatedCell).toHaveText(updatedName)
  })

  test('criar uma nova categoria', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: 'Categorias' }).click()
    await expect(page.getByRole('heading', { name: /Categorias/i })).toBeVisible()

    await page.getByRole('button', { name: /Adicionar Categoria/i }).click()

    const nameInput = page.locator('#category-name')
    const descriptionInput = page.locator('#category-description')

    await expect(nameInput).toBeVisible()
    await expect(descriptionInput).toBeVisible()

    const newName = `Categoria Teste ${Date.now()}`

    await nameInput.fill(newName)
    await descriptionInput.fill('Descrição criada pelo teste')

    await page.getByRole('button', { name: /Criar/i }).click()

    const newCategoryCell = page.locator('table tbody tr').first().locator('td').first()
    await expect(newCategoryCell).toHaveText(newName)
  });
   test('excluir uma categoria existente', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('link', { name: 'Categorias' }).click()
  await expect(page.getByRole('heading', { name: /Categorias/i })).toBeVisible()

  const firstRow = page.locator('table tbody tr').first()
  const categoryName = await firstRow.locator('td').first().innerText()

  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toContain('Tem certeza que deseja excluir esta categoria?')
    await dialog.accept()
  })

  await firstRow.getByRole('button', { name: /Excluir/i }).click()

  await expect(page.locator('table tbody tr').filter({ hasText: categoryName })).toHaveCount(0, { timeout: 10000 })
})
})
