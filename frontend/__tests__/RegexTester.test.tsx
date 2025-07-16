import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RegexTester from '../components/RegexTester'

describe('RegexTester', () => {
  it('shows match result for valid regex', async () => {
    const user = userEvent.setup()
    render(<RegexTester />)

    await user.type(screen.getByPlaceholderText(/Expresi\u00f3n regular/i), '\\d+')
    await user.type(screen.getByPlaceholderText(/Texto a probar/i), '123')
    await user.click(screen.getByRole('button', { name: /Probar/i }))

    expect(await screen.findByText('Coincide')).toBeInTheDocument()
  })

  it('shows invalid message for bad pattern', async () => {
    const user = userEvent.setup()
    render(<RegexTester />)

    await user.type(screen.getByPlaceholderText(/Expresi\u00f3n regular/i), '(')
    await user.click(screen.getByRole('button', { name: /Probar/i }))

    expect(await screen.findByText('Expresi\u00f3n inv\u00e1lida')).toBeInTheDocument()
  })
})
