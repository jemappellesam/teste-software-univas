import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import request from 'supertest'
import app, { prisma as appPrisma } from '../../src/index'
import { prisma, resetDb } from './testDb'

describe('Users API', () => {
  afterAll(async () => {
    await prisma.$disconnect()
    await appPrisma.$disconnect()
  })
  beforeEach(async () => {
    await resetDb()
  })
  it('POST /api/users cria usuário válido', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Ana', email: 'ilovewoosungsomuch@ex.com' })
    expect(res.status).toBe(201)
    expect(res.body.data).toMatchObject({ name: 'Ana', email: 'ilovewoosungsomuch@ex.com' })
  })
  it('GET /api/users lista usuários', async () => {
    await prisma.user.create({ data: { name: 'Ana', email: 'ilovewoosungsomuch@ex.com' } })
    const res = await request(app).get('/api/users')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.data.some((u: any) => u.email === 'ilovewoosungsomuch@ex.com')).toBe(true)
  })
it('PUT /api/users atualiza usuário', async () => {
  const user = await prisma.user.create({
    data: { name: 'Ana', email: 'ilovewoosungsomuch@ex.com' },
  });

  const updatedData = { 
    name: 'Ana Atualizada', 
    email: 'ana.atualizada@ex.com' 
  };

  const resPut = await request(app)
    .put(`/api/users/${user.id}`) 
    .send(updatedData);

  expect(resPut.status).toBe(200);
  
  const resGet = await request(app).get(`/api/users/${user.id}`)
   expect(resPut.body.data.name).toBe(updatedData.name);
   expect(resPut.body.data.email).toBe(updatedData.email);
});
it('DELETE /api/users excluir usuário', async () => {
  const user = await prisma.user.create({
    data: { name: 'Ana', email: 'ilovewoosungsomuch@ex.com' },
  });

  const resDel = await request(app)
    .delete(`/api/users/${user.id}`);

     expect(resDel.status).toBe(200);
     expect(resDel.body.success).toBe(true);

     
     expect(resDel.message === "User deleted successfully");

});
})
