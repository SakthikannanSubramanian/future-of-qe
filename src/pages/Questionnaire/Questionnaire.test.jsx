import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../test/test-utils'
import userEvent from '@testing-library/user-event'
import Questionnaire from '../pages/Questionnaire/Questionnaire'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('Project Details Form - Acceptance Criteria', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  describe('Scenario: Display project details form', () => {
    it('should display form with all required fields when page loads', () => {
      render(<Questionnaire />)

      // Check if form fields are present
      expect(screen.getByLabelText(/project name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/account name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email id of the project rep/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/manager select/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/edl select/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/pdl/i)).toBeInTheDocument()

      // Check field types
      expect(screen.getByLabelText(/project name/i)).toHaveAttribute('type', 'text')
      expect(screen.getByLabelText(/account name/i)).toHaveAttribute('type', 'text')
      expect(screen.getByLabelText(/email id of the project rep/i)).toHaveAttribute('type', 'email')
      expect(screen.getByLabelText(/pdl/i)).toHaveAttribute('type', 'text')

      // Check dropdowns
      expect(screen.getByLabelText(/manager select/i).tagName).toBe('SELECT')
      expect(screen.getByLabelText(/edl select/i).tagName).toBe('SELECT')

      // Check submit button
      expect(screen.getByRole('button', { name: /go to questions/i })).toBeInTheDocument()
    })

    it('should have correct dropdown options', () => {
      render(<Questionnaire />)

      const managerSelect = screen.getByLabelText(/manager select/i)
      expect(managerSelect).toHaveTextContent('Select Manager')
      expect(managerSelect).toHaveTextContent('John Smith')
      expect(managerSelect).toHaveTextContent('Jane Doe')

      const edlSelect = screen.getByLabelText(/edl select/i)
      expect(edlSelect).toHaveTextContent('Select EDL')
      expect(edlSelect).toHaveTextContent('Engineering Lead 1')
      expect(edlSelect).toHaveTextContent('Engineering Lead 2')
    })
  })

  describe('Scenario: Validate required fields', () => {
    it('should show validation errors when submitting without required fields', async () => {
      const user = userEvent.setup()
      render(<Questionnaire />)

      const submitButton = screen.getByRole('button', { name: /go to questions/i })
      await user.click(submitButton)

      // Wait for validation errors to appear
      await waitFor(() => {
        expect(screen.getByText(/project name is required/i)).toBeInTheDocument()
        expect(screen.getByText(/account name is required/i)).toBeInTheDocument()
        expect(screen.getByText(/email id is required/i)).toBeInTheDocument()
        expect(screen.getByText(/manager selection is required/i)).toBeInTheDocument()
        expect(screen.getByText(/edl selection is required/i)).toBeInTheDocument()
        expect(screen.getByText(/pdl is required/i)).toBeInTheDocument()
      })

      // Verify form did not submit (navigation was not called)
      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it('should show validation errors on field blur', async () => {
      const user = userEvent.setup()
      render(<Questionnaire />)

      const projectNameInput = screen.getByLabelText(/project name/i)
      
      // Focus and blur without entering data
      await user.click(projectNameInput)
      await user.tab()

      await waitFor(() => {
        expect(screen.getByText(/project name is required/i)).toBeInTheDocument()
      })
    })

    it('should clear validation errors when user starts typing', async () => {
      const user = userEvent.setup()
      render(<Questionnaire />)

      const projectNameInput = screen.getByLabelText(/project name/i)
      
      // Trigger validation error first
      await user.click(projectNameInput)
      await user.tab()
      
      await waitFor(() => {
        expect(screen.getByText(/project name is required/i)).toBeInTheDocument()
      })

      // Start typing to clear error
      await user.click(projectNameInput)
      await user.type(projectNameInput, 'Test Project')

      await waitFor(() => {
        expect(screen.queryByText(/project name is required/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('Scenario: Validate email format', () => {
    it('should show email validation error for invalid email format', async () => {
      const user = userEvent.setup()
      render(<Questionnaire />)

      const emailInput = screen.getByLabelText(/email id of the project rep/i)
      const submitButton = screen.getByRole('button', { name: /go to questions/i })

      await user.type(emailInput, 'invalid-email')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
      })

      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it('should accept valid email format', async () => {
      const user = userEvent.setup()
      render(<Questionnaire />)

      const emailInput = screen.getByLabelText(/email id of the project rep/i)

      await user.type(emailInput, 'test@example.com')
      await user.tab()

      // Should not show email validation error
      expect(screen.queryByText(/please enter a valid email address/i)).not.toBeInTheDocument()
    })
  })

  describe('Scenario: Successfully submit project details', () => {
    it('should save project details and redirect when form is valid', async () => {
      const user = userEvent.setup()
      render(<Questionnaire />)

      // Fill in all required fields
      await user.type(screen.getByLabelText(/project name/i), 'Test Project')
      await user.type(screen.getByLabelText(/account name/i), 'Test Account')
      await user.type(screen.getByLabelText(/email id of the project rep/i), 'test@example.com')
      await user.selectOptions(screen.getByLabelText(/manager select/i), 'john-smith')
      await user.selectOptions(screen.getByLabelText(/edl select/i), 'engineering-lead-1')
      await user.type(screen.getByLabelText(/pdl/i), 'Test PDL')

      const submitButton = screen.getByRole('button', { name: /go to questions/i })
      await user.click(submitButton)

      // Wait for form submission
      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'projectDetails',
          JSON.stringify({
            projectName: 'Test Project',
            accountName: 'Test Account',
            emailId: 'test@example.com',
            managerSelect: 'john-smith',
            edlSelect: 'engineering-lead-1',
            pdl: 'Test PDL'
          })
        )
      })

      // Should redirect to next page
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/about')
      })
    })

    it('should show loading state during submission', async () => {
      const user = userEvent.setup()
      render(<Questionnaire />)

      // Fill in all required fields
      await user.type(screen.getByLabelText(/project name/i), 'Test Project')
      await user.type(screen.getByLabelText(/account name/i), 'Test Account')
      await user.type(screen.getByLabelText(/email id of the project rep/i), 'test@example.com')
      await user.selectOptions(screen.getByLabelText(/manager select/i), 'john-smith')
      await user.selectOptions(screen.getByLabelText(/edl select/i), 'engineering-lead-1')
      await user.type(screen.getByLabelText(/pdl/i), 'Test PDL')

      const submitButton = screen.getByRole('button', { name: /go to questions/i })
      await user.click(submitButton)

      // Should show loading state
      expect(screen.getByText(/saving.../i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /saving.../i })).toBeDisabled()
    })
  })

  describe('Form accessibility', () => {
    it('should have proper ARIA labels and error associations', async () => {
      const user = userEvent.setup()
      render(<Questionnaire />)

      const submitButton = screen.getByRole('button', { name: /go to questions/i })
      await user.click(submitButton)

      await waitFor(() => {
        const projectNameInput = screen.getByLabelText(/project name/i)
        const errorMessage = screen.getByText(/project name is required/i)
        
        expect(errorMessage).toHaveAttribute('role', 'alert')
        expect(projectNameInput).toHaveAttribute('aria-describedby', 'projectName-error')
      })
    })
  })
})
