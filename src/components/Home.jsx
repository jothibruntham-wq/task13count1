import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ComingSoon from "./ComingSoon";
import { soundFX } from "../utils/audio";
import "../assets/style/style.css";

const TOTAL_TIME = 10;

function Home() {
  const [time, setTime] = useState(TOTAL_TIME);
  const [running, setRunning] = useState(true);
  const [stage, setStage] = useState("countdown"); // "countdown" | "transitioning" | "coming-soon"
  const [soundOn, setSoundOn] = useState(true);
  const prevTimeRef = useRef(time);

  // Audio mute sync
  useEffect(() => {
    soundFX.muted = !soundOn;
  }, [soundOn]);

  // Countdown timer logic
  useEffect(() => {
    if (stage !== "countdown") return;
    if (!running) return;

    if (time <= 0) {
      handleCountdownComplete();
      return;
    }

    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [running, time, stage]);

  // Trigger sound effect on tick
  useEffect(() => {
    if (stage === "countdown" && running && time > 0 && time !== prevTimeRef.current) {
      // Pitch increases as timer decreases
      const pitch = 350 + (TOTAL_TIME - time) * 70;
      soundFX.playTick(pitch, 0.08);
    }
    prevTimeRef.current = time;
  }, [time, stage, running]);

  const handleCountdownComplete = () => {
    soundFX.playLaunch();
    setStage("transitioning");

    // Smooth transition into coming soon page
    setTimeout(() => {
      setStage("coming-soon");
    }, 800);
  };

  const handleReset = () => {
    setTime(TOTAL_TIME);
    setRunning(true);
    setStage("countdown");
  };

  const handleSkipToEnd = () => {
    setTime(0);
    handleCountdownComplete();
  };

  // Progress calculation
  const progress = (time / TOTAL_TIME) * 100;

  // Number color shift based on remaining time
  const getNumberColorClass = () => {
    if (time <= 3) return "number-urgent";
    if (time <= 6) return "number-mid";
    return "number-normal";
  };

  return (
    <main className="neon-page">
      {/* Sound toggle button */}
      <motion.button
        className="sound-toggle-btn"
        onClick={() => setSoundOn((prev) => !prev)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title={soundOn ? "Mute audio" : "Enable audio"}
      >
        {soundOn ? "🔊 AUDIO ON" : "🔇 MUTED"}
      </motion.button>

      {/* Animated background & neon grid */}
      <div className="background-grid"></div>

      <div className="glow glow-one"></div>
      <div className="glow glow-two"></div>
      <div className="glow glow-three"></div>

      {/* Floating particles */}
      <div className="particles">
        {[...Array(24)].map((_, index) => (
          <motion.span
            key={index}
            className="particle"
            initial={{
              opacity: 0,
              y: 100,
              x: (index * 4.2) % 100 + "vw",
            }}
            animate={{
              opacity: [0, 0.8, 0],
              y: -120,
            }}
            transition={{
              duration: 3 + ((index * 0.7) % 5),
              delay: (index * 0.3) % 4,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Launch Portal Flash Effect */}
      {stage === "transitioning" && (
        <motion.div
          className="portal-flash"
          initial={{ opacity: 0, scale: 0.2 }}
          animate={{ opacity: [0, 1, 0.9, 0], scale: [0.2, 1.8, 3, 4] }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      )}

      {/* Main Content Area */}
      <section className="countdown-wrapper">
        <AnimatePresence mode="wait">
          {stage === "countdown" && (
            <motion.div
              key="countdown-stage"
              className="stage-container"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                scale: 1.15,
                filter: "blur(16px)",
                transition: { duration: 0.6 },
              }}
            >
              {/* Header */}
              <motion.div
                className="header"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="top-indicator">
                  <span className="live-dot"></span>
                  <span>SYSTEM INITIALIZING</span>
                </div>
                <h1>LOADER COUNTDOWN</h1>
                <p>QUANTUM LAUNCH PROTOCOL • T-MINUS {time}S</p>
              </motion.div>

              {/* Glass card */}
              <motion.div
                className="glass-card"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.7,
                  type: "spring",
                  stiffness: 110,
                }}
              >
                {/* Neon border animation */}
                <div className="animated-border"></div>

                {/* Countdown Dial Container */}
                <div className="timer-container">
                  {/* Outer rotating ring */}
                  <motion.div
                    className="outer-ring"
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <span className="ring-dot dot-one"></span>
                    <span className="ring-dot dot-two"></span>
                    <span className="ring-dot dot-three"></span>
                  </motion.div>

                  {/* SVG progress circle */}
                  <svg className="progress-svg" viewBox="0 0 220 220">
                    <defs>
                      <linearGradient
                        id="neonGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#00eaff" />
                        <stop offset="40%" stopColor="#1677ff" />
                        <stop offset="70%" stopColor="#9c4dff" />
                        <stop offset="100%" stopColor="#ff007f" />
                      </linearGradient>

                      <filter id="neonGlow">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Background circle */}
                    <circle
                      className="circle-background"
                      cx="110"
                      cy="110"
                      r="82"
                    />

                    {/* Progress glow */}
                    <motion.circle
                      className="progress-glow"
                      cx="110"
                      cy="110"
                      r="82"
                      stroke="url(#neonGradient)"
                      strokeWidth="9"
                      fill="none"
                      strokeLinecap="round"
                      filter="url(#neonGlow)"
                      strokeDasharray="515"
                      animate={{
                        strokeDashoffset: 515 - (515 * progress) / 100,
                      }}
                      transition={{
                        duration: 0.6,
                        ease: "easeInOut",
                      }}
                    />

                    {/* Extra secondary rotating neon ring */}
                    <motion.circle
                      className="secondary-ring"
                      cx="110"
                      cy="110"
                      r="94"
                      fill="none"
                      stroke="url(#neonGradient)"
                      strokeWidth="2"
                      strokeDasharray="80 100"
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      style={{
                        transformOrigin: "110px 110px",
                      }}
                    />
                  </svg>

                  {/* Center with Animated Number */}
                  <div className="timer-center">
                    <AnimatePresence mode="popLayout">
                      <motion.div
                        key={time}
                        className={`number ${getNumberColorClass()}`}
                        initial={{
                          opacity: 0,
                          scale: 2.1,
                          filter: "blur(14px)",
                          y: -10,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          filter: "blur(0px)",
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.35,
                          filter: "blur(10px)",
                          y: 15,
                        }}
                        transition={{
                          duration: 0.45,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        {time}
                      </motion.div>
                    </AnimatePresence>

                    {/* Shockwave burst ring on each tick */}
                    <motion.div
                      key={`pulse-${time}`}
                      className="tick-shockwave"
                      initial={{ scale: 0.8, opacity: 0.9 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />

                    <motion.div
                      className="pulse-circle"
                      animate={{
                        scale: [1, 1.25, 1],
                        opacity: [0.5, 0.1, 0.5],
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                      }}
                    />
                  </div>
                </div>

                {/* Status indicator */}
                <motion.div
                  className="status"
                  animate={{
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                  }}
                >
                  {time === 0
                    ? "🚀 LAUNCH SEQUENCE INITIATED..."
                    : running
                    ? "⚡ COUNTDOWN IN PROGRESS"
                    : "⏸ COUNTDOWN PAUSED"}
                </motion.div>

                {/* Interactive Controls */}
                <div className="buttons">
                  <motion.button
                    className="neon-button blue"
                    onClick={() => setRunning(!running)}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 15px #00d9ff, 0 0 35px #00d9ff",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>{running ? "Ⅱ" : "▶"}</span>
                    {running ? "PAUSE" : "RESUME"}
                  </motion.button>

                  <motion.button
                    className="neon-button purple"
                    onClick={handleReset}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 15px #bd4cff, 0 0 35px #bd4cff",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>↺</span> RESET
                  </motion.button>

                  <motion.button
                    className="neon-button green"
                    onClick={handleSkipToEnd}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 15px #00ffaa, 0 0 35px #00ffaa",
                    }}
                    whileTap={{ scale: 0.95 }}
                    title="Skip immediately to Coming Soon page"
                  >
                    <span>⚡</span> SKIP
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {stage === "coming-soon" && (
            <ComingSoon key="coming-soon-stage" onRestart={handleReset} />
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}

export default Home;