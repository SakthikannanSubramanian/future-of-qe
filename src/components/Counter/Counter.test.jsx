import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '../test/test-utils'
import Counter from '../components/Counter/Counter'

describe('Counter Component', () => {
  it('renders with initial count of 0', () => {
    render(<Counter />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('increments count when increment button is clicked', () => {
    render(<Counter />)
    const incrementButton = screen.getByLabelText('Increment value')
    
    fireEvent.click(incrementButton)
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('decrements count when decrement button is clicked', () => {
    render(<Counter />)
    const decrementButton = screen.getByLabelText('Decrement value')
    
    fireEvent.click(decrementButton)
    expect(screen.getByText('-1')).toBeInTheDocument()
  })

  it('resets count when reset button is clicked', () => {
    render(<Counter />)
    const incrementButton = screen.getByLabelText('Increment value')
    const resetButton = screen.getByLabelText('Reset value')
    
    // Increment a few times
    fireEvent.click(incrementButton)
    fireEvent.click(incrementButton)
    expect(screen.getByText('2')).toBeInTheDocument()
    
    // Reset
    fireEvent.click(resetButton)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('adds custom amount when Add Amount button is clicked', () => {
    render(<Counter />)
    const input = screen.getByLabelText('Set increment amount')
    const addButton = screen.getByText('Add Amount')
    
    // Change input value to 5
    fireEvent.change(input, { target: { value: '5' } })
    fireEvent.click(addButton)
    
    expect(screen.getByText('5')).toBeInTheDocument()
  })
})
