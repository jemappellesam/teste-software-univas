import { test, expect } from '@playwright/test'

test.describe('Tasks', () => {

  test('criar uma nova task', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: 'Tasks' }).click()
    await expect(page.getByRole('heading', { name: /Tasks/i })).toBeVisible()

    await page.getByRole('button', { name: /Adicionar Task/i }).click()

    const titleInput = page.locator('#task-title')
    const userSelect = page.locator('#task-user')

    await expect(titleInput).toBeVisible()
    await expect(userSelect).toBeVisible()

    const newTaskTitle = `Task Teste ${Date.now()}`

    await titleInput.fill(newTaskTitle)
    await userSelect.selectOption({ index: 0 })

    await page.getByRole('button', { name: /Criar/i }).click()

    const newTaskCell = page.locator('table tbody tr').first().locator('td').first()
    await expect(newTaskCell).toHaveText(newTaskTitle)
  })

  test('excluir uma task existente', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: 'Tasks' }).click()
    await expect(page.getByRole('heading', { name: /Tasks/i })).toBeVisible()

    const firstRow = page.locator('table tbody tr').first()
    const taskTitle = await firstRow.locator('td').first().innerText()

    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Tem certeza que deseja excluir esta task?')
      await dialog.accept()
    })

    await firstRow.getByRole('button', { name: /Excluir/i }).click()

    await expect(page.locator('table tbody tr').filter({ hasText: taskTitle })).toHaveCount(0, { timeout: 10000 })
  })

})
