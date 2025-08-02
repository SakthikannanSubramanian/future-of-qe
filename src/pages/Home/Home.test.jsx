import { describe, it, expect } from 'vitest'
import { render, screen } from '../test/test-utils'
import Home from '../pages/Home/Home'

describe('Home Page', () => {
  it('renders welcome message', () => {
    render(<Home />)
    expect(screen.getByText('Welcome to the Future of QE')).toBeInTheDocument()
  })

  it('renders feature cards', () => {
    render(<Home />)
    expect(screen.getByText('Lightning Fast')).toBeInTheDocument()
    expect(screen.getByText('Easy to Use')).toBeInTheDocument()
    expect(screen.getByText('Analytics')).toBeInTheDocument()
  })

  it('renders navigation buttons', () => {
    render(<Home />)
    expect(screen.getByText('Learn More')).toBeInTheDocument()
    expect(screen.getByText('Get Started')).toBeInTheDocument()
  })

  it('renders counter component', () => {
    render(<Home />)
    // Check if the counter component is rendered (it shows initial value of 0)
    expect(screen.getByText('0')).toBeInTheDocument()
  })
})
