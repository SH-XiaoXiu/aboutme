import { useEffect, useRef, useState } from 'react';

/**
 * 双层光标：
 * - 内层：小号实点（即时跟手），用 mix-blend-difference 与深底形成反色
 * - 外层：柔和光晕（惯性滞后 0.12，暖青铜调）
 * 链接/按钮上悬停时内层放大 + 外层收缩（聚焦效果）
 */
export default function CursorGlow() {
  const innerRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const inner = innerRef.current;
    const halo = haloRef.current;
    if (!inner || !halo) return;

    let raf = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    // 内层几乎实时，外层滞后
    let ix = tx, iy = ty;
    let hx = tx, hy = ty;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      setHidden(false);
    };

    const onLeave = () => setHidden(true);

    // 判定指针是否在可交互元素上
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const interactive = t.closest('a, button, [role="button"], label, input, textarea, select');
      setHover(!!interactive);
    };

    const tick = () => {
      ix += (tx - ix) * 0.35;
      iy += (ty - iy) * 0.35;
      hx += (tx - hx) * 0.12;
      hy += (ty - hy) * 0.12;
      inner.style.transform = `translate(${ix}px, ${iy}px) translate(-50%, -50%)`;
      halo.style.transform = `translate(${hx}px, ${hy}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    document.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* 外层暖铜光晕 */}
      <div
        ref={haloRef}
        aria-hidden
        className="hidden md:block pointer-events-none fixed top-0 left-0 z-[60]"
        style={{
          width: hover ? 90 : 180,
          height: hover ? 90 : 180,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(160, 129, 96, 0.18) 0%, rgba(125, 101, 64, 0.06) 40%, transparent 70%)',
          filter: 'blur(14px)',
          mixBlendMode: 'screen',
          opacity: hidden ? 0 : 1,
          transition:
            'width 0.45s cubic-bezier(0.16,1,0.3,1), height 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.3s',
        }}
      />
      {/* 内层实点 */}
      <div
        ref={innerRef}
        aria-hidden
        className="hidden md:block pointer-events-none fixed top-0 left-0 z-[61]"
        style={{
          width: hover ? 26 : 8,
          height: hover ? 26 : 8,
          borderRadius: '50%',
          border: hover ? '1px solid rgba(248,246,241,0.9)' : 'none',
          background: hover ? 'transparent' : 'rgba(248,246,241,0.95)',
          mixBlendMode: 'difference',
          opacity: hidden ? 0 : 1,
          transition:
            'width 0.35s cubic-bezier(0.16,1,0.3,1), height 0.35s cubic-bezier(0.16,1,0.3,1), background 0.3s, border 0.3s, opacity 0.3s',
        }}
      />
    </>
  );
}
