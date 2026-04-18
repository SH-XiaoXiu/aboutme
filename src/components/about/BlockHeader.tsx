import { motion } from 'framer-motion';
import { DecryptedText } from '../FancyText';

interface Props {
  index: string;
  label: string;
  title?: string;
  subtitle: string;
}

/** 每个 About 内部块的小号片头。比 ChapterHeader 低一级。 */
export default function BlockHeader({ index, label, title, subtitle }: Props) {
  return (
    <div className="mb-10 md:mb-14">
      <div className="flex items-center gap-4 mb-5 font-mono">
        <span className="text-[10px] text-ink-400 tracking-[0.3em]">{index} /</span>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-10 h-px bg-ink-200/40 origin-left"
        />
        <span className="text-[10px] tracking-[0.35em] uppercase text-ink-200/70">
          <DecryptedText text={label} trigger="view" speed={30} />
        </span>
      </div>
      {title && (
        <h3 className="font-serif text-3xl md:text-5xl leading-[1.05] text-ink-50 mb-3 overflow-hidden">
          <motion.span
            initial={{ y: '100%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            className="inline-block"
          >
            {title}
          </motion.span>
        </h3>
      )}
      <div className="font-serif italic text-ink-400 text-lg md:text-xl">
        {subtitle}
      </div>
    </div>
  );
}
