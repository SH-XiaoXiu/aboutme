import { motion } from 'framer-motion';
import type { AboutBlock } from '../../data/resume';
import { getAboutImages } from '../../utils/aboutImages';
import BlockHeader from './BlockHeader';
import Img from './Img';

export default function RelationshipBlock({ block }: { block: AboutBlock }) {
  const { images } = getAboutImages(block.imageDir);

  return (
    <div className="relative py-24 md:py-36">
      <div className="max-w-4xl">
        <BlockHeader index={block.index} label={block.label} title={block.title} subtitle={block.subtitle} />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
          <div className={images.length > 0 ? 'md:col-span-7' : 'md:col-span-9'}>
            <div className="space-y-5">
              {block.paragraphs?.map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: '-50px' }}
                  transition={{ duration: 1, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className={`font-serif leading-[1.45] text-ink-50 ${
                    i === 0 ? 'text-3xl md:text-[3.2rem]' : 'text-xl md:text-2xl text-ink-200/82'
                  }`}
                >
                  {p}
                </motion.p>
              ))}
            </div>
          </div>

          {images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 1.04 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-5 md:max-w-sm md:ml-auto"
            >
              <Img image={images[0]} aspect="aspect-[4/5]" />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
