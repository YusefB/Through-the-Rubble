import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock next/navigation router used by the page.
const pushMock = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))

// Mock the supabase browser client. We expose hoisted spies so each test can
// configure return values without re-mocking.
const signInWithPasswordMock = vi.fn()
const signInWithOtpMock = vi.fn()
vi.mock('@/lib/supabase/client', () => ({
  createSupabaseBrowserClient: () => ({
    auth: {
      signInWithPassword: signInWithPasswordMock,
      signInWithOtp: signInWithOtpMock,
    },
  }),
}))

// Importing after the mocks so the page sees the mocked module.
import LoginPage from './page'

describe('LoginPage', () => {
  beforeEach(() => {
    pushMock.mockReset()
    signInWithPasswordMock.mockReset()
    signInWithOtpMock.mockReset()
  })

  it('renders email and password fields plus a sign-in button', () => {
    render(<LoginPage />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /sign in/i }),
    ).toBeInTheDocument()
  })

  it('shows the magic-link toggle and hides the password field when toggled', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)

    const toggle = screen.getByRole('button', { name: /magic link\?/i })
    expect(toggle).toBeInTheDocument()

    await user.click(toggle)

    // Password field should now be hidden in magic-link mode.
    expect(screen.queryByLabelText(/password/i)).not.toBeInTheDocument()
    // Submit button text changes.
    expect(
      screen.getByRole('button', { name: /send magic link/i }),
    ).toBeInTheDocument()
    // Toggle label flips.
    expect(
      screen.getByRole('button', { name: /use password instead/i }),
    ).toBeInTheDocument()
  })

  it('calls signInWithPassword and pushes /admin on success', async () => {
    signInWithPasswordMock.mockResolvedValueOnce({ error: null })

    const user = userEvent.setup()
    render(<LoginPage />)

    await user.type(screen.getByLabelText(/email/i), 'admin@example.com')
    await user.type(screen.getByLabelText(/password/i), 'hunter2hunter2')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(signInWithPasswordMock).toHaveBeenCalledWith({
        email: 'admin@example.com',
        password: 'hunter2hunter2',
      })
    })
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/admin')
    })
  })

  it('displays the error message when password sign-in fails', async () => {
    signInWithPasswordMock.mockResolvedValueOnce({
      error: { message: 'Invalid login credentials' },
    })

    const user = userEvent.setup()
    render(<LoginPage />)

    await user.type(screen.getByLabelText(/email/i), 'admin@example.com')
    await user.type(screen.getByLabelText(/password/i), 'wrong-password')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(
      await screen.findByRole('alert'),
    ).toHaveTextContent(/invalid login credentials/i)
    expect(pushMock).not.toHaveBeenCalled()
  })

  it('sends a magic link and shows "Check your email" on success', async () => {
    signInWithOtpMock.mockResolvedValueOnce({ error: null })

    const user = userEvent.setup()
    render(<LoginPage />)

    // Switch to magic link mode.
    await user.click(screen.getByRole('button', { name: /magic link\?/i }))

    await user.type(screen.getByLabelText(/email/i), 'admin@example.com')
    await user.click(screen.getByRole('button', { name: /send magic link/i }))

    await waitFor(() => {
      expect(signInWithOtpMock).toHaveBeenCalledWith({
        email: 'admin@example.com',
      })
    })

    expect(await screen.findByRole('status')).toHaveTextContent(
      /check your email/i,
    )
    // Password sign-in should not have been attempted.
    expect(signInWithPasswordMock).not.toHaveBeenCalled()
  })
})
