"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setSubmitted(true);
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
          Contact <span className="text-accent">Us</span>
        </h1>
        <p className="text-muted max-w-xl mx-auto text-base">
          Have questions about listing an event, artist verification, or advertising? Get in touch with the RapHunt team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
        {/* Contact Info */}
        <div className="md:col-span-5 space-y-6 bg-surface border border-border rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white">Support & Operations</h2>
          
          <div className="space-y-4 text-sm">
            {process.env.NEXT_PUBLIC_SUPPORT_EMAIL && (
              <div className="space-y-1">
                <p className="text-muted font-medium">Email Support</p>
                <p className="text-white font-semibold hover:text-accent transition-colors">
                  <a href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}>
                    {process.env.NEXT_PUBLIC_SUPPORT_EMAIL}
                  </a>
                </p>
              </div>
            )}

            {process.env.NEXT_PUBLIC_SUPPORT_PHONE && (
              <div className="space-y-1">
                <p className="text-muted font-medium">Phone Support</p>
                <p className="text-white font-semibold hover:text-accent transition-colors">
                  <a href={`tel:${process.env.NEXT_PUBLIC_SUPPORT_PHONE}`}>
                    {process.env.NEXT_PUBLIC_SUPPORT_PHONE}
                  </a>
                </p>
              </div>
            )}

            {process.env.NEXT_PUBLIC_SUPPORT_ADDRESS && (
              <div className="space-y-1">
                <p className="text-muted font-medium">Business Address</p>
                <p className="text-white font-semibold leading-relaxed whitespace-pre-line">
                  {process.env.NEXT_PUBLIC_SUPPORT_ADDRESS}
                </p>
              </div>
            )}

            <div className="space-y-1 pt-2 border-t border-border">
              <p className="text-muted font-medium">Operating Hours</p>
              <p className="text-white font-semibold">Monday - Friday: 10:00 AM - 6:00 PM IST</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="md:col-span-7 bg-surface border border-border rounded-2xl p-6 md:p-8 space-y-5">
          <h2 className="text-xl font-bold text-white">Send us a Message</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-accent text-sm"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-accent text-sm"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">Subject</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-accent text-sm"
              placeholder="e.g. Event listing query"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">Message</label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-accent text-sm resize-none"
              placeholder="How can we help you today?"
            />
          </div>

          <Button type="submit" className="w-full">
            Submit Message
          </Button>

          {submitted && (
            <div className="bg-green-900/20 border border-green-800 text-green-400 text-sm px-4 py-3 rounded-xl text-center">
              🎉 Message sent successfully! We will get back to you within 24-48 hours.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
