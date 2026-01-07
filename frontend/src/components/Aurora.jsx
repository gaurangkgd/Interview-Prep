import React, { useEffect, useRef } from 'react';

// Lightweight Aurora-style animated background using CSS variables and keyframes
export default function Aurora({
  speed = 20,
  opacity = 0.6,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--aurora-opacity', String(opacity));
    // Faster animation (6s instead of 10s)
    el.style.setProperty('--aurora-speed', '6s');
    el.style.setProperty('--aurora-blur', '120px');
    el.style.setProperty('--aurora-contrast', '1.25');
    el.style.setProperty('--aurora-saturate', '1.5');
  }, [speed, opacity]);

  return (
    <div
      ref={ref}
      className="absolute inset-0 -z-10"
      style={{
        backgroundColor: '#0b1220',
      }}
    >
      <div className="aurora-layer" />
      <style>{`
        .aurora-layer {
          position: absolute;
          inset: 0;
          filter: blur(var(--aurora-blur,120px)) contrast(var(--aurora-contrast,1.25)) saturate(var(--aurora-saturate,1.5));
          opacity: var(--aurora-opacity, 0.8);
          background:
            radial-gradient(1600px 900px at 10% 10%, rgba(58,41,255,0.45), transparent 70%),
            radial-gradient(1200px 700px at 80% 20%, rgba(255,148,180,0.40), transparent 70%),
            radial-gradient(1400px 800px at 20% 80%, rgba(255,50,50,0.35), transparent 70%),
            radial-gradient(1200px 600px at 85% 75%, rgba(0,255,255,0.25), transparent 70%);
          animation: aurora-move var(--aurora-speed, 10s) linear infinite alternate;
        }

        @keyframes aurora-move {
          0% {
            background-position:
              0% 0%,
              100% 0%,
              0% 100%,
              100% 100%;
          }
          50% {
            background-position:
              50% 40%,
              60% 80%,
              80% 60%,
              40% 90%;
          }
          100% {
            background-position:
              20% 80%,
              80% 20%,
              60% 90%,
              90% 60%;
          }
        }
      `}</style>
    </div>
  );
}
