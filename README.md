# Future of QE - React Website

A modern, responsive React website built with Redux, JavaScript, CSS Modules, and comprehensive testing setup using React Testing Library.

## 🚀 Features

- **Modern React**: Built with React 18 and functional components
- **State Management**: Redux Toolkit for efficient state management
- **Responsive Design**: Mobile-first, fully responsive layout
- **CSS Modules**: Scoped styling for better maintainability
- **Testing**: Comprehensive unit testing with React Testing Library and Vitest
- **Routing**: React Router for client-side navigation
- **Theme Support**: Dark/Light theme toggle
- **Performance**: Optimized with Vite for fast development and builds

## 🛠️ Tech Stack

- **Frontend**: React 18, JavaScript (ES6+)
- **State Management**: Redux Toolkit
- **Styling**: CSS Modules, Responsive CSS
- **Build Tool**: Vite
- **Testing**: Vitest, React Testing Library, @testing-library/jest-dom
- **Routing**: React Router DOM
- **Linting**: ESLint with React plugins
- **Formatting**: Prettier

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Counter/
│   │   ├── Counter.jsx
│   │   ├── Counter.module.css
│   │   └── Counter.test.jsx
│   └── Header/
│       ├── Header.jsx
│       └── Header.module.css
├── pages/               # Page components
│   ├── Home/
│   ├── About/
│   ├── Contact/
│   ├── Dashboard/
│   ├── Login/
│   └── NotFound/
├── redux/               # Redux store and slices
│   ├── slices/
│   │   ├── counterSlice.js
│   │   ├── userSlice.js
│   │   └── uiSlice.js
│   └── store.js
├── test/                # Testing utilities
│   ├── setup.js
│   └── test-utils.jsx
├── App.jsx              # Main App component
├── App.module.css       # App styles
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd future-of-qe
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:3000`

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier

## 🧪 Testing

The project includes comprehensive testing setup with:

- **Vitest**: Fast unit test runner
- **React Testing Library**: Testing utilities for React components
- **@testing-library/jest-dom**: Custom Jest matchers

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Test Examples

- Component testing with user interactions
- Redux slice testing
- Integration testing with React Router
- Custom render function with Redux Provider

## 🎨 Styling

The project uses **CSS Modules** for styling, providing:

- **Scoped CSS**: Styles are automatically scoped to components
- **Responsive Design**: Mobile-first approach with breakpoints
- **Theme Support**: CSS custom properties for theming
- **Utility Classes**: Common utility classes in global CSS

### CSS Module Example

```jsx
import styles from './Component.module.css'

const Component = () => (
  <div className={styles.container}>
    <h1 className={styles.title}>Hello World</h1>
  </div>
)
```

## 🗂️ State Management

Redux Toolkit is used for state management with:

- **Slices**: Feature-based state organization
- **Async Thunks**: For handling async operations
- **Selectors**: For accessing state efficiently
- **TypeScript Support**: Ready for TypeScript migration

### Redux Structure

- `counterSlice.js` - Counter functionality
- `userSlice.js` - User authentication and profile
- `uiSlice.js` - UI state (theme, notifications, etc.)

## 📱 Responsive Design

The website is fully responsive with:

- **Mobile-first**: Designed for mobile devices first
- **Breakpoints**: 
  - Mobile: < 480px
  - Tablet: 481px - 768px
  - Desktop: > 768px
- **Flexible Layouts**: CSS Grid and Flexbox
- **Responsive Typography**: Using clamp() for fluid text sizes

## 🌙 Theme Support

- Toggle between light and dark themes
- Automatic detection of system preference
- Persistent theme selection
- CSS custom properties for easy customization

## 🔐 Authentication

Demo authentication system included:

- Login/logout functionality
- Protected routes
- User state management
- Demo credentials: user@example.com / password

## 📊 Features Included

### Pages
- **Home**: Landing page with hero section and features
- **About**: Information about the project and tech stack
- **Contact**: Contact form with validation
- **Dashboard**: Protected dashboard for authenticated users
- **Login**: Authentication page
- **404**: Custom not found page

### Components
- **Header**: Navigation with theme toggle and auth
- **Counter**: Interactive Redux counter component
- **Responsive Navigation**: Mobile-friendly navigation

## 🚀 Production Build

To build for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please:

1. Check the existing issues
2. Create a new issue with detailed description
3. Contact the development team

## 🔮 Future Enhancements

- [ ] TypeScript migration
- [ ] PWA capabilities
- [ ] Internationalization (i18n)
- [ ] Advanced animations
- [ ] API integration
- [ ] More comprehensive testing coverage

---

Built with ❤️ using React, Redux, and modern web technologies.
