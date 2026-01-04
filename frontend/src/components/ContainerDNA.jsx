import { useRef, useEffect } from "react";

/* ---------- Deterministic hash ---------- */
function hashToFloat(str, min = 0, max = 1) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i);
  }
  const n = Math.abs(h % 1000) / 1000;
  return min + n * (max - min);
}

export default function ContainerDNA({ metadata }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const dpr = window.devicePixelRatio || 1;
    const size = 240;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const center = size / 2;

    /* ---------- DNA VECTOR (REAL LOGIC) ---------- */
    const dna = {
      radius: hashToFloat(metadata.imageHash || "", 60, 90),
      spikes: Math.floor(hashToFloat(metadata.version || "1", 6, 12)),
      distortion: hashToFloat(metadata.description || "", 0.05, 0.25),
      pulseSpeed: hashToFloat(metadata.containerName || "", 0.005, 0.02),
      glow: hashToFloat(String(metadata.trustScore || 0.6), 0.4, 1),
    };

    let t = 0;

    function draw() {
      ctx.clearRect(0, 0, size, size);

      t += dna.pulseSpeed;

      const pulse = 1 + Math.sin(t) * 0.05;
      const radius = dna.radius * pulse;

      ctx.beginPath();

      for (let i = 0; i <= dna.spikes; i++) {
        const angle = (i / dna.spikes) * Math.PI * 2;
        const noise =
          Math.sin(angle * 3 + t) * dna.distortion * radius;
        const r = radius + noise;

        const x = center + Math.cos(angle) * r;
        const y = center + Math.sin(angle) * r;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.closePath();

      /* ---------- GLOW ---------- */
      ctx.shadowBlur = 20 * dna.glow;
      ctx.shadowColor = `rgba(56,189,248,${dna.glow})`;

      ctx.strokeStyle = "rgba(56,189,248,0.9)";
      ctx.lineWidth = 2;
      ctx.stroke();

      animationRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => cancelAnimationFrame(animationRef.current);
  }, [metadata]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        background: "radial-gradient(circle at center, #020617, #000)",
        borderRadius: "12px",
      }}
    />
  );
}
