import { useEffect, useRef, useState, type ReactNode } from 'react';

/* ============ 1. DecryptedText ============
   文字从随机乱码解密出来（Matrix 风），支持 mount 和 scramble-on-hover。
*/
const CHARSET = '!<>-_\\/[]{}—=+*^?#01アイウエオサシスセソタチツテト';

export function DecryptedText({
  text,
  className = '',
  speed = 40,
  iterations = 12,
  trigger = 'mount',
}: {
  text: string;
  className?: string;
  speed?: number;
  iterations?: number;
  trigger?: 'mount' | 'view';
}) {
  const [out, setOut] = useState('');
  const [started, setStarted] = useState(trigger === 'mount');
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (trigger !== 'view') return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (es) => {
        if (es[0].isIntersecting) {
          setStarted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [trigger]);

  useEffect(() => {
    if (!started) return;
    let frame = 0;
    const maxFrames = text.length + iterations;
    const id = setInterval(() => {
      frame++;
      let next = '';
      for (let i = 0; i < text.length; i++) {
        if (frame - iterations > i) {
          next += text[i];
        } else if (frame > i) {
          next += CHARSET[Math.floor(Math.random() * CHARSET.length)];
        } else {
          next += ' ';
        }
      }
      setOut(next);
      if (frame >= maxFrames) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [started, text, iterations, speed]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {out || (started ? '' : text.replace(/./g, ' '))}
    </span>
  );
}

/* ============ 2. VariableProximity ============
   鼠标靠近时字符变粗/变大——需要可变字重的字体效果。
   这里用 transform scale + opacity 模拟 weight 变化（无需 variable font）。
*/
export function VariableProximity({
  text,
  className = '',
  radius = 180,
}: {
  text: string;
  className?: string;
  radius?: number;
}) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let raf = 0;
    let mx = -9999;
    let my = -9999;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    const onLeave = () => {
      mx = -9999;
      my = -9999;
    };

    const tick = () => {
      charRefs.current.forEach((el) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = mx - cx;
        const dy = my - cy;
        const d = Math.sqrt(dx * dx + dy * dy);
        const t = Math.max(0, 1 - d / radius);
        const scale = 1 + t * 0.22;
        const translateY = -t * 5;
        const weight = 300 + t * 400;
        el.style.transform = `translateY(${translateY}px) scale(${scale})`;
        el.style.fontWeight = String(weight);
        el.style.opacity = String(0.75 + t * 0.25);
      });
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, [radius]);

  return (
    <span ref={containerRef} className={className}>
      {Array.from(text).map((c, i) => (
        <span
          key={i}
          ref={(el) => (charRefs.current[i] = el)}
          style={{
            display: 'inline-block',
            transition: 'color 0.2s, font-weight 0.2s',
            willChange: 'transform, font-weight',
          }}
        >
          {c === ' ' ? '\u00A0' : c}
        </span>
      ))}
    </span>
  );
}

/* ============ 3. ShinyText ============
   金属扫光效果，持续循环。
*/
export function ShinyText({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-block bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage:
          'linear-gradient(110deg, rgba(232,226,210,0.55) 40%, rgba(248,246,241,1) 50%, rgba(232,226,210,0.55) 60%)',
        backgroundSize: '300% 100%',
        animation: 'shine 6s ease-in-out infinite',
      }}
    >
      {children}
      <style>{`
        @keyframes shine {
          0% { background-position: 150% center; }
          100% { background-position: -50% center; }
        }
      `}</style>
    </span>
  );
}

/* ============ 4. GradientText ============
   动画渐变色文字 */
export function GradientText({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-block bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: 'linear-gradient(120deg, #f8f6f1, #ddd5c5, #f8f6f1)',
        backgroundSize: '300% auto',
        animation: 'grad 12s linear infinite',
      }}
    >
      {children}
      <style>{`@keyframes grad { 0% { background-position: 0% center; } 100% { background-position: 300% center; } }`}</style>
    </span>
  );
}
