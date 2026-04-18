import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { skills } from '../data/resume';
import ChapterHeader from './ChapterHeader';

const SECTION_H = 300; // vh

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const allItems = skills.flatMap((s) => s.items);
  const [marqueePaused, setMarqueePaused] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // ChapterHeader 屏（0~0.2）之后开始 zoom-out
  const gridScale = useTransform(scrollYProgress, [0.2, 0.9], [2.2, 1]);
  const gridOpacity = useTransform(scrollYProgress, [0.2, 0.32], [0, 1]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative text-ink-50"
      style={{ height: `${SECTION_H}vh` }}
    >
      {/* 第一屏：ChapterHeader + marquee 正常流 */}
      <motion.div style={{ opacity: headerOpacity }} className="h-screen flex flex-col">
        <div className="px-8 md:px-20 pt-32">
          <ChapterHeader
            index="02"
            label="CRAFT"
            title="工具箱，"
            italicTitle="常用到的那些。"
            direction="from-left"
          />
        </div>

        {/* Marquee */}
        <div
          className="relative z-10 mt-auto py-10 border-y border-ink-600/30 overflow-hidden"
          onMouseEnter={() => setMarqueePaused(true)}
          onMouseLeave={() => setMarqueePaused(false)}
        >
          <div
            className="flex whitespace-nowrap marquee-track"
            style={{
              animationDuration: marqueePaused ? '180s' : '60s',
              transition: 'animation-duration 0.8s',
            }}
          >
            {[...allItems, ...allItems].map((item, i) => (
              <span
                key={i}
                className="font-serif text-5xl md:text-7xl italic px-8 text-ink-200/30 hover:text-ink-50 transition-colors duration-500 cursor-default"
              >
                {item}
                <span className="text-ink-600/60 mx-6">·</span>
              </span>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#0e0906]/80 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#0e0906]/80 to-transparent z-10" />
        </div>
      </motion.div>

      {/* sticky 缩放容器 */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        <motion.div
          style={{
            scale: gridScale,
            opacity: gridOpacity,
            transformOrigin: 'center center',
          }}
          className="w-full px-8 md:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-ink-600/30"
        >
          {skills.map((cat, i) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-[#0e0906]/70 backdrop-blur-sm p-8 md:p-10 hover:bg-[#150f08]/80 transition-colors group overflow-hidden"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-ink-50/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="relative flex items-baseline justify-between mb-6">
                <span className="font-mono text-xs text-ink-400">0{i + 1}</span>
                <div className="w-8 h-px bg-ink-600 group-hover:bg-ink-200/60 group-hover:w-16 transition-all duration-500" />
              </div>
              <h3 className="relative font-serif text-2xl md:text-3xl text-ink-50 mb-6">
                {cat.category}
              </h3>
              <div className="relative flex flex-wrap gap-2">
                {cat.items.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1 text-xs font-mono text-ink-400 border border-ink-600/60 rounded-full hover:border-ink-200/60 hover:text-ink-50 hover:bg-ink-50/[0.02] transition-all"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
