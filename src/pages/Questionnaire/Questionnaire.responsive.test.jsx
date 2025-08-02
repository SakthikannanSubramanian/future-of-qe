import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen } from '../../test/test-utils'
import Questionnaire from './Questionnaire'

// Mock window.matchMedia
const mockMatchMedia = (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => {},
})

// Helper function to simulate window resize
const resizeWindow = (width, height) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  })
  window.dispatchEvent(new Event('resize'))
}

describe('Form Responsiveness', () => {
  beforeEach(() => {
    window.matchMedia = mockMatchMedia
    // Set initial window size
    resizeWindow(1024, 768)
  })

  afterEach(() => {
    // Reset to default size
    resizeWindow(1024, 768)
  })

  it('should render form properly on desktop viewport', () => {
    render(<Questionnaire />)
    
    // Check that all form elements are present
    expect(screen.getByLabelText(/project name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/account name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email id/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/manager select/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/edl select/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/pdl/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /go to questions/i })).toBeInTheDocument()
  })

  it('should maintain form usability on tablet viewport', () => {
    resizeWindow(768, 1024)
    render(<Questionnaire />)
    
    const form = screen.getByRole('form')
    expect(form).toBeInTheDocument()
    
    // Check that form inputs are still accessible
    const inputs = screen.getAllByRole('textbox')
    inputs.forEach(input => {
      expect(input).toBeVisible()
    })
    
    const selects = screen.getAllByRole('combobox')
    selects.forEach(select => {
      expect(select).toBeVisible()
    })
    
    const submitButton = screen.getByRole('button', { name: /go to questions/i })
    expect(submitButton).toBeVisible()
  })

  it('should maintain form usability on mobile viewport', () => {
    resizeWindow(375, 667) // iPhone SE size
    render(<Questionnaire />)
    
    const form = screen.getByRole('form')
    expect(form).toBeInTheDocument()
    
    // Check that all form elements are still present and accessible
    expect(screen.getByLabelText(/project name/i)).toBeVisible()
    expect(screen.getByLabelText(/account name/i)).toBeVisible()
    expect(screen.getByLabelText(/email id/i)).toBeVisible()
    expect(screen.getByLabelText(/manager select/i)).toBeVisible()
    expect(screen.getByLabelText(/edl select/i)).toBeVisible()
    expect(screen.getByLabelText(/pdl/i)).toBeVisible()
    
    const submitButton = screen.getByRole('button', { name: /go to questions/i })
    expect(submitButton).toBeVisible()
  })

  it('should maintain form usability on small mobile viewport', () => {
    resizeWindow(320, 568) // Small mobile
    render(<Questionnaire />)
    
    const form = screen.getByRole('form')
    expect(form).toBeInTheDocument()
    
    // Verify all form fields are accessible
    const formElements = [
      screen.getByLabelText(/project name/i),
      screen.getByLabelText(/account name/i),
      screen.getByLabelText(/email id/i),
      screen.getByLabelText(/manager select/i),
      screen.getByLabelText(/edl select/i),
      screen.getByLabelText(/pdl/i),
      screen.getByRole('button', { name: /go to questions/i })
    ]
    
    formElements.forEach(element => {
      expect(element).toBeVisible()
    })
  })

  it('should handle form interactions properly on mobile', () => {
    resizeWindow(375, 667)
    render(<Questionnaire />)
    
    const projectNameInput = screen.getByLabelText(/project name/i)
    expect(projectNameInput).toBeVisible()
    expect(projectNameInput).not.toBeDisabled()
    
    const emailInput = screen.getByLabelText(/email id/i)
    expect(emailInput).toBeVisible()
    expect(emailInput).not.toBeDisabled()
    expect(emailInput).toHaveAttribute('type', 'email')
    
    const submitButton = screen.getByRole('button', { name: /go to questions/i })
    expect(submitButton).toBeVisible()
    expect(submitButton).not.toBeDisabled()
  })

  it('should handle landscape orientation on mobile', () => {
    resizeWindow(667, 375) // Landscape mobile
    render(<Questionnaire />)
    
    const form = screen.getByRole('form')
    expect(form).toBeInTheDocument()
    
    // All form elements should still be usable
    expect(screen.getByLabelText(/project name/i)).toBeVisible()
    expect(screen.getByLabelText(/account name/i)).toBeVisible()
    expect(screen.getByRole('button', { name: /go to questions/i })).toBeVisible()
  })

  it('should maintain proper spacing and layout on different screen sizes', () => {
    // Test different viewport sizes
    const viewports = [
      { width: 1920, height: 1080 }, // Large desktop
      { width: 1366, height: 768 },  // Standard laptop
      { width: 1024, height: 768 },  // Tablet landscape
      { width: 768, height: 1024 },  // Tablet portrait
      { width: 375, height: 667 },   // Mobile
      { width: 320, height: 568 }    // Small mobile
    ]
    
    viewports.forEach(({ width, height }) => {
      resizeWindow(width, height)
      render(<Questionnaire />)
      
      // Check that the form container exists and is properly structured
      const container = screen.getByRole('form').closest('[class*="container"]')
      expect(container).toBeInTheDocument()
      
      // Check that all form groups are present
      const inputs = screen.getAllByRole('textbox')
      expect(inputs.length).toBeGreaterThan(0)
      
      // Cleanup for next iteration
      screen.unmount?.()
    })
  })

  it('should handle window resize events gracefully', () => {
    render(<Questionnaire />)
    
    // Start with desktop size
    resizeWindow(1200, 800)
    expect(screen.getByRole('form')).toBeInTheDocument()
    
    // Resize to tablet
    resizeWindow(768, 1024)
    expect(screen.getByRole('form')).toBeInTheDocument()
    expect(screen.getByLabelText(/project name/i)).toBeVisible()
    
    // Resize to mobile
    resizeWindow(375, 667)
    expect(screen.getByRole('form')).toBeInTheDocument()
    expect(screen.getByLabelText(/project name/i)).toBeVisible()
    
    // Resize back to desktop
    resizeWindow(1200, 800)
    expect(screen.getByRole('form')).toBeInTheDocument()
    expect(screen.getByLabelText(/project name/i)).toBeVisible()
  })
})
