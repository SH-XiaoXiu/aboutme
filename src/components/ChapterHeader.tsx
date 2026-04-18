import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { DecryptedText } from './FancyText';

type HeaderDirection = 'from-bottom' | 'from-left' | 'from-right' | 'zoom';

interface Props {
  index: string; // "01"
  label: string; // "PROLOGUE"
  title: string; // 大标题第一行
  italicTitle: string; // 大标题第二行（斜体）
  direction?: HeaderDirection;
}

export default function ChapterHeader({ index, label, title, italicTitle, direction = 'from-bottom' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 90%', 'start 30%'],
  });
  const lineScale     = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const numberOpacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
  const numberY       = useTransform(scrollYProgress, [0, 1], direction === 'from-bottom' ? [80, 0] : [0, 0]);
  const numberX       = useTransform(scrollYProgress, [0, 1],
    direction === 'from-left'  ? [-60, 0] :
    direction === 'from-right' ? [60, 0]  : [0, 0]
  );
  const numberScale   = useTransform(scrollYProgress, [0, 1], direction === 'zoom' ? [0.7, 1] : [1, 1]);

  return (
    <div ref={ref} className="relative mb-20 md:mb-32">
      <div className="flex items-baseline gap-6 md:gap-10">
        <motion.div
          style={{ y: numberY, x: numberX, scale: numberScale, opacity: numberOpacity }}
          className="font-serif text-[20vw] md:text-[14vw] leading-[0.8] text-ink-50/[0.06] select-none"
        >
          {index}
        </motion.div>

        <div className="flex-1 pb-4 md:pb-8">
          <div className="flex items-center gap-4 mb-4 md:mb-6 font-mono">
            <motion.div
              style={{ scaleX: lineScale }}
              className="w-12 h-px bg-ink-200 origin-left"
            />
            <span className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-ink-200/70">
              <DecryptedText text={label} trigger="view" speed={35} />
            </span>
          </div>

          <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.05] text-ink-50">
            <MaskReveal direction={direction}>{title}</MaskReveal>
            <MaskReveal direction={direction} delay={0.15} italic>
              {italicTitle}
            </MaskReveal>
          </h2>
        </div>
      </div>
    </div>
  );
}

function MaskReveal({
  children,
  delay = 0,
  italic = false,
  direction = 'from-bottom',
}: {
  children: React.ReactNode;
  delay?: number;
  italic?: boolean;
  direction?: HeaderDirection;
}) {
  // from-bottom 需要 overflow-hidden 裁切；其他方向用 opacity+偏移，不依赖裁切
  if (direction === 'from-bottom') {
    return (
      <div className="relative overflow-hidden pb-2">
        <motion.div
          initial={{ y: '110%' }}
          whileInView={{ y: '0%' }}
          viewport={{ once: false, margin: '-100px' }}
          transition={{ duration: 1.1, delay, ease: [0.76, 0, 0.24, 1] }}
          className={italic ? 'italic text-ink-400' : ''}
        >
          {children}
        </motion.div>
      </div>
    );
  }

  const initialMap = {
    'from-left':  { x: -56, opacity: 0 },
    'from-right': { x: 56, opacity: 0 },
    'zoom':       { scale: 0.75, opacity: 0 },
  } as const;
  const animateMap = {
    'from-left':  { x: 0, opacity: 1 },
    'from-right': { x: 0, opacity: 1 },
    'zoom':       { scale: 1, opacity: 1 },
  } as const;

  return (
    <div className="relative pb-2">
      <motion.div
        initial={initialMap[direction]}
        whileInView={animateMap[direction]}
        viewport={{ once: false, margin: '-100px' }}
        transition={{ duration: direction === 'zoom' ? 0.9 : 1.1, delay, ease: [0.76, 0, 0.24, 1] }}
        className={italic ? 'italic text-ink-400' : ''}
      >
        {children}
      </motion.div>
    </div>
  );
}
