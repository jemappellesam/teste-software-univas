import { render, screen, waitFor } from '@testing-library/react'
import Categories from '../../src/components/Categories'
import { server, apiGet, json } from '../setup'

describe('Catory integration - carga de lista', () => {
  it('renderiza categorias retornados pela API', async () => {
    server.use(
      apiGet('/categories', (_req) =>
        json({
          data: [
            { id: '1', name: 'Nome da categoria', description: 'Descrição específica da categoria', createdAt: new Date().toISOString },
          ]
        })
      )
    )

    render(<Categories />)

    await waitFor(() => {
      expect(screen.getByText('Nome da categoria')).toBeInTheDocument()
      expect(screen.getByText('Descrição específica da categoria')).toBeInTheDocument()
    })
  })
})
