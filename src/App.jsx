import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import ThemeProvider from './components/ThemeProvider/ThemeProvider'
import Header from './components/Header/Header'
import Home from './pages/Home/Home'
import About from './pages/About/About'
import Contact from './pages/Contact/Contact'
import Dashboard from './pages/Dashboard/Dashboard'
import Login from './pages/Login/Login'
import Questions from './pages/Questions/Questions'
import PreQuestionnaireForm from './pages/Questions/PreQuestionnaireForm'
import TechStackNew from './pages/TechStack/TechStackNew'
import AssessmentSuccess from './pages/AssessmentSuccess/AssessmentSuccess'
import NotFound from './pages/NotFound/NotFound'
import './App.module.css'

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <div className="App">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/pre-questionnaire" element={<PreQuestionnaireForm />} />
                <Route path="/questions" element={<Questions />} />
                <Route path="/tech-stack" element={<TechStackNew />} />
                <Route path="/assessment-success" element={<AssessmentSuccess />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </Router>
      </ThemeProvider>
    </Provider>
  )
}

export default App
