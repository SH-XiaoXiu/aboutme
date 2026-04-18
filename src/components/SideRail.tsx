import { useEffect, useState } from 'react';

interface Section {
  id: string;
  label: string;
  index: string;
}

const SECTIONS: Section[] = [
  { id: 'hero', label: 'INTRO', index: '00' },
  { id: 'about', label: 'PROLOGUE', index: '01' },
  { id: 'skills', label: 'CRAFT', index: '02' },
  { id: 'experience', label: 'CHRONICLE', index: '03' },
  { id: 'projects', label: 'WORKS', index: '04' },
  { id: 'gallery', label: 'GALLERY', index: '05' },
  { id: 'contact', label: 'EPILOGUE', index: '06' },
];

/**
 * 侧边纵向导航轨。固定在视口右侧。
 * 每节一个细刻度 + 编号，hover 显示完整章节名。当前章节刻度变粗变亮。
 */
export default function SideRail() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const sections = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      Boolean
    ) as HTMLElement[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = SECTIONS.findIndex((s) => s.id === e.target.id);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      {
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0,
      }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav
      aria-label="Chapter navigation"
      className="pointer-events-none fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-end gap-5"
    >
      <div className="font-mono text-[9px] tracking-[0.5em] uppercase text-ink-400/60 pb-1">
        —— chapter
      </div>
      {SECTIONS.map((s, i) => {
        const isActive = i === active;
        return (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className="group pointer-events-auto flex items-center gap-3 cursor-pointer"
            aria-label={s.label}
          >
            <span
              className={`font-mono text-[10px] tracking-[0.3em] uppercase transition-all duration-500 ${
                isActive
                  ? 'opacity-100 text-ink-50'
                  : 'opacity-0 group-hover:opacity-100 text-ink-200/70'
              }`}
            >
              {s.label}
            </span>
            <span
              className={`font-mono text-[10px] tracking-widest transition-colors duration-500 ${
                isActive ? 'text-ink-50' : 'text-ink-400/70 group-hover:text-ink-200'
              }`}
            >
              {s.index}
            </span>
            <span
              className={`block h-px transition-all duration-500 ${
                isActive
                  ? 'w-8 bg-ink-50'
                  : 'w-3 bg-ink-400/60 group-hover:w-5 group-hover:bg-ink-200'
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
