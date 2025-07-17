import { render, screen } from '@testing-library/react'
import Navbar from '../components/Navbar'
import { useSession } from 'next-auth/react'
import userEvent from '@testing-library/user-event'

jest.mock('next-auth/react')

describe('Navbar', () => {
  it('shows sign in button when no session', () => {
    ;(useSession as jest.Mock).mockReturnValue({ data: null })
    render(<Navbar />)
    expect(screen.getByText('Sign in')).toBeInTheDocument()
  })

  it('shows sign out when session present', async () => {
    const user = userEvent.setup()
    const signOut = jest.fn()
    ;(useSession as jest.Mock).mockReturnValue({ data: { user: { name: 'Ana' } } })
    jest.spyOn(require('next-auth/react'), 'signOut').mockImplementation(signOut)
    render(<Navbar />)
    await user.click(screen.getByText('Sign out'))
    expect(signOut).toHaveBeenCalled()
  })
})
