import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import { 
  saveProjectDetails, 
  selectProjectDetails, 
  selectProjectDetailsLoading,
  selectProjectDetailsError 
} from '../../redux/slices/projectSlice'
import styles from './Questionnaire.module.css'

const Questionnaire = () => {
  const { theme } = useTheme()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const projectDetails = useSelector(selectProjectDetails)
  const loading = useSelector(selectProjectDetailsLoading)
  const error = useSelector(selectProjectDetailsError)

  const [formData, setFormData] = useState({
    projectName: '',
    accountName: '',
    emailId: '',
    managerSelect: '',
    edlSelect: '',
    pdl: ''
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Manager and EDL options (in real app, these would come from API)
  const managerOptions = [
    { value: '', label: 'Select Manager' },
    { value: 'john-smith', label: 'John Smith' },
    { value: 'jane-doe', label: 'Jane Doe' },
    { value: 'mike-johnson', label: 'Mike Johnson' },
    { value: 'sarah-wilson', label: 'Sarah Wilson' }
  ]

  const edlOptions = [
    { value: '', label: 'Select EDL' },
    { value: 'engineering-lead-1', label: 'Engineering Lead 1' },
    { value: 'engineering-lead-2', label: 'Engineering Lead 2' },
    { value: 'engineering-lead-3', label: 'Engineering Lead 3' },
    { value: 'engineering-lead-4', label: 'Engineering Lead 4' }
  ]

  useEffect(() => {
    // Pre-populate form if project details exist
    if (projectDetails) {
      setFormData(projectDetails)
    }
  }, [projectDetails])

  const validateField = (name, value) => {
    let error = ''

    switch (name) {
      case 'projectName':
        if (!value.trim()) {
          error = 'Project name is required'
        }
        break
      case 'accountName':
        if (!value.trim()) {
          error = 'Account name is required'
        }
        break
      case 'emailId':
        if (!value.trim()) {
          error = 'Email ID is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address'
        }
        break
      case 'managerSelect':
        if (!value) {
          error = 'Manager selection is required'
        }
        break
      case 'edlSelect':
        if (!value) {
          error = 'EDL selection is required'
        }
        break
      case 'pdl':
        if (!value.trim()) {
          error = 'PDL is required'
        }
        break
      default:
        break
    }

    return error
  }

  const validateForm = () => {
    const newErrors = {}
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key])
      if (error) {
        newErrors[key] = error
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error when user starts typing
    if (touched[name] && errors[name]) {
      const error = validateField(name, value)
      setErrors(prev => ({
        ...prev,
        [name]: error
      }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched(prev => ({
      ...prev,
      [name]: true
    }))

    const error = validateField(name, value)
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched(Object.keys(formData).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {}))

    if (validateForm()) {
      try {
        await dispatch(saveProjectDetails(formData)).unwrap()
        // Redirect to questions section
        navigate('/questions')
      } catch (err) {
        console.error('Failed to save project details:', err)
      }
    }
  }

  return (
    <div className={`${styles.questionnaire} ${styles[theme]}`}>
      <div className={`${styles.container} ${styles.responsiveContainer}`}>
        <header className={styles.header}>
          <h1 className={styles.headingFluid}>Project Details</h1>
          <p className={styles.textFluid}>Please provide your project information to begin the assessment</p>
        </header>

        <section className={`${styles.content} ${styles.spacingFluid}`}>
          <form onSubmit={handleSubmit} className={styles.form}>
            {error && (
              <div className={styles.errorBanner} role="alert">
                {error}
              </div>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="projectName" className={styles.label}>
                Project name *
              </label>
              <input
                type="text"
                id="projectName"
                name="projectName"
                value={formData.projectName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`${styles.input} ${errors.projectName ? styles.inputError : ''}`}
                disabled={loading}
                aria-describedby={errors.projectName ? 'projectName-error' : undefined}
              />
              {errors.projectName && touched.projectName && (
                <span id="projectName-error" className={styles.errorText} role="alert">
                  {errors.projectName}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="accountName" className={styles.label}>
                Account name *
              </label>
              <input
                type="text"
                id="accountName"
                name="accountName"
                value={formData.accountName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`${styles.input} ${errors.accountName ? styles.inputError : ''}`}
                disabled={loading}
                aria-describedby={errors.accountName ? 'accountName-error' : undefined}
              />
              {errors.accountName && touched.accountName && (
                <span id="accountName-error" className={styles.errorText} role="alert">
                  {errors.accountName}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="emailId" className={styles.label}>
                Email ID of the project rep *
              </label>
              <input
                type="email"
                id="emailId"
                name="emailId"
                value={formData.emailId}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`${styles.input} ${errors.emailId ? styles.inputError : ''}`}
                disabled={loading}
                aria-describedby={errors.emailId ? 'emailId-error' : undefined}
              />
              {errors.emailId && touched.emailId && (
                <span id="emailId-error" className={styles.errorText} role="alert">
                  {errors.emailId}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="managerSelect" className={styles.label}>
                Manager Select *
              </label>
              <select
                id="managerSelect"
                name="managerSelect"
                value={formData.managerSelect}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`${styles.select} ${errors.managerSelect ? styles.inputError : ''}`}
                disabled={loading}
                aria-describedby={errors.managerSelect ? 'managerSelect-error' : undefined}
              >
                {managerOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.managerSelect && touched.managerSelect && (
                <span id="managerSelect-error" className={styles.errorText} role="alert">
                  {errors.managerSelect}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="edlSelect" className={styles.label}>
                EDL Select *
              </label>
              <select
                id="edlSelect"
                name="edlSelect"
                value={formData.edlSelect}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`${styles.select} ${errors.edlSelect ? styles.inputError : ''}`}
                disabled={loading}
                aria-describedby={errors.edlSelect ? 'edlSelect-error' : undefined}
              >
                {edlOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.edlSelect && touched.edlSelect && (
                <span id="edlSelect-error" className={styles.errorText} role="alert">
                  {errors.edlSelect}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="pdl" className={styles.label}>
                PDL *
              </label>
              <input
                type="text"
                id="pdl"
                name="pdl"
                value={formData.pdl}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`${styles.input} ${errors.pdl ? styles.inputError : ''}`}
                disabled={loading}
                aria-describedby={errors.pdl ? 'pdl-error' : undefined}
              />
              {errors.pdl && touched.pdl && (
                <span id="pdl-error" className={styles.errorText} role="alert">
                  {errors.pdl}
                </span>
              )}
            </div>

            <div className={styles.submitSection}>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Go to Questions'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  )
}

export default Questionnaire
