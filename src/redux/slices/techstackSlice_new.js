import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Async thunk for loading tech stack data
export const loadTechStackData = createAsyncThunk(
  'techstack/loadTechStackData',
  async () => {
    // Simulate API call with loading delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    try {
      // Import the data dynamically
      const techstackData = await import('../../data/techstack-sample.json')
      return techstackData.default || techstackData
    } catch (error) {
      console.error('Failed to load tech stack data:', error)
      throw new Error('Failed to load tech stack data')
    }
  }
)
      const techstackData = [
        {
          "label": "Frontend",
          "id": "frontend",
          "description": "Modern web development tools and frameworks for building responsive, interactive user interfaces",
          "children": [
            {
              "label": "Static Testing",
              "id": "static-testing",
              "description": "Code analysis tools that catch errors before runtime",
              "type": "Static",
              "color": "#3B82F6",
              "children": [
                {
                  "label": "TypeScript",
                  "id": "typescript",
                  "icon": "📘",
                  "platforms": ["web", "node"],
                  "complexity": 2,
                  "popular": true,
                  "license": "Apache-2.0",
                  "What is it?": "TypeScript is a superset of JavaScript that adds static typing to the language, which helps catch errors early and improve code quality and maintainability.",
                  "Case Study": "TypeScript is often used in large-scale JavaScript projects to enhance developer productivity and code quality. It integrates well with modern frameworks like Angular, React, and Vue.",
                  "Samples": "// Example of compiling TypeScript code:\ntsc --init\ntsc app.ts",
                  "Reference Docs": "https://www.typescriptlang.org/docs/",
                  "Comparison": "TypeScript vs. JavaScript: TypeScript offers static typing and advanced tooling which can prevent runtime errors and improve code maintainability, whereas JavaScript is more flexible but lacks built-in type checking.",
                  "Install Command": "npm install -g typescript"
                },
                {
                  "label": "ESLint",
                  "id": "eslint",
                  "icon": "🔍",
                  "platforms": ["web", "node"],
                  "complexity": 1,
                  "popular": true,
                  "license": "MIT",
                  "What is it?": "ESLint is a tool for identifying and fixing problems in your JavaScript code, helping you enforce a consistent coding style.",
                  "Case Study": "ESLint helps maintain code quality by providing a flexible linting framework that catches common errors and enforces coding standards. It integrates seamlessly with various editors and CI/CD pipelines.",
                  "Samples": "module.exports = {\n  env: {\n    browser: true,\n    es2021: true,\n  },\n  extends: ['eslint:recommended'],\n  rules: {\n    'no-unused-vars': 'error',\n    'semi': ['error', 'always'],\n  },\n};",
                  "Reference Docs": "https://eslint.org/",
                  "Comparison": "ESLint vs. JSLint: ESLint is more configurable and extensible compared to JSLint. ESLint supports modern JavaScript syntax, while JSLint has a more limited feature set.",
                  "Install Command": "npm install eslint --save-dev"
                }
              ]
            },
            {
              "label": "Unit Testing",
              "id": "unit-testing",
              "description": "Test individual components and functions in isolation",
              "type": "Unit",
              "color": "#10B981",
              "children": [
                {
                  "label": "Jest",
                  "id": "jest",
                  "icon": "🃏",
                  "platforms": ["web", "node"],
                  "complexity": 1,
                  "popular": true,
                  "license": "MIT",
                  "What is it?": "Jest is a delightful JavaScript testing framework with a focus on simplicity.",
                  "Case Study": "Jest is widely used for testing React applications due to its ease of use, powerful mocking capabilities, and zero-config setup. It integrates well with the React ecosystem and supports features like snapshot testing and code coverage out of the box.",
                  "Samples": "test('adds 1 + 2 to equal 3', () => {\n  expect(1 + 2).toBe(3);\n});",
                  "Reference Docs": "https://jestjs.io/",
                  "Comparison": "Jest vs. Mocha: Jest comes with built-in assertions and mocks, while Mocha requires additional libraries for these features. Jest is more opinionated with a zero-config philosophy, whereas Mocha provides more flexibility.",
                  "Install Command": "npm install --save-dev jest"
                },
                {
                  "label": "React Testing Library",
                  "id": "react-testing-library",
                  "icon": "🧪",
                  "platforms": ["web"],
                  "complexity": 2,
                  "popular": true,
                  "license": "MIT",
                  "What is it?": "React Testing Library is a lightweight solution for testing React components, focusing on how users interact with your components.",
                  "Case Study": "React Testing Library emphasizes testing components in a way that closely resembles how they are used by end-users. It encourages good testing practices by guiding developers to test user interactions rather than implementation details, making tests more maintainable and reliable.",
                  "Samples": "import { render, screen } from '@testing-library/react';\nimport userEvent from '@testing-library/user-event';\nimport '@testing-library/jest-dom';\nimport App from './App';\n\ntest('renders learn react link', () => {\n  render(<App />);\n  const linkElement = screen.getByText(/learn react/i);\n  expect(linkElement).toBeInTheDocument();\n});",
                  "Reference Docs": "https://testing-library.com/docs/react-testing-library/intro/",
                  "Comparison": "React Testing Library vs. Enzyme: React Testing Library promotes testing through the user's perspective, while Enzyme allows for more direct manipulation and inspection of React components. React Testing Library is simpler and more aligned with React's evolving best practices, whereas Enzyme offers more detailed control over component internals.",
                  "Install Command": "npm install --save-dev @testing-library/react @testing-library/jest-dom"
                }
              ]
            },
            {
              "label": "Functional Testing",
              "id": "functional-testing",
              "description": "End-to-end testing of complete user workflows",
              "type": "E2E",
              "color": "#8B5CF6",
              "children": [
                {
                  "label": "Cypress",
                  "id": "cypress",
                  "icon": "🌲",
                  "platforms": ["web"],
                  "complexity": 2,
                  "popular": true,
                  "license": "MIT",
                  "What is it?": "Cypress is a fast, easy, and reliable testing framework for anything that runs in a browser.",
                  "Case Study": "Cypress excels at end-to-end testing, particularly for modern web applications. It offers real-time reloads, automatic waiting, and a powerful interactive test runner, making it a popular choice for testing user flows and interactions.",
                  "Samples": "describe('My First Test', () => {\n  it('Does not do much!', () => {\n    cy.visit('https://example.cypress.io');\n    cy.contains('type').click();\n    cy.url().should('include', '/commands/actions');\n  });\n});",
                  "Reference Docs": "https://docs.cypress.io/",
                  "Comparison": "Cypress vs. Selenium: Cypress is built specifically for modern web applications and runs directly in the browser, offering a fast and developer-friendly experience. Selenium is more versatile and supports testing across multiple browsers and devices, making it better suited for cross-browser testing.",
                  "Install Command": "npm install --save-dev cypress"
                },
                {
                  "label": "Playwright",
                  "id": "playwright",
                  "icon": "🎭",
                  "platforms": ["web"],
                  "complexity": 2,
                  "popular": true,
                  "license": "Apache-2.0",
                  "What is it?": "Playwright is an end-to-end testing framework that allows testing across multiple browsers, including Chromium, Firefox, and WebKit.",
                  "Case Study": "Playwright stands out for its ability to automate testing across different browser engines with a single API. It supports features like auto-waiting, capturing screenshots, and tracing test execution, which helps in creating reliable and comprehensive tests.",
                  "Samples": "const { test, expect } = require('@playwright/test');\n\ntest('has title', async ({ page }) => {\n  await page.goto('https://playwright.dev/');\n  await expect(page).toHaveTitle(/Playwright/);\n});",
                  "Reference Docs": "https://playwright.dev/",
                  "Comparison": "Playwright vs. Puppeteer: Playwright supports multiple browsers (Chromium, Firefox, WebKit), while Puppeteer is focused on Chromium. Playwright provides more advanced features like context isolation and network interception.",
                  "Install Command": "npm init playwright@latest"
                }
              ]
            }
          ]
        },
        {
          "label": "Backend",
          "id": "backend",
          "description": "Server-side testing tools for APIs, databases, and microservices",
          "children": [
            {
              "label": "API Testing",
              "id": "api-testing",
              "description": "Tools for testing REST APIs, GraphQL, and web services",
              "type": "API",
              "color": "#F59E0B",
              "children": [
                {
                  "label": "Postman",
                  "id": "postman",
                  "icon": "📮",
                  "platforms": ["web", "desktop"],
                  "complexity": 1,
                  "popular": true,
                  "license": "Proprietary",
                  "What is it?": "Postman is a powerful API development and testing tool that allows developers to create, test, and document APIs efficiently.",
                  "Case Study": "Postman streamlines API development workflows by providing a user-friendly interface for sending HTTP requests, organizing them into collections, and automating tests. It's widely used in both development and QA phases to ensure API reliability and performance.",
                  "Samples": "pm.test('Status code is 200', function () {\n  pm.response.to.have.status(200);\n});\n\npm.test('Response time is less than 200ms', function () {\n  pm.expect(pm.response.responseTime).to.be.below(200);\n});",
                  "Reference Docs": "https://learning.postman.com/",
                  "Comparison": "Postman vs. Insomnia: Postman offers more comprehensive features for team collaboration and enterprise needs, while Insomnia provides a cleaner, more minimalist interface focused on core API testing functionality.",
                  "Install Command": "Download from https://www.postman.com/downloads/"
                }
              ]
            }
          ]
        },
        {
          "label": "Mobile",
          "id": "mobile",
          "description": "Testing tools for iOS, Android, and cross-platform mobile applications",
          "children": [
            {
              "label": "Native Testing",
              "id": "native-testing",
              "description": "Native mobile app testing frameworks and tools",
              "type": "Mobile",
              "color": "#EF4444",
              "children": [
                {
                  "label": "Appium",
                  "id": "appium",
                  "icon": "📱",
                  "platforms": ["ios", "android"],
                  "complexity": 3,
                  "popular": true,
                  "license": "Apache-2.0",
                  "What is it?": "Appium is an open-source automation framework for testing native, hybrid, and mobile web applications across iOS and Android platforms.",
                  "Case Study": "Appium enables cross-platform mobile testing by providing a unified API that works with multiple programming languages and testing frameworks. It's particularly valuable for organizations that need to maintain test suites across different mobile platforms without duplicating effort.",
                  "Samples": "// Example Appium test in Java:\nWebDriver driver = new AndroidDriver(new URL('http://127.0.0.1:4723/wd/hub'), capabilities);\ndriver.findElement(By.id('com.example:id/button')).click();\nString text = driver.findElement(By.id('com.example:id/text')).getText();\nAssert.assertEquals('Expected Text', text);",
                  "Reference Docs": "http://appium.io/docs/",
                  "Comparison": "Appium vs. Espresso/XCUITest: Appium provides cross-platform compatibility but may be slower, while Espresso (Android) and XCUITest (iOS) offer better performance and deeper integration with their respective platforms.",
                  "Install Command": "npm install -g appium"
                }
              ]
            }
          ]
        },
        {
          "label": "DevOps",
          "id": "devops",
          "description": "CI/CD, automation, and infrastructure testing tools",
          "children": [
            {
              "label": "CI/CD",
              "id": "ci-cd",
              "description": "Continuous integration and deployment testing tools",
              "type": "CI/CD",
              "color": "#6366F1",
              "children": [
                {
                  "label": "Jenkins",
                  "id": "jenkins",
                  "icon": "🏗️",
                  "platforms": ["web", "server"],
                  "complexity": 3,
                  "popular": true,
                  "license": "MIT",
                  "What is it?": "Jenkins is an open-source automation server that helps teams build, test, and deploy applications through continuous integration and continuous deployment pipelines.",
                  "Case Study": "Jenkins is widely adopted in enterprise environments for its extensive plugin ecosystem and flexibility. It enables teams to automate their entire software delivery process, from code commits to production deployment, while providing detailed reporting and integration with various tools.",
                  "Samples": "pipeline {\n  agent any\n  stages {\n    stage('Build') {\n      steps {\n        sh 'npm install'\n        sh 'npm run build'\n      }\n    }\n    stage('Test') {\n      steps {\n        sh 'npm test'\n      }\n    }\n    stage('Deploy') {\n      steps {\n        sh 'npm run deploy'\n      }\n    }\n  }\n}",
                  "Reference Docs": "https://www.jenkins.io/doc/",
                  "Comparison": "Jenkins vs. GitHub Actions: Jenkins offers more customization and plugin options but requires more setup and maintenance, while GitHub Actions provides seamless integration with GitHub repositories and easier configuration for most use cases.",
                  "Install Command": "Download from https://www.jenkins.io/download/"
                }
              ]
            }
          ]
        }
      ]
      return techstackData
    }
    
    const data = await response.json()
    return data
  }
)

