import { motion } from 'framer-motion';
import type { AboutBlock } from '../../data/resume';
import BlockHeader from './BlockHeader';

export default function ContradictionsBlock({ block }: { block: AboutBlock }) {
  return (
    <div className="relative py-20 md:py-32">
      <BlockHeader index={block.index} label={block.label} title={block.title} subtitle={block.subtitle} />

      <div className="max-w-4xl">
        <ul className="divide-y divide-ink-600/30 border-y border-ink-600/30">
          {block.contradictions?.map((c, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: '-50px' }}
              transition={{ duration: 0.8, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="group grid grid-cols-[auto_1fr_auto_1fr] md:grid-cols-[auto_5fr_auto_5fr] items-baseline gap-3 md:gap-6 py-5 md:py-6"
            >
              <span className="font-mono text-[10px] text-ink-400 tracking-[0.3em]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="font-serif text-lg md:text-2xl text-ink-50 leading-tight">
                {c.a}
              </span>
              <span className="font-mono text-xs text-ink-400 px-2">·</span>
              <span className="font-serif italic text-lg md:text-2xl text-ink-400 group-hover:text-ink-200 transition-colors leading-tight">
                {c.b}
              </span>
            </motion.li>
          ))}
        </ul>
        {block.closer && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="mt-10 font-serif italic text-ink-200/70 text-base md:text-lg max-w-2xl"
          >
            — {block.closer}
          </motion.div>
        )}
      </div>
    </div>
  );
}
