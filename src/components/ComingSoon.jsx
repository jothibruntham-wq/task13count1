import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ComingSoon({ onRestart }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Future launch target (e.g. 14 days from now)
  const [timeLeft, setTimeLeft] = useState({
    days: 14,
    hours: 8,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let s = prev.seconds - 1;
        let m = prev.minutes;
        let h = prev.hours;
        let d = prev.days;

        if (s < 0) {
          s = 59;
          m -= 1;
        }
        if (m < 0) {
          m = 59;
          h -= 1;
        }
        if (h < 0) {
          h = 23;
          d -= 1;
        }
        if (d < 0) {
          return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
        return { days: d, hours: h, minutes: m, seconds: s };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubmitted(true);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.92, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.12,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const countdownUnits = [
    { label: "DAYS", value: String(timeLeft.days).padStart(2, "0") },
    { label: "HOURS", value: String(timeLeft.hours).padStart(2, "0") },
    { label: "MINUTES", value: String(timeLeft.minutes).padStart(2, "0") },
    { label: "SECONDS", value: String(timeLeft.seconds).padStart(2, "0") },
  ];

  const features = [
    { icon: "⚡", title: "Ultra Performance", desc: "Built with cutting-edge reactive architecture" },
    { icon: "🛡️", title: "Quantum Security", desc: "Next-gen zero-trust protocol protection" },
    { icon: "✨", title: "AI Supercharged", desc: "Autonomous intelligence powering every flow" },
  ];

  return (
    <motion.div
      className="coming-soon-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.4 } }}
    >
      {/* Top Banner Tag */}
      <motion.div variants={itemVariants} className="badge-wrapper">
        <span className="launch-badge">
          <span className="badge-pulse"></span>
          ACCESS PROTOCOL UNLOCKED • V2.0
        </span>
      </motion.div>

      {/* Main Heading */}
      <motion.h1 variants={itemVariants} className="coming-soon-title">
        COMING <span className="gradient-text">SOON</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p variants={itemVariants} className="coming-soon-desc">
        Something extraordinary is on the horizon. We are finalizing the last details
        of an unprecedented experience. Be the first to know when we go live.
      </motion.p>

      {/* Live Official Launch Countdown Timer */}
      <motion.div variants={itemVariants} className="cs-countdown-grid">
        {countdownUnits.map((unit, i) => (
          <div key={i} className="cs-unit-card">
            <div className="cs-unit-number">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={unit.value}
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -15, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {unit.value}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="cs-unit-label">{unit.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Email Subscription Box */}
      <motion.div variants={itemVariants} className="email-card">
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="success-box"
          >
            <span className="success-icon">✓</span>
            <div>
              <h4>YOU'RE ON THE VIP LIST</h4>
              <p>We'll notify {email} the instant we launch!</p>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="notify-form">
            <input
              type="email"
              placeholder="Enter your email for VIP early access..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="notify-input"
            />
            <motion.button
              type="submit"
              className="notify-btn"
              whileHover={{ scale: 1.04, boxShadow: "0 0 25px rgba(0, 234, 255, 0.6)" }}
              whileTap={{ scale: 0.96 }}
            >
              <span>GET NOTIFIED</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </motion.button>
          </form>
        )}
      </motion.div>

      {/* Feature Snippets */}
      <motion.div variants={itemVariants} className="features-grid">
        {features.map((feat, idx) => (
          <div key={idx} className="feature-pill">
            <span className="feat-icon">{feat.icon}</span>
            <div className="feat-text">
              <span className="feat-title">{feat.title}</span>
              <span className="feat-desc">{feat.desc}</span>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Action Navigation */}
      <motion.div variants={itemVariants} className="cs-actions">
        <motion.button
          onClick={onRestart}
          className="neon-button purple restart-btn"
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px #bd4cff" }}
          whileTap={{ scale: 0.95 }}
        >
          <span>↺</span> REPLAY COUNTDOWN
        </motion.button>

        <motion.button
          onClick={handleShare}
          className="neon-button blue restart-btn"
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px #00eaff" }}
          whileTap={{ scale: 0.95 }}
        >
          <span>{copied ? "✓" : "🔗"}</span> {copied ? "LINK COPIED!" : "SHARE PAGE"}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