// Helper function to count total tools in a tech stack
const countToolsInStack = (stack) => {
  let count = 0
  const countRecursive = (items) => {
    items.forEach(item => {
      if (item.children && item.children.length > 0) {
        countRecursive(item.children)
      } else if (item.label && item.icon) {
        // This is a tool (has icon and label but no children)
        count++
      }
    })
  }
  if (stack.children) {
    countRecursive(stack.children)
  }
  return count
}

// Helper function to count categories in a tech stack
const countCategoriesInStack = (stack) => {
  let count = 0
  if (stack.children) {
    stack.children.forEach(category => {
      if (category.children && category.children.length > 0) {
        count++
      }
    })
  }
  return count
}

const initialState = {
  data: [],
  selectedStack: null,
  selectedCategory: null,
  selectedTool: null,
  selectedTools: [], // For multi-select comparison
  view: 'stacks', // 'stacks' | 'categories' | 'tools' | 'detail'
  loading: false,
  error: null,
  navigationHistory: [], // Track navigation for back button
}

export const techstackSlice = createSlice({
  name: 'techstack',
  initialState,
  reducers: {
    selectTechStack: (state, action) => {
      const stack = action.payload
      state.selectedStack = stack
      state.selectedCategory = null
      state.selectedTool = null
      state.view = 'categories'
      state.navigationHistory.push({
        view: 'stacks',
        label: 'Tech Stacks'
      })
    },
    selectCategory: (state, action) => {
      const category = action.payload
      state.selectedCategory = category
      state.selectedTool = null
      state.view = 'tools'
      state.navigationHistory.push({
        view: 'categories',
        label: state.selectedStack.label,
        data: state.selectedStack
      })
    },
    selectTool: (state, action) => {
      const tool = action.payload
      state.selectedTool = tool
      state.view = 'detail'
      state.navigationHistory.push({
        view: 'tools',
        label: state.selectedCategory.label,
        data: state.selectedCategory
      })
    },
    toggleToolSelection: (state, action) => {
      const tool = action.payload
      const index = state.selectedTools.findIndex(t => t.id === tool.id)
      if (index >= 0) {
        state.selectedTools.splice(index, 1)
      } else {
        state.selectedTools.push(tool)
      }
    },
    clearToolSelection: (state) => {
      state.selectedTools = []
    },
    navigateBack: (state) => {
      if (state.navigationHistory.length > 0) {
        const previous = state.navigationHistory.pop()
        state.view = previous.view
        
        if (previous.view === 'stacks') {
          state.selectedStack = null
          state.selectedCategory = null
          state.selectedTool = null
        } else if (previous.view === 'categories') {
          state.selectedStack = previous.data
          state.selectedCategory = null
          state.selectedTool = null
        } else if (previous.view === 'tools') {
          state.selectedCategory = previous.data
          state.selectedTool = null
        }
      }
    },
    resetTechStack: (state) => {
      state.selectedStack = null
      state.selectedCategory = null
      state.selectedTool = null
      state.selectedTools = []
      state.view = 'stacks'
      state.navigationHistory = []
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTechStackData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadTechStackData.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload.map(stack => ({
          ...stack,
          toolCount: countToolsInStack(stack),
          categoryCount: countCategoriesInStack(stack)
        }))
        state.error = null
      })
      .addCase(loadTechStackData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  }
})

export const {
  selectTechStack,
  selectCategory,
  selectTool,
  toggleToolSelection,
  clearToolSelection,
  navigateBack,
  resetTechStack
} = techstackSlice.actions

// Selectors
export const selectTechStackData = (state) => state.techstack.data
export const selectSelectedStack = (state) => state.techstack.selectedStack
export const selectSelectedCategory = (state) => state.techstack.selectedCategory
export const selectSelectedTool = (state) => state.techstack.selectedTool
export const selectSelectedTools = (state) => state.techstack.selectedTools
export const selectCurrentView = (state) => state.techstack.view
export const selectNavigationHistory = (state) => state.techstack.navigationHistory
export const selectTechStackLoading = (state) => state.techstack.loading
export const selectTechStackError = (state) => state.techstack.error

export default techstackSlice.reducer
