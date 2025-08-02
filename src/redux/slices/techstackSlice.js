import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Async thunk for loading tech stack data
export const loadTechStackData = createAsyncThunk(
  'techstack/loadTechStackData',
  async () => {
    // Simulate API call and return the hardcoded data for now
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const techstackData = [
      {
        "label": "Frontend",
        "id": "frontend",
        "children": [
          {
            "label": "Static Testing",
            "id": "static-testing",
            "children": [
              {
                "label": "TypeScript",
                "id": "typescript",
                "What is it?": "TypeScript is a superset of JavaScript that adds static typing to the language, which helps catch errors early and improve code quality and maintainability.",
                "Case Study": "TypeScript is often used in large-scale JavaScript projects to enhance developer productivity and code quality. It integrates well with modern frameworks like Angular, React, and Vue.",
                "Samples": "   // Example of compiling TypeScript code:\n   tsc --init\n   tsc app.ts\n ",
                "Reference Docs": "https://www.typescriptlang.org/docs/",
                "Comparison": "TypeScript vs. JavaScript: TypeScript offers static typing and advanced tooling which can prevent runtime errors and improve code maintainability, whereas JavaScript is more flexible but lacks built-in type checking."
              },
              {
                "label": "ESLint",
                "id": "eslint",
                "What is it?": "ESLint is a tool for identifying and fixing problems in your JavaScript code, helping you enforce a consistent coding style.",
                "Case Study": "ESLint helps maintain code quality by providing a flexible linting framework that catches common errors and enforces coding standards. It integrates seamlessly with various editors and CI/CD pipelines.",
                "Samples": "\n   module.exports = {\n     env: {\n       browser: true,\n       es2021: true,\n     },\n     extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],\n     parser: '@typescript-eslint/parser',\n     plugins: ['@typescript-eslint'],\n     rules: {\n       'no-unused-vars': 'error',\n       'semi': ['error', 'always'],\n     },\n   };\n ",
                "Reference Docs": "https://eslint.org/",
                "Comparison": "\n   ESLint vs. JSLint:\n   - ESLint is more configurable and extensible compared to JSLint.\n   - ESLint has a more limited feature set compared to JSLint.\n "
              },
              {
                "label": "Storybook",
                "id": "storybook",
                "What is it?": "Storybook is an open-source tool for building UI components and pages in isolation.",
                "Case Study": "Storybook enhances the development workflow by allowing developers to build and test components in isolation. It provides a rich UI and an interactive environment where components can be tested with different states and props.",
                "Samples": "\n   import React from 'react';\n   import { Button } from './Button';\n\n   export default {\n     title: 'Example/Button',\n     component: Button,\n   };\n\n   const Template = (args) => <Button {...args} />;\n\n   export const Primary = Template.bind({});\n   Primary.args = {\n     primary: true,\n     label: 'Button',\n   };\n ",
                "Reference Docs": "https://storybook.js.org/",
                "Comparison": "\n   Storybook vs. Styleguidist:\n   - Storybook provides a more comprehensive and visually appealing interface for documenting and testing components.\n   - Storybook has better support for complex UI scenarios, while Styleguidist is simpler and more focused on documentation.\n "
              }
            ]
          },
          {
            "label": "Unit Testing",
            "id": "unit-testing",
            "children": [
              {
                "label": "React Testing Library",
                "id": "react-testing-library",
                "What is it?": "React Testing Library is a lightweight solution for testing React components, focusing on how users interact with your components.",
                "Case Study": "React Testing Library emphasizes testing components in a way that closely resembles how they are used by end-users. It encourages good testing practices by guiding developers to test user interactions rather than implementation details, making tests more maintainable and reliable.",
                "Samples": "\n   import { render, screen } from '@testing-library/react';\n   import userEvent from '@testing-library/user-event';\n   import '@testing-library/jest-dom';\n   import App from './App';\n\n   test('renders learn react link', () => {\n     render(<App />);\n     const linkElement = screen.getByText(/learn react/i);\n     expect(linkElement).toBeInTheDocument();\n   });\n ",
                "Reference Docs": "https://testing-library.com/docs/react-testing-library/intro/",
                "Comparison": "\n   React Testing Library vs. Enzyme:\n   - React Testing Library promotes testing through the user's perspective, while Enzyme allows for more direct manipulation and inspection of React components.\n   - React Testing Library is simpler and more aligned with React's evolving best practices, whereas Enzyme offers more detailed control over component internals.\n "
              },
              {
                "label": "Jest",
                "id": "jest",
                "What is it?": "Jest is a delightful JavaScript testing framework with a focus on simplicity.",
                "Case Study": "Jest is widely used for testing React applications due to its ease of use, powerful mocking capabilities, and zero-config setup. It integrates well with the React ecosystem and supports features like snapshot testing and code coverage out of the box.",
                "Samples": "\n   test('adds 1 + 2 to equal 3', () => {\n     expect(1 + 2).toBe(3);\n   });\n ",
                "Reference Docs": "https://jestjs.io/",
                "Comparison": "\n   Jest vs. Mocha:\n   - Jest comes with built-in assertions and mocks, while Mocha requires additional libraries for these features.\n   - Jest is more opinionated with a zero-config philosophy, whereas Mocha provides more flexibility.\n "
              }
            ]
          }
        ]
      },
      {
        "label": "Backend",
        "id": "backend",
        "children": [
          {
            "label": "API Testing",
            "id": "api-testing",
            "children": [
              {
                "label": "Postman",
                "id": "postman",
                "What is it?": "Postman is a powerful API development and testing tool that allows developers to create, test, and document APIs efficiently.",
                "Case Study": "Postman streamlines API development workflows by providing a user-friendly interface for sending HTTP requests, organizing them into collections, and automating tests. It's widely used in both development and QA phases to ensure API reliability and performance.",
                "Samples": "\n   // Example Postman test script:\n   pm.test('Status code is 200', function () {\n     pm.response.to.have.status(200);\n   });\n\n   pm.test('Response time is less than 200ms', function () {\n     pm.expect(pm.response.responseTime).to.be.below(200);\n   });\n ",
                "Reference Docs": "https://learning.postman.com/",
                "Comparison": "Postman vs. Insomnia: Postman offers more comprehensive features for team collaboration and enterprise needs, while Insomnia provides a cleaner, more minimalist interface focused on core API testing functionality."
              }
            ]
          }
        ]
      },
      {
        "label": "Mobile",
        "id": "mobile",
        "children": [
          {
            "label": "Native Testing",
            "id": "native-testing",
            "children": [
              {
                "label": "Appium",
                "id": "appium",
                "What is it?": "Appium is an open-source automation framework for testing native, hybrid, and mobile web applications across iOS and Android platforms.",
                "Case Study": "Appium enables cross-platform mobile testing by providing a unified API that works with multiple programming languages and testing frameworks. It's particularly valuable for organizations that need to maintain test suites across different mobile platforms without duplicating effort.",
                "Samples": "\n   // Example Appium test in Java:\n   WebDriver driver = new AndroidDriver(new URL('http://127.0.0.1:4723/wd/hub'), capabilities);\n   driver.findElement(By.id('com.example:id/button')).click();\n   String text = driver.findElement(By.id('com.example:id/text')).getText();\n   Assert.assertEquals('Expected Text', text);\n ",
                "Reference Docs": "http://appium.io/docs/",
                "Comparison": "Appium vs. Espresso/XCUITest: Appium provides cross-platform compatibility but may be slower, while Espresso (Android) and XCUITest (iOS) offer better performance and deeper integration with their respective platforms."
              }
            ]
          }
        ]
      },
      {
        "label": "DevOps",
        "id": "devops",
        "children": [
          {
            "label": "CI/CD",
            "id": "ci-cd",
            "children": [
              {
                "label": "Jenkins",
                "id": "jenkins",
                "What is it?": "Jenkins is an open-source automation server that helps teams build, test, and deploy applications through continuous integration and continuous deployment pipelines.",
                "Case Study": "Jenkins is widely adopted in enterprise environments for its extensive plugin ecosystem and flexibility. It enables teams to automate their entire software delivery process, from code commits to production deployment, while providing detailed reporting and integration with various tools.",
                "Samples": "\n   // Example Jenkinsfile:\n   pipeline {\n     agent any\n     stages {\n       stage('Build') {\n         steps {\n           sh 'npm install'\n           sh 'npm run build'\n         }\n       }\n       stage('Test') {\n         steps {\n           sh 'npm test'\n         }\n       }\n       stage('Deploy') {\n         steps {\n           sh 'npm run deploy'\n         }\n       }\n     }\n   }\n ",
                "Reference Docs": "https://www.jenkins.io/doc/",
                "Comparison": "Jenkins vs. GitHub Actions: Jenkins offers more customization and plugin options but requires more setup and maintenance, while GitHub Actions provides seamless integration with GitHub repositories and easier configuration for most use cases."
              }
            ]
          }
        ]
      }
    ]
    
    return techstackData
  }
)

