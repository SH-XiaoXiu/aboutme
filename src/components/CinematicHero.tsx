import { useEffect, useRef, useState } from 'react';
import FluidBackdrop from './FluidBackdrop';
import InteractiveParticles from './InteractiveParticles';
import { DecryptedText, VariableProximity } from './FancyText';
import { basic } from '../data/resume';

export default function CinematicHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      setProgress(Math.min(1, scrolled / total));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -((e.clientY / window.innerHeight) * 2 - 1);
      setMouse({ x, y });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // 3 acts over 300vh
  const actCount = 3;
  const rawIdx = progress * (actCount - 1);
  const act = Math.min(actCount - 1, Math.floor(rawIdx));

  // Act 1 — "About Me" title zoom through
  const titleScale = 1 + progress * 1.8;
  const titleOpacity = 1 - Math.max(0, (progress - 0.33) * 2.5);

  // Act 2 — quote
  const quoteOpacity =
    progress < 0.33 ? 0 : progress < 0.66 ? (progress - 0.33) * 3 : 1 - (progress - 0.66) * 3;
  const quoteScale = 0.92 + (progress - 0.33) * 0.35;

  // Act 3 — "Hi, I'm XiaoXiu."
  const finalOpacity = progress < 0.66 ? 0 : Math.min(1, (progress - 0.66) * 3.5);
  const finalY = (1 - Math.min(1, (progress - 0.66) * 3.5)) * 60;

  // letterbox bars appearance
  const barsHeight = Math.min(60, progress * 120);

  return (
    <section
      ref={sectionRef}
      className="relative bg-black text-ink-50"
      style={{ height: `${actCount * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Shader backdrop */}
        <div className="absolute inset-0">
          <FluidBackdrop />
        </div>

        {/* Interactive particles layer */}
        <div className="absolute inset-0 pointer-events-none">
          <InteractiveParticles mouse={mouse} />
        </div>

        {/* letterbox bars - cinematic crop */}
        <div
          className="pointer-events-none absolute top-0 left-0 right-0 bg-black z-40 transition-[height] duration-500"
          style={{ height: `${barsHeight}px` }}
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 bg-black z-40 transition-[height] duration-500"
          style={{ height: `${barsHeight}px` }}
        />

        {/* corner meta */}
        <div className="absolute top-6 left-8 md:left-20 text-[10px] tracking-[0.4em] text-ink-400/70 uppercase z-30 font-mono">
          ▸ REC · Portfolio / MMXXVI
        </div>
        <div className="absolute top-6 right-8 md:right-20 text-[10px] tracking-[0.4em] text-ink-400/70 uppercase z-30 font-mono">
          {basic.location} · 22.5°N 114.1°E
        </div>

        {/* ACT 1 — XiaoXiu eyebrow + "About Me" big title */}
        <div
          className="absolute inset-0 flex items-center justify-center px-4 z-20"
          style={{
            opacity: ready ? titleOpacity : 0,
            transform: `scale(${titleScale})`,
            transition: ready ? 'opacity 0.3s' : 'none',
          }}
        >
          <div className="relative text-center">
            <div className="font-serif text-2xl md:text-4xl italic text-ink-200/80 mb-6 md:mb-10 tracking-wide">
              <DecryptedText text="XiaoXiu" speed={45} />
            </div>
            <h1
              className="font-serif leading-[0.82] tracking-tighter cursor-default select-none text-ink-50"
              style={{
                fontSize: 'clamp(5rem, 20vw, 20rem)',
                letterSpacing: '-0.04em',
                filter: 'drop-shadow(0 0 40px rgba(248,246,241,0.1))',
                fontWeight: 400,
              }}
            >
              <VariableProximity text="About Me" radius={220} />
            </h1>
            <div className="mt-8 md:mt-12 text-[10px] md:text-xs text-ink-200/50 tracking-[0.5em] uppercase font-mono">
              —— about me ——
            </div>

            <div className="mt-8 md:mt-10 flex items-center justify-center gap-x-8 gap-y-3 flex-wrap">
              <a
                href="https://www.xiuxius.cn"
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="group/link flex items-center gap-2 font-mono text-[11px] tracking-[0.3em] text-ink-200/70 hover:text-ink-50 transition-colors"
              >
                <span className="inline-block w-4 h-px bg-current transition-all duration-300 group-hover/link:w-7" />
                <span>BLOG</span>
                <span className="transition-transform duration-300 group-hover/link:translate-x-1">↗</span>
              </a>
              <a
                href="https://github.com/sh-xiaoxiu"
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="group/link flex items-center gap-2 font-mono text-[11px] tracking-[0.3em] text-ink-200/70 hover:text-ink-50 transition-colors"
              >
                <span className="inline-block w-4 h-px bg-current transition-all duration-300 group-hover/link:w-7" />
                <span>GITHUB</span>
                <span className="transition-transform duration-300 group-hover/link:translate-x-1">↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* ACT 2 — classical quote */}
        <div
          className="absolute inset-0 flex items-center justify-center px-8 md:px-20 z-20"
          style={{
            opacity: quoteOpacity,
            transform: `scale(${quoteScale})`,
            pointerEvents: act === 1 ? 'auto' : 'none',
          }}
        >
          <div className="relative max-w-5xl text-center">
            <div
              className="font-serif text-ink-50 leading-[1.3] tracking-wide"
              style={{ fontSize: 'clamp(1.8rem, 5.5vw, 5rem)' }}
            >
              <div className="mb-4">钱塘江上潮信来，</div>
              <div className="italic text-ink-200/80">今日方知我是我。</div>
            </div>
          </div>
        </div>

        {/* ACT 3 — Portrait + "Hi, I'm XiaoXiu." */}
        <div
          className="absolute inset-0 flex items-center px-8 md:px-20 z-20"
          style={{
            opacity: finalOpacity,
            transform: `translateY(${finalY}px)`,
            pointerEvents: act === 2 ? 'auto' : 'none',
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-20 items-center w-full max-w-7xl mx-auto">
            {/* Portrait */}
            <div
              className="md:col-span-5 flex justify-center md:justify-end"
              style={{
                transform: `translate(${mouse.x * 8}px, ${mouse.y * -4}px)`,
                transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <div className="relative" style={{ maxWidth: '380px', width: '100%' }}>
                <div className="absolute -inset-16 bg-ink-50/[0.05] rounded-full blur-[80px]" />
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src="/portrait.jpg"
                    alt="XiaoXiu"
                    className="w-full h-full object-cover"
                    style={{ filter: 'contrast(1.03) saturate(0.9) brightness(0.95)' }}
                  />
                  <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-ink-50/10" />
                </div>
                <div className="absolute -top-2 -left-2 w-6 h-6 border-t border-l border-ink-200/40" />
                <div className="absolute -top-2 -right-2 w-6 h-6 border-t border-r border-ink-200/40" />
                <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b border-l border-ink-200/40" />
                <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b border-r border-ink-200/40" />
                <div className="absolute -bottom-8 left-0 font-mono text-[10px] text-ink-400 tracking-[0.3em] uppercase">
                  · SUBJECT / XiaoXiu @ Shenzhen
                </div>
              </div>
            </div>

            {/* Greeting + info datasheet */}
            <div className="md:col-span-7">
              <h3
                className="font-serif text-ink-50 leading-[0.95]"
                style={{ fontSize: 'clamp(2.5rem, 8vw, 7rem)', letterSpacing: '-0.02em' }}
              >
                Hi, I'm <span className="italic text-ink-200/90">XiaoXiu</span>.
              </h3>

              <dl className="mt-10 md:mt-12 max-w-md grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-ink-200/85 font-mono">
                {[
                  { k: 'GENDER', v: basic.gender },
                  { k: 'HEIGHT', v: basic.height },
                  { k: 'AGE', v: basic.age },
                  { k: 'JOB', v: basic.occupation },
                  { k: 'BASED', v: basic.location },
                ].map((row) => (
                  <div key={row.k} className="contents group">
                    <dt className="text-[10px] tracking-[0.4em] text-ink-400 pt-[6px]">
                      {row.k}
                    </dt>
                    <dd className="font-serif text-lg md:text-xl text-ink-50 leading-snug border-b border-ink-600/30 pb-2">
                      {row.v}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-10 md:mt-12 text-xs md:text-sm text-ink-200/60 tracking-[0.3em] uppercase font-mono">
                Scroll to read more ↓
              </div>
            </div>
          </div>
        </div>

        {/* lens flare streak - very subtle, moves with mouse */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 z-10 opacity-30"
          style={{
            transform: `translate(calc(-50% + ${mouse.x * 100}px), calc(-50% + ${mouse.y * 80}px))`,
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div className="w-[800px] h-px bg-gradient-to-r from-transparent via-ink-50/40 to-transparent blur-[1px]" />
        </div>

        {/* progress + scene counter */}
        <div className="absolute bottom-6 left-8 md:left-20 z-30 font-mono text-[10px] text-ink-400 tracking-[0.3em]">
          ACT {String(act + 1).padStart(2, '0')} / {String(actCount).padStart(2, '0')}
        </div>
        <div className="absolute bottom-6 right-8 md:right-20 z-30 flex items-center gap-3">
          <div className="font-mono text-[10px] text-ink-400 tracking-[0.3em]">
            {String(Math.round(progress * 100)).padStart(3, '0')}%
          </div>
          <div className="w-32 h-px bg-ink-600">
            <div
              className="h-full bg-ink-200"
              style={{ width: `${progress * 100}%`, transition: 'width 0.1s linear' }}
            />
          </div>
        </div>
        {progress < 0.05 && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 text-[10px] tracking-[0.5em] uppercase text-ink-400 animate-pulse font-mono">
            Scroll
          </div>
        )}
      </div>
    </section>
  );
}
