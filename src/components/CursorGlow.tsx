import { useEffect, useRef, useState } from 'react';

/**
 * 双层光标 — 颜色完全由 CSS 变量驱动，主题切换时平滑过渡。
 * 暗色: 米白 difference 混合 + 铜晕 screen
 * 亮色: 深墨 normal 混合 + 水墨青晕 multiply
 */
export default function CursorGlow() {
  const innerRef = useRef<HTMLDivElement>(null);
  const haloRef  = useRef<HTMLDivElement>(null);
  const [hover, setHover]   = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const inner = innerRef.current;
    const halo  = haloRef.current;
    if (!inner || !halo) return;

    let raf = 0;
    let tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    let ix = tx, iy = ty, hx = tx, hy = ty;

    const onMove  = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; setHidden(false); };
    const onLeave = () => setHidden(true);
    const onOver  = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      setHover(!!t?.closest('a, button, [role="button"], label, input, textarea, select'));
    };

    const tick = () => {
      ix += (tx - ix) * 0.35;
      iy += (ty - iy) * 0.35;
      hx += (tx - hx) * 0.12;
      hy += (ty - hy) * 0.12;
      inner.style.transform = `translate(${ix}px, ${iy}px) translate(-50%, -50%)`;
      halo.style.transform  = `translate(${hx}px, ${hy}px) translate(-50%, -50%)`;
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
      {/* 外层光晕 — CSS vars handle dark/light colors */}
      <div
        ref={haloRef}
        aria-hidden
        className="hidden md:block pointer-events-none fixed top-0 left-0 z-[60]"
        style={{
          width:  hover ? 90 : 180,
          height: hover ? 90 : 180,
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--cur-halo-stop1) 0%, var(--cur-halo-stop2) 40%, transparent 70%)',
          filter: 'blur(14px)',
          mixBlendMode: 'var(--cur-halo-blend)' as React.CSSProperties['mixBlendMode'],
          opacity: hidden ? 0 : 'var(--cur-halo-opacity)' as unknown as number,
          transition:
            'width 0.45s cubic-bezier(0.16,1,0.3,1), height 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.6s',
        }}
      />
      {/* 内层实点 */}
      <div
        ref={innerRef}
        aria-hidden
        className="hidden md:block pointer-events-none fixed top-0 left-0 z-[61]"
        style={{
          width:  hover ? 26 : 8,
          height: hover ? 26 : 8,
          borderRadius: '50%',
          border:     hover ? '1px solid var(--cur-border)' : 'none',
          background: hover ? 'transparent' : 'var(--cur-inner)',
          mixBlendMode: 'var(--cur-blend)' as React.CSSProperties['mixBlendMode'],
          opacity: hidden ? 0 : 1,
          transition:
            'width 0.35s cubic-bezier(0.16,1,0.3,1), height 0.35s cubic-bezier(0.16,1,0.3,1), background 0.6s, border 0.6s, opacity 0.3s',
        }}
      />
    </>
  );
}
