
import React, { useState } from "react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for contacting us! We will get back to you shortly.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
    });
  };

  return (
    <div className="contact-page">
      {/* HERO SECTION */}
      <div
        className="contact-hero d-flex align-items-center justify-content-center"
        style={{
          backgroundImage:
            "url(https://www.shutterstock.com/image-vector/contact-us-customer-support-hotline-600nw-2402878041.jpg)",
        }}
      >
        <div className="contact-hero-content">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you. Let's work together!</p>
        </div>
      </div>

      {/* CONTACT CONTENT */}
      <div className="container py-5">
        <div className="row g-4">
          {/* LEFT CARD - FORM */}
          <div className="col-md-6">
            <div className="contact-card">
              <h2 className="contact-title">Send Us a Message</h2>

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label>Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    placeholder="+1 234 567 890"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label>Company Name</label>
                  <input
                    type="text"
                    name="company"
                    className="form-control"
                    placeholder="Your Company"
                    value={formData.company}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-4">
                  <label>Message *</label>
                  <textarea
                    name="message"
                    rows="5"
                    className="form-control"
                    placeholder="Tell us about your project..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="contact-btn w-100">
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT CARD - INFO */}
          <div className="col-md-6">
            <div className="contact-card">
              <h2 className="contact-title">Get in Touch</h2>

              <div className="contact-info-item">
                <div className="contact-info-icon">📍</div>
                <div>
                  <h6>Address</h6>
                  <p>
                    SkyVolt Pvt
                    <br />
                    Hydrabad City, CA 94102
                  </p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">📧</div>
                <div>
                  <h6>Email</h6>
                  <p>
                    info@skyvoltsolutions.com
                    <br />
                    support@skyvoltsolutions.com
                  </p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">📞</div>
                <div>
                  <h6>Phone</h6>
                  <p>
                    +91 9550321615
                    <br />
                    +91 8688151326
                  </p>
                </div>
              </div>

              {/* MAP */}
              <div className="contact-map mt-4">
                <iframe
                  title="Company Location"
                   src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.2750216427917!2d78.40061497325009!3d17.494380199717853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb91f20663c46d%3A0x846796db82f76735!2sSocial%20Prachar!5e0!3m2!1sen!2sin!4v1766460094021!5m2!1sen!2sin" 
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;