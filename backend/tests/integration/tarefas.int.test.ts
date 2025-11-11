import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import request from 'supertest'
import app, { prisma as appPrisma } from '../../src/index'
import { prisma, resetDb } from './testDb'

describe('Tasks API', () => {
  afterAll(async () => {
    await prisma.$disconnect()
    await appPrisma.$disconnect()
  })

  beforeEach(async () => {
    await resetDb()
  })

  it('POST /api/tasks cria tarefa válida', async () => {
    const user = await prisma.user.create({
      data: { name: 'User Test', email: 'user@test.com' }
    })
    const category = await prisma.category.create({
      data: { name: 'General' }
    })

    const res = await request(app)
      .post('/api/tasks')
      .send({
        title: 'Tarefa Inicial',
        description: 'Descrição teste',
        status: 'PENDING',
        priority: 'HIGH',
        userId: user.id,
        categoryId: category.id
      })

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data.title).toBe('Tarefa Inicial')
    expect(res.body.data.userId).toBe(user.id)
    expect(res.body.data.categoryId).toBe(category.id)
  })

  it('GET /api/tasks lista tarefas', async () => {
    const user = await prisma.user.create({
      data: { name: 'Ana', email: 'ana@ex.com' },
    })

    const category = await prisma.category.create({
      data: { name: 'General' },
    })

    await prisma.task.create({
      data: {
        title: 'Tarefa Listagem',
        description: 'Testando listagem',
        userId: user.id,
        categoryId: category.id,
      },
    })

    const res = await request(app).get('/api/tasks')

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.data.some((t: any) => t.title === 'Tarefa Listagem')).toBe(true)
  })

  it('GET /api/tasks/:id retorna tarefa específica', async () => {
    const user = await prisma.user.create({
      data: { name: 'User Test', email: 'user@test.com' }
    })
    const category = await prisma.category.create({
      data: { name: 'General' }
    })
    const task = await prisma.task.create({
      data: {
        title: 'Tarefa Específica',
        description: 'Teste GET por ID',
        status: 'PENDING',
        priority: 'MEDIUM',
        userId: user.id,
        categoryId: category.id
      }
    })

    const res = await request(app).get(`/api/tasks/${task.id}`)
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.id).toBe(task.id)
    expect(res.body.data.title).toBe('Tarefa Específica')
  })

  it('PUT /api/tasks atualiza tarefa', async () => {
    const user = await prisma.user.create({
      data: { name: 'User Test', email: 'user@test.com' }
    })
    const category = await prisma.category.create({
      data: { name: 'General' }
    })
    const task = await prisma.task.create({
      data: {
        title: 'Tarefa Antiga',
        description: 'Antiga descrição',
        status: 'PENDING',
        priority: 'LOW',
        userId: user.id,
        categoryId: category.id
      }
    })

    const updatedData = {
      title: 'Tarefa Atualizada',
      description: 'Nova descrição',
      status: 'IN_PROGRESS',
      priority: 'HIGH'
    }

    const resPut = await request(app)
      .put(`/api/tasks/${task.id}`)
      .send(updatedData)

    expect(resPut.status).toBe(200)
    expect(resPut.body.data.title).toBe(updatedData.title)
    expect(resPut.body.data.status).toBe(updatedData.status)
    expect(resPut.body.data.description).toBe(updatedData.description)

    const resGet = await request(app).get(`/api/tasks/${task.id}`)
    expect(resGet.body.data.title).toBe(updatedData.title)
  })

  it('DELETE /api/tasks exclui tarefa', async () => {
    const user = await prisma.user.create({
      data: { name: 'User Test', email: 'user@test.com' }
    })
    const category = await prisma.category.create({
      data: { name: 'General' }
    })
    const task = await prisma.task.create({
      data: {
        title: 'Tarefa para Deletar',
        description: 'Será removida',
        userId: user.id,
        categoryId: category.id
      }
    })

    const resDel = await request(app).delete(`/api/tasks/${task.id}`)

    expect(resDel.status).toBe(200)
    expect(resDel.body.success).toBe(true)
    expect(resDel.body.message).toBe('Task deleted successfully')

    const resGet = await request(app).get(`/api/tasks/${task.id}`)
    expect(resGet.status).toBe(404)
  })
})
