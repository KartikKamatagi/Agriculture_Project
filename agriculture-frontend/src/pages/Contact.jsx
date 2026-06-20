import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] py-16 px-6">
      <div className="max-w-6xl mx-auto bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8">
          <div className="relative bg-green-600 text-white p-12 lg:p-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_55%)] opacity-60" />
            <div className="relative z-10 space-y-8">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">Contact Us</h1>
              <p className="text-lg text-green-100 max-w-xl leading-relaxed">
                Have a question, feedback, or want to partner with FarmerDirect? Send us a message and our support team will get back to you shortly.
              </p>
              <div className="space-y-4 text-sm text-green-100/90">
                <div>
                  <span className="block font-semibold">Email</span>
                  <span>support@farmerdirect.com</span>
                </div>
                <div>
                  <span className="block font-semibold">Phone</span>
                  <span>+91 98765 43210</span>
                </div>
                <div>
                  <span className="block font-semibold">Address</span>
                  <span>123 Greenway Lane, Farmgate, India</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12 lg:p-16">
            <div className="max-w-xl">
              <p className="text-sm uppercase tracking-[0.3em] text-green-600 font-black mb-4">Get in touch</p>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">We’re here to help</h2>

              {submitted ? (
                <div className="rounded-3xl border border-green-100 bg-green-50 p-8">
                  <h3 className="text-xl font-semibold text-green-800 mb-2">Message sent!</h3>
                  <p className="text-sm text-green-700">Thanks for reaching out. We’ll respond as soon as possible.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <label className="block">
                    <span className="text-sm font-semibold text-gray-700">Name</span>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-3 block w-full rounded-3xl border border-gray-200 bg-gray-50 px-5 py-4 text-gray-900 focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition"
                      placeholder="Your full name"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-gray-700">Email</span>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-3 block w-full rounded-3xl border border-gray-200 bg-gray-50 px-5 py-4 text-gray-900 focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition"
                      placeholder="you@example.com"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-gray-700">Message</span>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="mt-3 block w-full rounded-3xl border border-gray-200 bg-gray-50 px-5 py-4 text-gray-900 focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition"
                      placeholder="Tell us how we can help"
                    />
                  </label>

                  <button
                    type="submit"
                    className="w-full rounded-3xl bg-green-600 px-6 py-4 text-white font-semibold shadow-lg shadow-green-200/60 transition hover:bg-green-700"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
