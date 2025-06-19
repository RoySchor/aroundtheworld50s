import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      if (
        !formData.name.trim() ||
        !formData.email.trim() ||
        !formData.message.trim()
      ) {
        throw new Error("Please fill in all fields");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error("Please enter a valid email address");
      }

      const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
      const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        to_email: "royschor@gmail.com",
        message: formData.message,
        reply_to: formData.email,
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      // Reset form and show success message
      setFormData({ name: "", email: "", message: "" });
      setSubmitStatus({
        type: "success",
        message:
          "Thank you! Your message has been sent successfully. We'll get back to you soon!",
      });
    } catch (error) {
      console.error("EmailJS Error:", error);
      let errorMessage = error.message;

      // Handle specific EmailJS errors
      if (error.text) {
        errorMessage = "Failed to send email. Please try again later.";
      } else if (
        error.message.includes("service_id") ||
        error.message.includes("template_id")
      ) {
        errorMessage =
          "Email service is not properly configured. Please contact us directly at royschor@gmail.com";
      }

      setSubmitStatus({ type: "error", message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h2 className="contact-title">Get in Touch</h2>
        <p className="contact-subtitle">
          Have a question regarding a blog post, in general, or want to share
          your own adventure? We'd love to hear from you!
        </p>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            placeholder="Your full name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            placeholder="your.email@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="message" className="form-label">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="form-textarea"
            placeholder="Tell us what's on your mind..."
            rows="5"
            required
          />
        </div>

        {submitStatus && (
          <div className={`submit-status ${submitStatus.type}`}>
            {submitStatus.message}
          </div>
        )}

        <button
          type="submit"
          className="contact-submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
};

export default Contact;
