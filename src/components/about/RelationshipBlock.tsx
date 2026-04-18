import { motion } from 'framer-motion';
import type { AboutBlock } from '../../data/resume';
import { getAboutImages } from '../../utils/aboutImages';
import Img from './Img';

export default function RelationshipBlock({ block }: { block: AboutBlock }) {
  const { images } = getAboutImages(block.imageDir);

  return (
    <div className="relative py-24 md:py-40">
      <div className="max-w-3xl mx-auto text-center">
        <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-ink-400 mb-6">
          {block.index} · {block.label}
        </div>
        <div className="font-serif italic text-ink-400 text-xl md:text-2xl mb-10">
          {block.subtitle}
        </div>

        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xs mx-auto mb-12"
          >
            <Img image={images[0]} aspect="aspect-square" />
          </motion.div>
        )}

        <div className="space-y-6">
          {block.paragraphs?.map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 1, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-xl md:text-2xl text-ink-50 leading-relaxed"
            >
              {p}
            </motion.p>
          ))}
        </div>
      </div>
    </div>
  );
}
