import { motion } from 'framer-motion';
import type { AboutBlock } from '../../data/resume';
import { getAboutImages } from '../../utils/aboutImages';
import BlockHeader from './BlockHeader';
import Img from './Img';

/** 用于 Now / Signature 两个偏列表型的块。 */
export default function ListBlock({ block }: { block: AboutBlock }) {
  const { images } = getAboutImages(block.imageDir);
  const hasImage = images.length > 0;

  return (
    <div className="relative py-20 md:py-32 overflow-hidden">
      <BlockHeader index={block.index} label={block.label} title={block.title} subtitle={block.subtitle} />

      {/* 背景大号 block 编号装饰 */}
      <div
        className="pointer-events-none absolute -right-4 md:right-4 top-12 md:top-20 font-serif select-none text-ink-50/[0.035] leading-[0.7]"
        style={{ fontSize: 'clamp(12rem, 26vw, 28rem)' }}
      >
        {block.index}
      </div>

      <div className={`relative z-10 grid ${hasImage ? 'grid-cols-1 md:grid-cols-12 gap-12' : 'grid-cols-1'} items-start`}>
        <div className={hasImage ? 'md:col-span-8' : 'w-full'}>
          <ol className="relative space-y-10 md:space-y-12">
            {/* 左侧竖线 */}
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-[52px] md:left-[72px] top-2 bottom-2 w-px bg-gradient-to-b from-ink-200/40 via-ink-600/30 to-transparent origin-top"
            />

            {block.listItems?.map((item, i) => {
              // 阶梯式左缩进，让结构有节奏感
              const indent = i % 3; // 0 / 1 / 2 三档
              const indentClass = indent === 0 ? 'md:ml-0' : indent === 1 ? 'md:ml-8' : 'md:ml-16';

              return (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.9, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className={`group relative grid grid-cols-[72px_1fr] md:grid-cols-[96px_1fr] gap-4 md:gap-8 items-baseline ${indentClass}`}
                >
                  {/* 巨号空心编号 */}
                  <div
                    aria-hidden
                    className="font-serif leading-none text-ink-50/[0.12] group-hover:text-ink-200/50 transition-colors duration-500 select-none"
                    style={{
                      fontSize: 'clamp(3rem, 5.5vw, 5rem)',
                      WebkitTextStroke: '1px currentColor',
                      color: 'transparent',
                    }}
                  >
                    {i + 1}
                  </div>

                  <div className="relative">
                    {/* 节点小圆点 */}
                    <div className="absolute -left-[22px] md:-left-[34px] top-[0.9em] w-2 h-2 rounded-full bg-ink-400 group-hover:bg-ink-50 group-hover:scale-125 transition-all duration-500 ring-4 ring-[#0a0908]" />

                    <p className="font-serif text-xl md:text-3xl lg:text-[2.1rem] leading-[1.35] text-ink-50 group-hover:translate-x-1 transition-transform duration-500">
                      {item}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </ol>

          {block.closer && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="relative mt-20 md:mt-28 max-w-2xl ml-auto"
            >
              <div className="absolute -left-4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-ink-200/50 to-transparent" />
              <div className="pl-8">
                <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-ink-400 mb-3">
                  —— CLOSER
                </div>
                <div className="font-serif italic text-3xl md:text-5xl text-ink-50 leading-[1.2]">
                  {block.closer}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {hasImage && (
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-4 md:sticky md:top-20"
          >
            <Img image={images[0]} aspect="aspect-[3/4]" />
          </motion.div>
        )}
      </div>
    </div>
  );
}
