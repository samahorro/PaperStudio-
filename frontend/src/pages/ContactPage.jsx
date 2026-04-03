import { useState } from 'react'
import { submitContactForm } from '../utils/api'
import './ContactPage.css'

function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.subject || !formData.message) {
      setError('Please fill in all fields.')
      return
    }

    setLoading(true)
    const data = await submitContactForm({
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      subject: formData.subject,
      message: formData.message
    })

    if (data.message) {
      setSuccess("Message sent! We'll get back to you soon.")
      setFormData({ firstName: '', lastName: '', email: '', subject: '', message: '' })
    } else {
      setError('Failed to send message. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="contact-page">

      {/* HEADER */}
      <div className="contact-header">
        <h1>Contact Us</h1>
      </div>

      {/* GET IN TOUCH */}
      <div className="contact-body">

        {/* LEFT */}
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <div className="contact-detail">
            <span className="contact-label">email:</span>
            <span>papersource@gmail.com</span>
          </div>
          <div className="contact-detail">
            <span className="contact-label">phone:</span>
            <span>+1 2382928374</span>
          </div>
          <div className="contact-detail">
            <span className="contact-label">Address:</span>
            <span>123 Cloud Ave, Los Angeles,<br />CA 12345 United States</span>
          </div>
        </div>

        {/* RIGHT — form */}
        <div className="contact-form-wrap">
          {error && <p className="contact-error">{error}</p>}
          {success && <p className="contact-success">{success}</p>}

          <div className="contact-form">
            <div className="contact-row">
              <div className="contact-field">
                <label>First name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Your first name"
                />
              </div>
              <div className="contact-field">
                <label>Last name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Your last name"
                />
              </div>
            </div>

            <div className="contact-field">
              <label>Email address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="enter your email"
              />
            </div>

            <div className="contact-field">
              <label>Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. Order inquiry"
              />
            </div>

            <div className="contact-field">
              <label>Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write something..."
                rows={6}
              />
            </div>

            <button
              className="contact-submit-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </div>
      </div>

      {/* MAP */}
      <div className="contact-map">
        <iframe
          title="PaperStudio Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2!2d-118.2437!3d34.0522!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c75ddc27da13%3A0xe22fefa0832b7e47!2sLos%20Angeles%2C%20CA!5e0!3m2!1sen!2sus!4v1234567890"
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* PACKAGE INFO icon will be replaced later ya*/}
      <div className="contact-package">
        <h3>Package info</h3>
        <div className="package-grid">
          <div className="package-card">
            <span className="package-icon"></span>
            <div>
              <p className="package-title">Track Order</p>
              <p className="package-sub">Track your package</p>
            </div>
          </div>
          <div className="package-card">
            <span className="package-icon"></span>
            <div>
              <p className="package-title">Cancel Order</p>
              <p className="package-sub">Cancel within 24hrs</p>
            </div>
          </div>
          <div className="package-card">
            <span className="package-icon"></span>
            <div>
              <p className="package-title">Return Order</p>
              <p className="package-sub">Easy returns</p>
            </div>
          </div>
          <div className="package-card">
            <span className="package-icon"></span>
            <div>
              <p className="package-title">Report an Issue</p>
              <p className="package-sub">We'll help you</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default ContactPage