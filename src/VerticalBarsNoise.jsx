// src/VerticalBarsNoise.jsx
import React, { useEffect, useRef, useCallback } from "react";

const hexToRgb = (hex) => {
  const cleanHex = hex.charAt(0) === "#" ? hex.substring(1) : hex;
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return { r, g, b };
};

const VerticalBarsNoise = ({
  backgroundColor = "#F0EEE6",
  lineColor = "#444",
  barColor = "#000000",
  lineWidth = 1,
  animationSpeed = 0.0005,
  removeWaveLine = true,
}) => {
  const canvasRef = useRef(null);
  const timeRef = useRef(0);
  const animationFrameId = useRef(null);
  const lastRenderTime = useRef(0); // FPS kontrolü için
  const mouseRef = useRef({ x: 0, y: 0, isDown: false });
  const ripples = useRef([]);
  // dprRef artık sabit 1 olarak düşünülecek, ref tutmaya gerek kalmayabilir ama yapıyı bozmuyoruz.
  const dprRef = useRef(1);

  // FPS LIMIT AYARI: 30 FPS (1000ms / 30 = ~33.3ms)
  const FPS_LIMIT = 30;
  const INTERVAL = 1000 / FPS_LIMIT;

  const noise = (x, y, t) => {
    return (
      (Math.sin(x * 0.01 + t) * Math.cos(y * 0.01 + t) +
        Math.sin(x * 0.015 - t) * Math.cos(y * 0.005 + t) +
        1) /
      2
    );
  };

  const getMouseInfluence = (x, y) => {
    const dx = x - mouseRef.current.x;
    const dy = y - mouseRef.current.y;
    // OPTİMİZASYON: Math.sqrt kaldırılarak kare mesafe kontrolü yapıldı
    const distSq = dx * dx + dy * dy;
    const maxDistSq = 200 * 200; // 40,000

    if (distSq > maxDistSq) return 0;
    return 1 - Math.sqrt(distSq) / 200; // Sadece etki alanındaysa sqrt al
  };

  const getRippleInfluence = (x, y, currentTime) => {
    let totalInfluence = 0;
    ripples.current.forEach((ripple) => {
      const age = currentTime - ripple.time;
      const maxAge = 2000;
      if (age < maxAge) {
        const dx = x - ripple.x;
        const dy = y - ripple.y;
        // OPTİMİZASYON: Kare mesafe ile ön eleme
        const distSq = dx * dx + dy * dy;
        const rippleRadius = (age / maxAge) * 300;
        const rippleWidth = 50;

        // Kabaca bir kontrol: Eğer nokta ripple'ın çok uzağındaysa detaylı hesaplama yapma
        // (Bu kısım çok kritik değil ama milisaniye kazandırır)
        const approxDist = Math.sqrt(distSq);

        if (Math.abs(approxDist - rippleRadius) < rippleWidth) {
          const rippleStrength = (1 - age / maxAge) * ripple.intensity;
          const proximityToRipple =
            1 - Math.abs(approxDist - rippleRadius) / rippleWidth;
          totalInfluence += rippleStrength * proximityToRipple;
        }
      }
    });
    return Math.min(totalInfluence, 2);
  };

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // OPTİMİZASYON KRİTİK NOKTA:
    // Retina ekranlarda dahi dpr'yi 1'e sabitliyoruz.
    // Gürültü efekti olduğu için yüksek çözünürlüğe gerek yok, performans artışı muazzam.
    const dpr = 1;
    dprRef.current = dpr;

    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;

    canvas.style.width = displayWidth + "px";
    canvas.style.height = displayHeight + "px";

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
      // Canvas çizim optimizasyonu için
      ctx.imageSmoothingEnabled = false;
    }
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

    const now = Date.now();
    ripples.current = ripples.current.filter((r) => now - r.time < 2000);
  }, []);

  const handleMouseUp = useCallback(() => {
    mouseRef.current.isDown = false;
  }, []);

  const animate = useCallback(() => {
    // Döngü devam etsin
    animationFrameId.current = requestAnimationFrame(animate);

    const now = Date.now();
    const elapsed = now - lastRenderTime.current;

    // OPTİMİZASYON: FPS CAP
    // Eğer geçen süre hedeflenen FPS aralığından azsa çizim yapmadan çık.
    if (elapsed < INTERVAL) return;

    lastRenderTime.current = now - (elapsed % INTERVAL);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    timeRef.current += animationSpeed; // Hızı FPS düşüşüne göre dengelemek gerekebilir ama noise için fark etmez.
    const currentTime = Date.now();

    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;

    // Satır aralığı
    const numLines = Math.floor(canvasHeight / 15);
    const lineSpacing = canvasHeight / numLines;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const lineRgb = hexToRgb(lineColor);
    const barRgb = hexToRgb(barColor);

    // Dış döngü (Y ekseni)
    for (let i = 0; i < numLines; i++) {
      const y = i * lineSpacing + lineSpacing / 2;

      // Mouse Y ekseninde çok uzaktaysa satırı komple pas geçmek mümkün mü?
      // Hayır, çünkü noise her yerde var. Devam ediyoruz.

      const mouseInfluence = getMouseInfluence(canvasWidth / 2, y);

      const lineAlpha =
        mouseInfluence > 0 ? Math.max(0.3, 0.3 + mouseInfluence * 0.7) : 0.3;

      ctx.beginPath();
      ctx.strokeStyle = `rgba(${lineRgb.r}, ${lineRgb.g}, ${lineRgb.b}, ${lineAlpha})`;
      ctx.lineWidth = lineWidth + mouseInfluence * 2;
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();

      // İç döngü (X ekseni)
      // x adımını 18'de bıraktık, performans için iyi.
      for (let x = 0; x < canvasWidth; x += 18) {
        // Mouse ve Ripple hesapları
        // getMouseInfluence fonksiyonu artık daha optimize
        const mouseInfl = getMouseInfluence(x, y);
        const rippleInfl =
          ripples.current.length > 0
            ? getRippleInfluence(x, y, currentTime)
            : 0;

        const totalInfluence = mouseInfl + rippleInfl;

        // Gürültü eşiğini hesapla
        // Eğer hiçbir etkileşim yoksa, noise fonksiyonunu çağırmadan önce
        // çok basit bir Math.random kontrolü ile yükü azaltabiliriz ama
        // tutarlılık için noise fonksiyonunu çağırıyoruz.
        const noiseVal = noise(x, y, timeRef.current);

        const threshold = Math.max(
          0.2,
          0.5 - mouseInfl * 0.2 - Math.abs(rippleInfl) * 0.1,
        );

        if (noiseVal > threshold) {
          // Değerleri hesapla
          const barWidth = 7 + noiseVal * 10 + totalInfluence * 5;
          const barHeight = 3.5 + noiseVal * 3 + totalInfluence * 3;

          const baseAnimation =
            Math.sin(timeRef.current + y * 0.0375) * 20 * noiseVal;

          const mouseAnimation = mouseRef.current.isDown
            ? Math.sin(timeRef.current * 3 + x * 0.01) * 10 * mouseInfl
            : 0;

          const rippleAnimation =
            rippleInfl * Math.sin(timeRef.current * 2 + x * 0.02) * 15;

          const animatedX =
            x + baseAnimation + mouseAnimation + rippleAnimation;

          const intensity = Math.min(
            1,
            Math.max(0.7, 0.7 + totalInfluence * 0.3),
          );

          // ÇİZİM
          // fillStyle string birleştirme işlemi maliyetlidir ama mecburuz.
          ctx.fillStyle = `rgba(${barRgb.r}, ${barRgb.g}, ${barRgb.b}, ${intensity})`;

          // Math.floor kullanarak anti-aliasing'i azaltıp performansı artırabiliriz
          ctx.fillRect(
            Math.floor(animatedX - barWidth / 2),
            Math.floor(y - barHeight / 2),
            Math.floor(barWidth),
            Math.floor(barHeight),
          );
        }
      }
    }

    if (!removeWaveLine && ripples.current.length > 0) {
      // Ripple kodu
    }
  }, [
    backgroundColor,
    lineColor,
    removeWaveLine,
    barColor,
    lineWidth,
    animationSpeed,
    INTERVAL, // Dependency'e eklendi
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    resizeCanvas();
    const handleResize = () => resizeCanvas();

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    // Animasyonu başlat
    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
    };
  }, [animate, resizeCanvas, handleMouseMove, handleMouseDown, handleMouseUp]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

export default VerticalBarsNoise;
