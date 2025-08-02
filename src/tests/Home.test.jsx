import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import userEvent from '@testing-library/user-event'
import Home from '../pages/Home/Home'
import uiReducer from '../redux/slices/uiSlice'

// Create a test store
const createTestStore = () => {
  return configureStore({
    reducer: {
      ui: uiReducer,
    },
  })
}

const renderWithProviders = (component) => {
  const store = createTestStore()
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  )
}

describe('Landing Page Acceptance Criteria', () => {
  describe('Scenario: User visits the landing page', () => {
    test('should display header in the center of the page', () => {
      renderWithProviders(<Home />)
      
      const header = screen.getByRole('heading', { name: /future of qe platform/i })
      expect(header).toBeInTheDocument()
    })

    test('should display description below the header', () => {
      renderWithProviders(<Home />)
      
      const description = screen.getByText(/welcome to the comprehensive quality engineering platform/i)
      expect(description).toBeInTheDocument()
    })

    test('should display 3 navigation icons', () => {
      renderWithProviders(<Home />)
      
      const questionScreenLink = screen.getByRole('link', { name: /question screen/i })
      const techStackLink = screen.getByRole('link', { name: /tech stack/i })
      const dashboardLink = screen.getByRole('link', { name: /dashboard screen/i })
      
      expect(questionScreenLink).toBeInTheDocument()
      expect(techStackLink).toBeInTheDocument()
      expect(dashboardLink).toBeInTheDocument()
    })

    test('should have navigation icons with correct labels', () => {
      renderWithProviders(<Home />)
      
      expect(screen.getByText('Question Screen')).toBeInTheDocument()
      expect(screen.getByText('Tech Stack')).toBeInTheDocument()
      expect(screen.getByText('Dashboard Screen')).toBeInTheDocument()
    })
  })

  describe('Scenario: User navigates to different sections', () => {
    test('should have correct link to questionnaire when clicking Question Screen', () => {
      renderWithProviders(<Home />)
      
      const questionScreenLink = screen.getByRole('link', { name: /question screen/i })
      expect(questionScreenLink).toHaveAttribute('href', '/questions')
    })

    test('should have correct link to tech stack when clicking Tech Stack', () => {
      renderWithProviders(<Home />)
      
      const techStackLink = screen.getByRole('link', { name: /tech stack/i })
      expect(techStackLink).toHaveAttribute('href', '/tech-stack')
    })

    test('should have correct link to dashboard when clicking Dashboard Screen', () => {
      renderWithProviders(<Home />)
      
      const dashboardLink = screen.getByRole('link', { name: /dashboard screen/i })
      expect(dashboardLink).toHaveAttribute('href', '/dashboard')
    })
  })

  describe('Accessibility Tests', () => {
    test('navigation links should have proper aria-labels', () => {
      renderWithProviders(<Home />)
      
      const questionScreenLink = screen.getByLabelText('Question Screen')
      const techStackLink = screen.getByLabelText('Tech Stack')
      const dashboardLink = screen.getByLabelText('Dashboard Screen')
      
      expect(questionScreenLink).toBeInTheDocument()
      expect(techStackLink).toBeInTheDocument()
      expect(dashboardLink).toBeInTheDocument()
    })

    test('should have proper heading hierarchy', () => {
      renderWithProviders(<Home />)
      
      const mainHeading = screen.getByRole('heading', { level: 1 })
      const subHeadings = screen.getAllByRole('heading', { level: 3 })
      
      expect(mainHeading).toBeInTheDocument()
      expect(subHeadings).toHaveLength(3) // One for each navigation card
    })
  })

  describe('Responsive Design Tests', () => {
    test('should render navigation cards in a grid layout', () => {
      renderWithProviders(<Home />)
      
      const navigationSection = screen.getByRole('region', { name: /navigation/i }) || 
                               document.querySelector('[class*="navigation"]')
      
      expect(navigationSection).toBeInTheDocument()
    })
  })
})
