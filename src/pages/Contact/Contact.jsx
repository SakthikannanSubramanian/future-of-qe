import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addNotification } from '../../redux/slices/uiSlice'
import styles from './Contact.module.css'

const Contact = () => {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))

    dispatch(addNotification({
      type: 'success',
      message: 'Message sent successfully! We\'ll get back to you soon.'
    }))

    setFormData({ name: '', email: '', message: '' })
    setLoading(false)
  }

  return (
    <div className={styles.contact}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Get in Touch</h1>
          <p>We'd love to hear from you. Send us a message!</p>
        </header>

        <div className={styles.content}>
          <div className={styles.formSection}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.label}>
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  rows="5"
                  className={styles.textarea}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={styles.submitButton}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          <div className={styles.infoSection}>
            <div className={styles.infoCard}>
              <h3>Contact Information</h3>
              <div className={styles.infoItem}>
                <span className={styles.icon}>📧</span>
                <span>contact@futureofqe.com</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.icon}>📞</span>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.icon}>📍</span>
                <span>123 Tech Street, Innovation City</span>
              </div>
            </div>

            <div className={styles.infoCard}>
              <h3>Office Hours</h3>
              <div className={styles.infoItem}>
                <span>Monday - Friday: 9:00 AM - 6:00 PM</span>
              </div>
              <div className={styles.infoItem}>
                <span>Saturday: 10:00 AM - 4:00 PM</span>
              </div>
              <div className={styles.infoItem}>
                <span>Sunday: Closed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
