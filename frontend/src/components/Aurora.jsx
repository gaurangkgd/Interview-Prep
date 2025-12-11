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
    el.style.setProperty('--aurora-speed', `${speed}s`);
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
          filter: blur(60px) contrast(1.05) saturate(1.2);
          opacity: var(--aurora-opacity, 0.6);
          background:
            radial-gradient(1200px 600px at 10% 10%, rgba(255, 0, 128, 0.35), transparent 60%),
            radial-gradient(800px 400px at 80% 20%, rgba(0, 200, 255, 0.35), transparent 60%),
            radial-gradient(1000px 500px at 20% 80%, rgba(160, 255, 120, 0.30), transparent 60%),
            radial-gradient(900px 450px at 85% 75%, rgba(255, 200, 80, 0.25), transparent 60%);
          animation: aurora-move var(--aurora-speed, 20s) linear infinite alternate;
        }

        @keyframes aurora-move {
          0% {
            background-position:
              10% 10%,
              80% 20%,
              20% 80%,
              85% 75%;
          }
          50% {
            background-position:
              20% 25%,
              70% 35%,
              30% 65%,
              75% 60%;
          }
          100% {
            background-position:
              15% 20%,
              75% 15%,
              25% 85%,
              90% 70%;
          }
        }
      `}</style>
    </div>
  );
}
