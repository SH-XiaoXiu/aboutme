import { motion } from 'framer-motion';
import type { AboutBlock } from '../../data/resume';
import { getAboutImages } from '../../utils/aboutImages';
import BlockHeader from './BlockHeader';
import Img from './Img';

export default function OriginBlock({ block }: { block: AboutBlock }) {
  const { images } = getAboutImages(block.imageDir);
  const n = images.length;

  return (
    <div className="relative py-20 md:py-32">
      <BlockHeader index={block.index} label={block.label} title={block.title} subtitle={block.subtitle} />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
        <div className="md:col-span-6 space-y-6">
          {block.paragraphs?.map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-60px' }}
              transition={{ duration: 0.9, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-ink-200/85 leading-[1.9] text-[17px] font-light"
            >
              {p}
            </motion.p>
          ))}
          {block.closer && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 1, delay: 0.4 }}
              className="pt-6 font-serif italic text-2xl md:text-3xl text-ink-50"
            >
              {block.closer}
            </motion.div>
          )}
        </div>

        {n > 0 && (
          <div className="md:col-span-6 grid grid-cols-2 gap-4">
            {n >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 1, delay: 0.2 }}
                className="col-span-2"
              >
                <Img image={images[0]} aspect="aspect-[4/3]" />
              </motion.div>
            )}
            {n >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 1, delay: 0.35 }}
                className="col-span-2 md:col-span-1 md:col-start-2 md:-mt-8"
              >
                <Img image={images[1]} aspect="aspect-square" />
              </motion.div>
            )}
            {n >= 3 &&
              images.slice(2).map((img, i) => (
                <motion.div
                  key={img.src}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                >
                  <Img image={img} aspect="aspect-[3/4]" />
                </motion.div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
