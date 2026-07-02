import { useEffect, useState } from 'react';

export default function AnimatedLogin() {
  const [focusPassword, setFocusPassword] = useState(false);
  const [form, setForm] = useState({
    username: '',
    password: '',
  });
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const eye = {
    x: Math.max(-6, Math.min(6, (mouse.x - window.innerWidth / 2) / 50)),
    y: Math.max(-4, Math.min(4, (mouse.y - window.innerHeight / 2) / 50)),
  };

  return (
    <div className="login-shell">
      <style>{`
        .login-shell {
          height: 100vh;
          width: 100vw;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          overflow: hidden;
          position: relative;
          background: linear-gradient(135deg, #020617 0%, #111827 45%, #1d4ed8 100%);
          font-family: Inter, sans-serif;
          color: #f8fafc;
        }

        .login-card {
          width: min(1160px, 100%);
          min-height: min(760px, 90vh);
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          border-radius: 32px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.16);
          box-shadow: 0 28px 80px rgba(0, 0, 0, 0.35);
          background: rgba(15, 23, 42, 0.82);
          backdrop-filter: blur(24px);
          animation: slideUp 0.6s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .intro-panel {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 48px;
          gap: 24px;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 64, 175, 0.9));
          overflow: hidden;
        }

        .orb {
          position: absolute;
          border-radius: 999px;
          filter: blur(10px);
          opacity: 0.45;
          animation: float 7s ease-in-out infinite;
        }

        .orb-one {
          width: 260px;
          height: 260px;
          background: #38bdf8;
          top: -70px;
          right: -80px;
        }

        .orb-two {
          width: 220px;
          height: 220px;
          background: #818cf8;
          bottom: -70px;
          left: -50px;
          animation-delay: -3s;
        }

        @keyframes float {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(10px, -14px, 0);
          }
        }

        .intro-copy {
          position: relative;
          z-index: 1;
          max-width: 420px;
        }

        .eyebrow {
          margin: 0 0 8px;
          text-transform: uppercase;
          letter-spacing: 0.35em;
          font-size: 0.8rem;
          font-weight: 700;
          color: #93c5fd;
        }

        .intro-title {
          margin: 0 0 10px;
          font-size: clamp(1.8rem, 3vw, 2.6rem);
          font-weight: 700;
        }

        .intro-text {
          margin: 0;
          font-size: 1rem;
          line-height: 1.7;
          color: rgba(248, 250, 252, 0.8);
        }

        .form-panel {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          background: rgba(2, 6, 23, 0.5);
        }

        .form-box {
          width: 100%;
          max-width: 380px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .title {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 6px;
        }

        .subtitle {
          font-size: 0.95rem;
          color: rgba(226, 232, 240, 0.7);
          margin-bottom: 16px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 8px;
          color: #e2e8f0;
          font-size: 0.92rem;
        }

        .input {
          width: 100%;
          padding: 13px 14px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(15, 23, 42, 0.8);
          color: #f8fafc;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .input:focus {
          border-color: #60a5fa;
          box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
        }

        .btn {
          width: 100%;
          padding: 13px 16px;
          margin-top: 8px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(90deg, #6366f1, #22d3ee);
          color: white;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 12px 30px rgba(34, 211, 238, 0.2);
        }

        .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 16px 35px rgba(34, 211, 238, 0.26);
        }

        .face {
          width: 132px;
          height: 132px;
          margin-top: 8px;
          position: relative;
          z-index: 1;
        }

        .eye {
          position: absolute;
          width: 16px;
          height: 16px;
          background: white;
          border-radius: 50%;
          top: 48px;
        }

        .eye.left { left: 38px; }
        .eye.right { right: 38px; }

        .pupil {
          width: 7px;
          height: 7px;
          background: #0f172a;
          border-radius: 50%;
          position: absolute;
          top: 4px;
          left: 4px;
          transition: 0.1s ease-out;
        }

        .mouth {
          width: 46px;
          height: 22px;
          border-bottom: 3px solid white;
          border-radius: 0 0 42px 42px;
          position: absolute;
          bottom: 22px;
          left: 50%;
          transform: translateX(-50%);
        }

        .hands {
          position: absolute;
          top: 42px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 42px;
        }

        .hand {
          width: 32px;
          height: 54px;
          background: #fbbf24;
          border-radius: 20px;
          transition: 0.3s ease;
        }

        .cover .hand {
          transform: translateY(-18px) rotate(20deg);
        }

        @media (max-width: 860px) {
          .login-card {
            grid-template-columns: 1fr;
          }

          .intro-panel {
            padding: 32px 24px 24px;
            min-height: 320px;
          }

          .form-panel {
            padding: 24px;
          }
        }
          grid-template-columns: 1.05fr 0.95fr;
          border-radius: 32px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.16);
          box-shadow: 0 28px 80px rgba(0, 0, 0, 0.35);
          background: rgba(15, 23, 42, 0.82);
          backdrop-filter: blur(24px);
        }

        .intro-panel {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 48px;
          gap: 24px;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 64, 175, 0.9));
          overflow: hidden;
        }

        .orb {
          position: absolute;
          border-radius: 999px;
          filter: blur(10px);
          opacity: 0.45;
        }

        .orb-one {
          width: 260px;
          height: 260px;
          background: #38bdf8;
          top: -70px;
          right: -80px;
        }

        .orb-two {
          width: 220px;
          height: 220px;
          background: #818cf8;
          bottom: -70px;
          left: -50px;
        }

        .intro-copy {
          position: relative;
          z-index: 1;
          max-width: 420px;
        }

        .eyebrow {
          margin: 0 0 8px;
          text-transform: uppercase;
          letter-spacing: 0.35em;
          font-size: 0.8rem;
          font-weight: 700;
          color: #93c5fd;
        }

        .intro-title {
          margin: 0 0 10px;
          font-size: clamp(1.8rem, 3vw, 2.6rem);
          font-weight: 700;
        }

        .intro-text {
          margin: 0;
          font-size: 1rem;
          line-height: 1.7;
          color: rgba(248, 250, 252, 0.8);
        }

        .form-panel {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          background: rgba(2, 6, 23, 0.5);
        }

        .form-box {
          width: 100%;
          max-width: 380px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .title {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 6px;
        }

        .subtitle {
          font-size: 0.95rem;
          color: rgba(226, 232, 240, 0.7);
          margin-bottom: 16px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 8px;
          color: #e2e8f0;
          font-size: 0.92rem;
        }

        .input {
          width: 100%;
          padding: 13px 14px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(15, 23, 42, 0.8);
          color: #f8fafc;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .input:focus {
          border-color: #60a5fa;
          box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
        }

        .btn {
          width: 100%;
          padding: 13px 16px;
          margin-top: 8px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(90deg, #6366f1, #22d3ee);
          color: white;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 12px 30px rgba(34, 211, 238, 0.2);
        }

        .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 16px 35px rgba(34, 211, 238, 0.26);
        }

        .face {
          width: 132px;
          height: 132px;
          margin-top: 8px;
          position: relative;
          z-index: 1;
        }

        .eye {
          position: absolute;
          width: 16px;
          height: 16px;
          background: white;
          border-radius: 50%;
          top: 48px;
        }

        .eye.left { left: 38px; }
        .eye.right { right: 38px; }

        .pupil {
          width: 7px;
          height: 7px;
          background: #0f172a;
          border-radius: 50%;
          position: absolute;
          top: 4px;
          left: 4px;
          transition: 0.1s ease-out;
        }

        .mouth {
          width: 46px;
          height: 22px;
          border-bottom: 3px solid white;
          border-radius: 0 0 42px 42px;
          position: absolute;
          bottom: 22px;
          left: 50%;
          transform: translateX(-50%);
        }

        .hands {
          position: absolute;
          top: 42px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 42px;
        }

        .hand {
          width: 32px;
          height: 54px;
          background: #fbbf24;
          border-radius: 20px;
          transition: 0.3s ease;
        }

        .cover .hand {
          transform: translateY(-18px) rotate(20deg);
        }

        @media (max-width: 860px) {
          .login-card {
            grid-template-columns: 1fr;
          }

          .intro-panel {
            padding: 32px 24px 24px;
            min-height: 320px;
          }

          .form-panel {
            padding: 24px;
          }
        }
      `}</style>

      <div className="login-card">
        <div className="intro-panel">
          <div className="orb orb-one" />
          <div className="orb orb-two" />

          <div className="intro-copy">
            <p className="eyebrow">SRYTAL</p>
            <h1 className="intro-title">Work smarter with a calmer workspace</h1>
            <p className="intro-text">
              Keep your team aligned, monitor tasks, and stay on top of every update from one
              elegant dashboard.
            </p>
          </div>

          <div className={`face ${focusPassword ? 'cover' : ''}`}>
            <div className="eye left">
              <div className="pupil" style={{ transform: `translate(${eye.x}px, ${eye.y}px)` }} />
            </div>

            <div className="eye right">
              <div className="pupil" style={{ transform: `translate(${eye.x}px, ${eye.y}px)` }} />
            </div>

            <div className="mouth" />

            <div className="hands">
              <div className="hand" />
              <div className="hand" />
            </div>
          </div>
        </div>

        <div className="form-panel">
          <div className="form-box">
            <div className="title">Sign in</div>
            <div className="subtitle">Use your credentials to continue</div>

            <label className="field">
              <span>Username or email</span>
              <input
                className="input"
                placeholder="Enter your username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </label>

            <label className="field">
              <span>Password</span>
              <input
                className="input"
                type="password"
                placeholder="Enter your password"
                onFocus={() => setFocusPassword(true)}
                onBlur={() => setFocusPassword(false)}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </label>

            <button className="btn">Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}
