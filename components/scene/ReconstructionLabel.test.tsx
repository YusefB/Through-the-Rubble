import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReconstructionLabel } from './ReconstructionLabel'

describe('ReconstructionLabel', () => {
  it('renders the short text when collapsed', () => {
    render(<ReconstructionLabel label="Based on archival imagery" />)
    expect(screen.getByText('Visual reconstruction')).toBeInTheDocument()
  })

  it('expands the description on click', async () => {
    const user = userEvent.setup()
    render(<ReconstructionLabel label="Based on archival imagery from UN OCHA, 2019" />)
    const button = screen.getByRole('button', { name: /reconstruction/i })
    expect(screen.queryByText(/Based on archival imagery/)).not.toBeVisible()
    await user.click(button)
    expect(screen.getByText(/Based on archival imagery/)).toBeVisible()
  })

  it('has role=note and aria-label', () => {
    render(<ReconstructionLabel label="x" />)
    const note = screen.getByRole('note', { name: /Visual reconstruction/i })
    expect(note).toBeInTheDocument()
  })

  it('toggles collapsed/expanded with keyboard', async () => {
    const user = userEvent.setup()
    render(<ReconstructionLabel label="Detailed source note" />)
    const button = screen.getByRole('button', { name: /reconstruction/i })
    button.focus()
    await user.keyboard('{Enter}')
    expect(screen.getByText('Detailed source note')).toBeVisible()
    await user.keyboard('{Enter}')
    expect(screen.queryByText('Detailed source note')).not.toBeVisible()
  })
})
