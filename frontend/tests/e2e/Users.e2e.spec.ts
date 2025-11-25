import { test, expect } from '@playwright/test'
test.describe('Usuários', () => {
  
  test('navega para Usuários e lista itens do backend', async ({ page }) => {
    await page.goto('/') // Dashboard
    await page.getByRole('link', { name: 'Usuários' }).click()
    // Título da seção
    await expect(page.getByRole('heading', { name: /Usuários/i })).toBeVisible()
    // Emails semeados (seed do backend)
    await expect(page.getByText(/john.doe@example.com/i)).toBeVisible()
    await expect(page.getByText(/jane.smith@example.com/i)).toBeVisible()
  });
});

test('cria usuário e aparece na lista', async ({ page }) => {
    await page.goto('/users')
    await page.getByRole('button', { name: /Adicionar Usuário/i }).click()  
    const uniqueEmail = `aluno.${Date.now()}@ex.com`
    await page.getByLabel('Nome:').fill('Aluno E2E')
    await page.getByLabel('Email:').fill(uniqueEmail)  
    await page.getByRole('button', { name: /Criar/i }).click()
      // Aguarda recarga da lista
    await expect(page.getByText(uniqueEmail)).toBeVisible()
  });

test('atualizar usuário', async ({ page }) => {
    await page.goto('/users');

    await page.getByRole('button', { name: /Editar/i }).first().click();

    const nomeInput = page.getByLabel(/Nome/i);
    await expect(nomeInput).toBeVisible();

    await nomeInput.fill('Aluno atualizado - 8976');
    await page.getByRole('button', { name: /Atualizar/i }).click();

    await expect(page.getByText(/Aluno atualizado - 8976/i)).toBeVisible();
});

test('excluir usuário', async ({ page }) => {
    await page.goto('/users');

    const linhaUsuario = page.getByRole('row').nth(1);

    const nomeUsuario = await linhaUsuario.getByRole('cell').first().textContent();

    page.on('dialog', async dialog =>{
        expect(dialog.message()).toContain('Tem certeza que deseja excluir este usuário?')
        await dialog.accept()
    })
     
    await linhaUsuario.getByRole('button', { name: /Excluir/i }).click();
     
    await expect(page.getByText(nomeUsuario!)).not.toBeVisible();
});

