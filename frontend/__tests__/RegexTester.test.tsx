import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RegexTester from '../components/RegexTester'

describe('RegexTester', () => {
  it('shows match result for valid regex', async () => {
    const user = userEvent.setup()
    render(<RegexTester />)

    await user.type(screen.getByPlaceholderText(/Regular expression/i), '\\d+')
    await user.type(screen.getByPlaceholderText(/Text to test/i), '123')
    await user.click(screen.getByRole('button', { name: /Test/i }))

    expect(await screen.findByText('Matches')).toBeInTheDocument()
  })

  it('shows invalid message for bad pattern', async () => {
    const user = userEvent.setup()
    render(<RegexTester />)

    await user.type(screen.getByPlaceholderText(/Regular expression/i), '(')
    await user.click(screen.getByRole('button', { name: /Test/i }))

    expect(await screen.findByText('Invalid expression')).toBeInTheDocument()
  })
})