// Helper function to count total tools in a tech stack
const countToolsInStack = (stack) => {
  let count = 0
  const countRecursive = (items) => {
    items.forEach(item => {
      if (item.children) {
        countRecursive(item.children)
      } else {
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
  const countRecursive = (items) => {
    items.forEach(item => {
      if (item.children) {
        if (item.children.some(child => !child.children)) {
          // This is a category level (has tools as children)
          count++
        }
        countRecursive(item.children)
      }
    })
  }
  if (stack.children) {
    countRecursive(stack.children)
  }
  return count
}

const initialState = {
  data: [],
  selectedStack: null,
  selectedCategory: null,
  selectedTool: null,
  breadcrumb: [],
  loading: false,
  error: null,
  level: 1, // 1 = Tech Stack Selection, 2 = Category Selection, 3 = Tool Selection
}

export const techstackSlice = createSlice({
  name: 'techstack',
  initialState,
  reducers: {
    selectTechStack: (state, action) => {
      const stack = action.payload
      state.selectedStack = stack
      // Reset other selections when selecting a new stack
      state.selectedCategory = null
      state.selectedTool = null
    },
    selectCategory: (state, action) => {
      const category = action.payload
      state.selectedCategory = category
      state.level = 3
      state.breadcrumb = [
        { label: 'Tech Stack Finder', level: 1 },
        { label: state.selectedStack.label, level: 2 },
        { label: category.label, level: 3 }
      ]
    },
    selectTool: (state, action) => {
      state.selectedTool = action.payload
    },
    navigateToBreadcrumb: (state, action) => {
      const targetLevel = action.payload
      state.level = targetLevel
      state.breadcrumb = state.breadcrumb.slice(0, targetLevel)
      
      if (targetLevel === 1) {
        state.selectedStack = null
        state.selectedCategory = null
        state.selectedTool = null
      } else if (targetLevel === 2) {
        state.selectedCategory = null
        state.selectedTool = null
      } else if (targetLevel === 3) {
        state.selectedTool = null
      }
    },
    resetTechStack: (state) => {
      state.selectedStack = null
      state.selectedCategory = null
      state.selectedTool = null
      state.breadcrumb = []
      state.level = 1
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
  navigateToBreadcrumb,
  resetTechStack
} = techstackSlice.actions

// Selectors
export const selectTechStackData = (state) => state.techstack.data
export const selectSelectedStack = (state) => state.techstack.selectedStack
export const selectSelectedCategory = (state) => state.techstack.selectedCategory
export const selectSelectedTool = (state) => state.techstack.selectedTool
export const selectBreadcrumb = (state) => state.techstack.breadcrumb
export const selectCurrentLevel = (state) => state.techstack.level
export const selectTechStackLoading = (state) => state.techstack.loading
export const selectTechStackError = (state) => state.techstack.error

export default techstackSlice.reducer
