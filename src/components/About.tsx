import { motion } from 'framer-motion';
import { aboutBlocks } from '../data/resume';
import ChapterHeader from './ChapterHeader';
import BlockRouter from './about/BlockRouter';

export default function About() {
  return (
    <section className="relative px-8 md:px-20 py-24 md:py-32 text-ink-50 overflow-hidden">
      <div className="relative z-10">
        <ChapterHeader
          index="01"
          label="PROLOGUE"
          title="关于我，"
          italicTitle="一些随便写写的片段。"
          direction="from-bottom"
        />

        <div className="space-y-10 md:space-y-20">
          {aboutBlocks.map((block, i) => (
            <div key={block.kind} className="relative">
              <BlockRouter block={block} />
              {i < aboutBlocks.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: false, margin: '-100px' }}
                  transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-12 md:mt-20 w-24 h-px bg-ink-200/20 origin-left"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
