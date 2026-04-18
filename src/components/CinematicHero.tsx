import { useEffect, useRef, useState } from 'react';
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

  // 3 幕 3 屏。Act 2 加停留平台，确保古诗不会一闪而过，但总长不变，保持无缝过渡。
  //   Act 1:  0    ~ 0.30
  //   Act 2:  0.30 ~ 0.70  (淡入 0.30-0.36 · 停留 0.36-0.64 · 淡出 0.64-0.70)
  //   Act 3:  0.70 ~ 1.00
  const actCount = 3;
  const act = progress < 0.30 ? 0 : progress < 0.70 ? 1 : 2;

  const titleScale = 1 + Math.min(progress, 0.30) * 2.5;
  const titleOpacity = 1 - Math.max(0, (progress - 0.25) * 6);

  const quoteOpacity =
    progress < 0.30
      ? 0
      : progress < 0.36
      ? (progress - 0.30) / 0.06
      : progress < 0.64
      ? 1
      : progress < 0.70
      ? 1 - (progress - 0.64) / 0.06
      : 0;
  const quoteScale =
    progress < 0.30
      ? 0.94
      : progress < 0.36
      ? 0.94 + ((progress - 0.30) / 0.06) * 0.05
      : progress < 0.70
      ? 0.99 + ((progress - 0.36) / 0.34) * 0.03
      : 1.02;

  // Act 3 节奏：
  //   0.70 ~ 0.78  照片 + 问候语淡入就位（24vh 滚动）
  //   0.78 ~ 0.88  照片稳定展示期，让用户端详（30vh 滚动）
  //   0.88 ~ 1.00  翻面揭示信息（36vh 滚动）
  const finalOpacity = progress < 0.70 ? 0 : Math.min(1, (progress - 0.70) * 12.5);
  const finalY = (1 - Math.min(1, (progress - 0.70) * 12.5)) * 60;
  const flipT = Math.max(0, Math.min(1, (progress - 0.88) / 0.12));
  const flipAngle = flipT * 180;

  // letterbox bars 已移除（原先的上下黑条会在 Hero 退场时造成可见"卡顿"）

  return (
    <section
      ref={sectionRef}
      className="relative text-ink-50"
      style={{ height: `${actCount * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* 背景由全站 FilmBackdrop 提供 */}


        {/* corner meta */}
        <div className="absolute top-6 left-8 md:left-20 text-[10px] tracking-[0.4em] text-ink-400/70 uppercase z-30 font-mono">
          ▸ REC · Portfolio / MMXXVI
        </div>
        <div className="absolute top-6 right-8 md:right-20 text-[10px] tracking-[0.4em] text-ink-400/70 uppercase z-30 font-mono">
          {basic.location} · 22.5°N 114.1°E
        </div>

        {/* ACT 1 */}
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

        {/* ACT 2 */}
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
              <div className="mb-4">"钱塘江上潮信来，</div>
              <div className="italic text-ink-200/80">今日方知我是我。"</div>
            </div>
          </div>
        </div>

        {/* ACT 3 — 照片翻面，问候语保持不动 */}
        <div
          className="absolute inset-0 flex items-center px-8 md:px-20 z-20"
          style={{
            opacity: finalOpacity,
            transform: `translateY(${finalY}px)`,
            pointerEvents: act === 2 ? 'auto' : 'none',
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-20 items-center w-full max-w-7xl mx-auto">
            {/* 翻面卡片 */}
            <div
              className="md:col-span-5 flex justify-center md:justify-end"
              style={{
                transform: `translate(${mouse.x * 8}px, ${mouse.y * -4}px)`,
                transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <div
                className="relative"
                style={{
                  maxWidth: '380px',
                  width: '100%',
                  perspective: '2200px',
                }}
              >
                <div className="pointer-events-none absolute -inset-16 bg-ink-50/[0.05] rounded-full blur-[80px]" />

                <div
                  className="relative aspect-[3/4]"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: `rotateY(${flipAngle}deg)`,
                    transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  {/* FRONT — 照片正面 */}
                  <div
                    className="absolute inset-0"
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                  >
                    <div className="relative w-full h-full overflow-hidden">
                      <img
                        src={`${import.meta.env.BASE_URL}portrait.jpg`}
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
                    <div className="absolute -bottom-8 left-0 font-mono text-[10px] text-ink-400 tracking-[0.3em] uppercase whitespace-nowrap">
                      · SUBJECT / XiaoXiu @ Shenzhen
                    </div>
                  </div>

                  {/* BACK — 照片背面（信息卡） */}
                  <div
                    className="absolute inset-0 text-[#2a1f12] p-8 md:p-10 flex flex-col"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      background:
                        'linear-gradient(135deg, #f0e5cf 0%, #e5d9bf 50%, #dccfb0 100%)',
                      boxShadow:
                        'inset 0 0 60px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(0,0,0,0.1)',
                    }}
                  >
                    <div className="flex items-center justify-between font-mono text-[9px] tracking-[0.4em] uppercase text-[#6b5a3d]">
                      <span>photo · verso</span>
                      <span>№ 001</span>
                    </div>

                    <dl className="mt-8 grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 font-mono">
                      {[
                        { k: 'GENDER', v: basic.gender },
                        { k: 'HEIGHT', v: basic.height },
                        { k: 'AGE', v: basic.age },
                        { k: 'JOB', v: basic.occupation },
                        { k: 'BASED', v: basic.location },
                      ].map((row) => (
                        <div key={row.k} className="contents">
                          <dt className="text-[9px] tracking-[0.35em] text-[#8a7550] pt-[5px]">
                            {row.k}
                          </dt>
                          <dd className="font-serif text-base md:text-lg text-[#2a1f12] leading-snug border-b border-[#2a1f12]/15 pb-1.5">
                            {row.v}
                          </dd>
                        </div>
                      ))}
                    </dl>

                    <div className="mt-auto pt-6 flex items-end justify-between">
                      <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#6b5a3d]">
                        filed · Shenzhen
                      </div>
                      <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#6b5a3d]">
                        MMXXVI
                      </div>
                    </div>

                    {/* 邮戳 */}
                    <div className="absolute top-3 right-3 w-12 h-12 border border-dashed border-[#2a1f12]/25 rounded-full flex items-center justify-center font-mono text-[8px] tracking-widest text-[#6b5a3d]/80 rotate-[-8deg]">
                      ✦
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 问候语（固定，不翻面） */}
            <div className="md:col-span-7">
              <h3
                className="font-serif text-ink-50 leading-[0.95]"
                style={{ fontSize: 'clamp(2.5rem, 8vw, 7rem)', letterSpacing: '-0.02em' }}
              >
                Hi, I'm <span className="italic text-ink-200/90">XiaoXiu</span>.
              </h3>

              <div className="mt-10 md:mt-12 text-xs md:text-sm text-ink-200/60 tracking-[0.3em] uppercase font-mono flex items-center gap-4">
                <span>Scroll to flip the photo</span>
                <span className="w-10 h-px bg-ink-200/40" />
                <span>↻</span>
              </div>
            </div>
          </div>
        </div>

        {/* lens flare streak - follows mouse */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 z-10 opacity-30"
          style={{
            transform: `translate(calc(-50% + ${mouse.x * 100}px), calc(-50% + ${mouse.y * 80}px))`,
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div className="w-[800px] h-px bg-gradient-to-r from-transparent via-ink-50/40 to-transparent blur-[1px]" />
        </div>

        {/* ACT counter + progress bar */}
        <div className="absolute bottom-6 left-8 md:left-20 z-30 font-mono text-[10px] text-ink-400 tracking-[0.3em]">
          ACT {String(act + 1).padStart(2, '0')} / 03
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
