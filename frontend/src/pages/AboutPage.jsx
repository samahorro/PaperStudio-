import { NavLink } from 'react-router-dom'
import './AboutPage.css'

function AboutPage() {
  return (
    <div className="about-page">

      {/* HEADER */}
      <div className="about-header">
        <h1 className="about-title">About Us</h1>
        <p className="about-subtitle">Learn more about the team behind PaperStudio</p>
      </div>

      {/* OUR STORY + OUR MISSION */}
      <div className="about-cards-row">
        <div className="about-card">
          <h2 className="about-card-title">Our Story</h2>
          <p className="about-card-text">
            PaperStudio began when four Computer Science college students teamed up for a
            fall semester class project. This website you're currently visiting is the result!
            Our goal was to apply what we learned in class to create an application that aligns
            with today's love for quality stationery and the art of writing.
          </p>
        </div>
        <div className="about-card">
          <h2 className="about-card-title">Our Mission</h2>
          <p className="about-card-text">
            Our purpose is to provide the essential stationery for your everyday life — pieces
            that reflect your personal style and fuel your creativity. Our stationery doesn't
            just help you write, it helps you think, create, and stay organised beautifully.
          </p>
        </div>
      </div>

      {/* WHO WE SERVE */}
      <div className="about-serve-card">
        <h2 className="about-serve-title">Who We Serve</h2>
        <div className="about-serve-grid">
          <div className="about-serve-item">
            <div className="about-serve-icon">
              {/* Graduation cap */}
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>
            <h3 className="about-serve-name">Students</h3>
            <p className="about-serve-desc">
              Busy students who need practical, stylish stationery to keep up with their
              notes, projects, and packed schedules.
            </p>
          </div>
          <div className="about-serve-item">
            <div className="about-serve-icon">
              {/* Briefcase */}
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
            </div>
            <h3 className="about-serve-name">Working Professionals</h3>
            <p className="about-serve-desc">
              Professionals who need reliable, refined stationery that complements their
              workspace and elevates their everyday routine.
            </p>
          </div>
          <div className="about-serve-item">
            <div className="about-serve-icon">
              {/* Pencil / creative */}
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </div>
            <h3 className="about-serve-name">Creatives</h3>
            <p className="about-serve-desc">
              Artists and creatives who seek high-quality sketchbooks, pens, and tools that
              bring their ideas to life on paper.
            </p>
          </div>
        </div>
        <p className="about-serve-note">
          Stationery that is practical, beautiful, and inspiring should be in everyone's hands.
          That's why each of our products is made to be affordable and functional.
        </p>
      </div>

      {/* JOIN OUR JOURNEY CTA */}
      <div className="about-cta">
        <h2 className="about-cta-title">Join Our Journey</h2>
        <p className="about-cta-text">
          From a fall semester college project to serving customers nationwide, we're excited
          to bring you the finest stationery that combines style, quality, and affordability.
        </p>
        <NavLink to="/collections">
          <button className="about-cta-btn">Shop Our Collection</button>
        </NavLink>
      </div>

    </div>
  )
}

export default AboutPage
