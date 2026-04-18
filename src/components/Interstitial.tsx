import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { DecryptedText } from './FancyText';

interface Props {
  from: string; // 上一章编号
  to: string; // 下一章编号
  toLabel: string;
  quote?: string;
}

/** 章节之间的过场：一屏高度的静默插片，像胶片过片头。 */
export default function Interstitial({ from, to, toLabel, quote }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // 数字从 from 横切到 to
  const fromOpacity = useTransform(scrollYProgress, [0.2, 0.4, 0.5], [0, 1, 0]);
  const fromX = useTransform(scrollYProgress, [0.2, 0.5], ['-10%', '-40%']);
  const toOpacity = useTransform(scrollYProgress, [0.5, 0.6, 0.8], [0, 1, 0]);
  const toX = useTransform(scrollYProgress, [0.5, 0.8], ['40%', '10%']);
  const lineScale = useTransform(scrollYProgress, [0.3, 0.7], [0, 1]);
  const quoteOpacity = useTransform(scrollYProgress, [0.45, 0.55, 0.65], [0, 1, 0]);

  return (
    <section ref={ref} className="relative h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="relative w-full max-w-6xl px-8 md:px-20">
        <div className="relative flex items-center justify-center gap-8 md:gap-16">
          <motion.div
            style={{ opacity: fromOpacity, x: fromX }}
            className="font-serif text-[18vw] md:text-[14vw] leading-none text-ink-50/[0.06] select-none"
          >
            {from}
          </motion.div>

          <motion.div
            style={{ scaleX: lineScale }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-ink-200/60 to-transparent origin-center"
          />

          <motion.div
            style={{ opacity: toOpacity, x: toX }}
            className="font-serif text-[18vw] md:text-[14vw] leading-none text-ink-50/[0.12] select-none"
          >
            {to}
          </motion.div>
        </div>

        <motion.div
          style={{ opacity: quoteOpacity }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
        >
          {quote && (
            <div className="font-serif italic text-ink-200/80 text-xl md:text-3xl mb-6 max-w-2xl mx-auto leading-relaxed">
              "{quote}"
            </div>
          )}
          <div className="font-mono text-[10px] md:text-xs tracking-[0.5em] uppercase text-ink-400">
            <DecryptedText text={`NEXT · ${toLabel}`} trigger="view" speed={35} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
