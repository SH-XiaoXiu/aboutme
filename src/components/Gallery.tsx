import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChapterHeader from './ChapterHeader';

/** 自动扫描 src/assets/gallery/ 下全部图片。 */
const rawImages = import.meta.glob(
  '/src/assets/gallery/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true, import: 'default', query: '?url' }
) as Record<string, string>;

function rand(): number {
  return Math.random();
}

interface Placement {
  src: string;
  id: string;
  xPercent: number;
  yPx: number;
  rotation: number;
  widthPx: number;
  depth: number;
  zBase: number;
  hasTape: boolean;
}

/** Fisher-Yates shuffle */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function computePlacements(entries: [string, string][]): Placement[] {
  const n = entries.length;
  if (n === 0) return [];

  // 每次刷新都重新打乱顺序
  const shuffled = shuffle(entries);

  const cols = n <= 4 ? 2 : n <= 9 ? 3 : 4;
  const rowHeight = 420;

  return shuffled.map(([path, src], i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const colWidthPercent = 100 / cols;
    const xAnchor = (col + 0.5) * colWidthPercent;
    const yAnchor = row * rowHeight + rowHeight / 2;

    const jitterX = (rand() - 0.5) * colWidthPercent * 0.5;
    const jitterY = (rand() - 0.5) * rowHeight * 0.4;
    const rotation = (rand() - 0.5) * 12;
    const widthPx = 220 + rand() * 110;
    const depth = 0.35 + rand() * 0.8;
    const zBase = Math.floor(rand() * 100);
    const hasTape = rand() > 0.4;

    // id 加上随机后缀避免 React key 冲突（如果同一 src 出现两次）
    return {
      src,
      id: `${path}-${i}`,
      xPercent: xAnchor + jitterX,
      yPx: yAnchor + jitterY,
      rotation,
      widthPx,
      depth,
      zBase,
      hasTape,
    };
  });
}

export default function Gallery() {
  const entries = useMemo(() => Object.entries(rawImages), []);
  const placements = useMemo(() => computePlacements(entries), [entries]);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const x = (e.clientX - cx) / (rect.width / 2);
      const y = (e.clientY - cy) / (rect.height / 2);
      setMouse({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight')
        setLightboxIndex((i) => (i === null ? i : (i + 1) % placements.length));
      if (e.key === 'ArrowLeft')
        setLightboxIndex((i) =>
          i === null ? i : (i - 1 + placements.length) % placements.length
        );
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, placements.length]);

  const cols = entries.length <= 4 ? 2 : entries.length <= 9 ? 3 : 4;
  const rowCount = Math.ceil(entries.length / cols);
  const totalHeight = rowCount * 420 + 160;

  return (
    <section className="relative px-4 md:px-12 py-24 md:py-32 text-ink-50 overflow-hidden">
      <div className="relative z-10 px-4 md:px-8">
        <ChapterHeader
          index="05"
          label="GALLERY"
          title="一些照片，"
          italicTitle="咋啥都挂上来。。"
          direction="from-bottom"
        />
      </div>

      {entries.length === 0 ? (
        <div className="relative z-10 max-w-2xl mx-auto text-center py-32 font-mono text-xs tracking-[0.3em] uppercase text-ink-400">
          — 往 src/assets/gallery/ 扔图片 —
        </div>
      ) : (
        <div
          ref={containerRef}
          className="relative z-10 mx-auto"
          style={{ height: `${totalHeight}px`, maxWidth: '1400px' }}
          onMouseLeave={() => setMouse({ x: 0, y: 0 })}
        >
          {placements.map((p, i) => {
            const isHover = hoverId === p.id;
            const parallaxX = mouse.x * 24 * p.depth;
            const parallaxY = mouse.y * 18 * p.depth;
            const scale = isHover ? 1.06 : 1;
            const rot = isHover ? p.rotation * 0.25 : p.rotation;

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 1.18, rotate: p.rotation * 2.5 }}
                whileInView={{ opacity: 1, scale: 1, rotate: p.rotation }}
                viewport={{ once: false, margin: '-80px' }}
                transition={{
                  duration: 1.3,
                  delay: (i % 8) * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute group cursor-pointer"
                style={{
                  left: `${p.xPercent}%`,
                  top: `${p.yPx}px`,
                  width: `${p.widthPx}px`,
                  zIndex: isHover ? 999 : p.zBase,
                  transform: `translate(calc(-50% + ${parallaxX}px), calc(-50% + ${parallaxY}px)) rotate(${rot}deg) scale(${scale})`,
                  transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  filter: isHover
                    ? 'drop-shadow(0 30px 50px rgba(0,0,0,0.7))'
                    : 'drop-shadow(0 12px 25px rgba(0,0,0,0.5))',
                }}
                onMouseEnter={() => setHoverId(p.id)}
                onMouseLeave={() => setHoverId(null)}
                onClick={() => setLightboxIndex(i)}
              >
                {/* Polaroid frame — 高度跟随图片自然比例 */}
                <div className="relative bg-[#ede6d1] pt-[10px] px-[10px] pb-[34px]">
                  <div className="relative overflow-hidden bg-[#0e0906]">
                    <img
                      src={p.src}
                      alt=""
                      loading="lazy"
                      className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-multiply bg-[radial-gradient(ellipse_at_center,transparent_30%,#000_140%)]" />
                  {p.hasTape && (
                    <div className="pointer-events-none absolute top-[-6px] left-1/2 -translate-x-1/2 w-12 h-3 bg-ink-50/15 rotate-[-2deg]" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/92 backdrop-blur-md flex items-center justify-center px-4 md:px-16 py-12 cursor-zoom-out"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              className="absolute top-6 right-6 md:top-10 md:right-10 text-ink-200 hover:text-ink-50 font-mono text-xs tracking-[0.3em] uppercase z-10"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(null);
              }}
            >
              ✕ CLOSE
            </button>
            <button
              className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 text-ink-200 hover:text-ink-50 font-serif text-4xl md:text-6xl z-10 w-14 h-14 flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((idx) =>
                  idx === null ? idx : (idx - 1 + placements.length) % placements.length
                );
              }}
              aria-label="Prev"
            >
              ‹
            </button>
            <button
              className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 text-ink-200 hover:text-ink-50 font-serif text-4xl md:text-6xl z-10 w-14 h-14 flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((idx) =>
                  idx === null ? idx : (idx + 1) % placements.length
                );
              }}
              aria-label="Next"
            >
              ›
            </button>

            <motion.img
              key={placements[lightboxIndex].src}
              src={placements[lightboxIndex].src}
              alt=""
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-full max-h-[85vh] object-contain cursor-default select-none"
              onClick={(e) => e.stopPropagation()}
            />

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs tracking-[0.3em] uppercase text-ink-400">
              {String(lightboxIndex + 1).padStart(2, '0')} / {String(placements.length).padStart(2, '0')}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
