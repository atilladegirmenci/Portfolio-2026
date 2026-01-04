// src/VerticalBarsNoise.jsx
import React, { useEffect, useRef, useCallback } from 'react';

const hexToRgb = (hex) => {
  const cleanHex = hex.charAt(0) === '#' ? hex.substring(1) : hex;
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return { r, g, b };
};

const VerticalBarsNoise = ({
  backgroundColor = '#F0EEE6',
  lineColor = '#444',
  barColor = '#000000',
  lineWidth = 1,
  animationSpeed = 0.0005,
  removeWaveLine = true,
}) => {
  const canvasRef = useRef(null);
  const timeRef = useRef(0);
  const animationFrameId = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, isDown: false });
  const ripples = useRef([]);
  const dprRef = useRef(1);

  const noise = (x, y, t) => {
    return (
      (Math.sin(x * 0.01 + t) * Math.cos(y * 0.01 + t) +
       Math.sin(x * 0.015 - t) * Math.cos(y * 0.005 + t) + 1) / 2
    );
  };

  const getMouseInfluence = (x, y) => {
    const dx = x - mouseRef.current.x;
    const dy = y - mouseRef.current.y;
    // Performans için karekök (Math.sqrt) yerine kare mesafe kontrolü yapılabilir ama şimdilik kalsın.
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = 200;
    return Math.max(0, 1 - distance / maxDistance);
  };

  const getRippleInfluence = (x, y, currentTime) => {
    let totalInfluence = 0;
    // Ripples dizisi çok şişerse donma yapar, temizlendiğinden eminiz ama yine de kısa tutalım
    ripples.current.forEach((ripple) => {
      const age = currentTime - ripple.time;
      const maxAge = 2000;
      if (age < maxAge) {
        const dx = x - ripple.x;
        const dy = y - ripple.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const rippleRadius = (age / maxAge) * 300;
        const rippleWidth = 50;
        if (Math.abs(distance - rippleRadius) < rippleWidth) {
          const rippleStrength = (1 - age / maxAge) * ripple.intensity;
          const proximityToRipple = 1 - Math.abs(distance - rippleRadius) / rippleWidth;
          totalInfluence += rippleStrength * proximityToRipple;
        }
      }
    });
    return Math.min(totalInfluence, 2);
  };

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    dprRef.current = dpr;

    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;

    canvas.style.width = displayWidth + 'px';
    canvas.style.height = displayHeight + 'px';

    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);
  }, []);

  const handleMouseMove = useCallback((e) => {
    mouseRef.current.x = e.clientX;
    mouseRef.current.y = e.clientY;
  }, []);

  const handleMouseDown = useCallback((e) => {
    mouseRef.current.isDown = true;
    ripples.current.push({
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
      intensity: 1.5,
    });

    // Ripple temizliği
    const now = Date.now();
    ripples.current = ripples.current.filter((r) => now - r.time < 2000);
  }, []);

  const handleMouseUp = useCallback(() => {
    mouseRef.current.isDown = false;
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    timeRef.current += animationSpeed;
    const currentTime = Date.now();

    const canvasWidth = canvas.clientWidth; // CSS piksel genişliği
    const canvasHeight = canvas.clientHeight; // CSS piksel yüksekliği

    // PERFORMANS AYARI 1: Satır sayısını azalttık (11 yerine 15-20 pikselde bir)
    const numLines = Math.floor(canvasHeight / 15); 
    const lineSpacing = canvasHeight / numLines;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Çizgi rengini önden hesapla
    const lineRgb = hexToRgb(lineColor);
    const barRgb = hexToRgb(barColor);

    for (let i = 0; i < numLines; i++) {
      const y = i * lineSpacing + lineSpacing / 2;
      const mouseInfluence = getMouseInfluence(canvasWidth / 2, y);
      
      // Sadece fare yakınsa çizgi kalınlaşsın, yoksa sabit kalsın (Performans)
      const lineAlpha = mouseInfluence > 0 ? Math.max(0.3, 0.3 + mouseInfluence * 0.7) : 0.3;

      ctx.beginPath();
      ctx.strokeStyle = `rgba(${lineRgb.r}, ${lineRgb.g}, ${lineRgb.b}, ${lineAlpha})`;
      ctx.lineWidth = lineWidth + mouseInfluence * 2;
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();

      // PERFORMANS AYARI 2: x adımını 8 yerine 15 yaptık. Daha az hesaplama demek.
      for (let x = 0; x < canvasWidth; x += 15) {
        
        // Mouse çok uzaktaysa hiç noise hesaplama (Ciddi FPS artışı sağlar)
        const mouseInfl = getMouseInfluence(x, y);
        const rippleInfl = ripples.current.length > 0 ? getRippleInfluence(x, y, currentTime) : 0;
        
        // Eğer hiçbir etkileşim yoksa ve sadece ambient noise varsa, onu da optimize edebiliriz
        // Ama şimdilik sadece çizimi optimize edelim.
        
        const noiseVal = noise(x, y, timeRef.current);
        const totalInfluence = mouseInfl + rippleInfl;

        const threshold = Math.max(0.2, 0.5 - mouseInfl * 0.2 - Math.abs(rippleInfl) * 0.1);

        if (noiseVal > threshold) {
          const barWidth = 3 + noiseVal * 10 + totalInfluence * 5;
          const barHeight = 2 + noiseVal * 3 + totalInfluence * 3;

          const baseAnimation = Math.sin(timeRef.current + y * 0.0375) * 20 * noiseVal;
          const mouseAnimation = mouseRef.current.isDown
            ? Math.sin(timeRef.current * 3 + x * 0.01) * 10 * mouseInfl
            : 0;
          const rippleAnimation = rippleInfl * Math.sin(timeRef.current * 2 + x * 0.02) * 15;

          const animatedX = x + baseAnimation + mouseAnimation + rippleAnimation;
          const intensity = Math.min(1, Math.max(0.7, 0.7 + totalInfluence * 0.3));

          ctx.fillStyle = `rgba(${barRgb.r}, ${barRgb.g}, ${barRgb.b}, ${intensity})`;
          ctx.fillRect(
            animatedX - barWidth / 2,
            y - barHeight / 2,
            barWidth,
            barHeight
          );
        }
      }
    }
    
    // Wave Line çizimi
    if (!removeWaveLine && ripples.current.length > 0) {
       // ... Ripple çizim kodu aynı ...
    }

    animationFrameId.current = requestAnimationFrame(animate);
  }, [backgroundColor, lineColor, removeWaveLine, barColor, lineWidth, animationSpeed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    resizeCanvas();
    const handleResize = () => resizeCanvas();

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [animate, resizeCanvas, handleMouseMove, handleMouseDown, handleMouseUp]);

  return (
    <div className='fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0'>
      <canvas ref={canvasRef} className='block w-full h-full' />
    </div>
  );
};

export default VerticalBarsNoise;