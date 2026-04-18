import { motion } from 'framer-motion';
import type { AboutBlock } from '../../data/resume';

export default function ManifestoBlock({ block }: { block: AboutBlock }) {
  const para1 = block.paragraphs?.[0] ?? '';
  const para2 = block.paragraphs?.[1] ?? '';

  return (
    <div className="relative min-h-[90vh] flex items-center py-24 md:py-32 overflow-hidden">
      {/* 巨型背景引号装饰 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute -top-16 -left-8 md:-left-16 font-serif select-none text-ink-50/[0.04]"
        style={{ fontSize: 'clamp(18rem, 36vw, 44rem)', lineHeight: '0.7' }}
      >
        "
      </motion.div>

      {/* 右上角 · 章节元数据条 */}
      <div className="absolute top-0 right-0 md:right-4 flex items-center gap-4 font-mono text-[10px] tracking-[0.4em] uppercase text-ink-400">
        <div className="w-24 h-px bg-ink-600/50" />
        <span>{block.index}</span>
        <span className="text-ink-200/60">{block.label}</span>
      </div>

      {/* 右下角 · meta 纵向排列（放大+更亮） */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 1.2, delay: 0.9 }}
        className="hidden md:flex absolute bottom-4 right-0 md:right-4 flex-col items-end gap-5"
      >
        <div className="font-mono text-[9px] tracking-[0.5em] uppercase text-ink-400 mb-1">
          — meta
        </div>
        {block.meta?.map((m, i) => (
          <motion.div
            key={m}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, delay: 1 + i * 0.1 }}
            className="flex items-center gap-4 group"
          >
            <span className="w-10 h-px bg-ink-200/40 group-hover:bg-ink-50 group-hover:w-16 transition-all duration-500" />
            <span className="font-serif italic text-ink-50/90 text-lg md:text-xl">
              {m}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* 主体：左留白 + 错位对齐 */}
      <div className="relative z-10 w-full pl-0 md:pl-[8vw] pr-0 md:pr-[6vw]">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-80px' }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif leading-[1.05] text-ink-50 mb-5"
          style={{ fontSize: 'clamp(2.8rem, 7vw, 6.5rem)' }}
        >
          {para1}
        </motion.h2>

        {/* 装饰线 */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-5 h-px w-32 md:w-48 bg-gradient-to-r from-ink-200 to-transparent origin-left"
        />

        {/* 第二行斜体，偏右排版 */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-80px' }}
          transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif italic leading-[1.05] text-ink-200/75 md:ml-[10vw]"
          style={{ fontSize: 'clamp(2rem, 5.5vw, 5rem)' }}
        >
          {para2}
        </motion.h2>

        {/* 底部 subtitle 小字，独立成行 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-20 md:mt-28 max-w-md"
        >
          <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-ink-400 mb-3">
            — SUBTITLE
          </div>
          <div className="font-serif italic text-ink-200/60 text-lg md:text-xl leading-relaxed">
            {block.subtitle}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
