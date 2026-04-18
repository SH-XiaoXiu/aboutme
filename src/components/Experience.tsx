import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { experience } from '../data/resume';
import ChapterHeader from './ChapterHeader';

const ITEM_W = 34; // vw per item
const SECTION_H = (experience.length + 1) * 100; // vh

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // 第一屏 (0~0.22) 是 ChapterHeader 正常滚动，之后 (0.22~0.95) 做横向平移
  const x = useTransform(
    scrollYProgress,
    [0.22, 0.95],
    ['0vw', `${-(experience.length - 1) * ITEM_W}vw`],
  );

  const lineWidth = useTransform(scrollYProgress, [0.22, 0.95], ['0%', '100%']);
  const trackOpacity = useTransform(scrollYProgress, [0.15, 0.25], [0, 1]);
  const hintOpacity = useTransform(scrollYProgress, [0.85, 0.95], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0.08, 0.2], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative text-ink-50"
      style={{ height: `${SECTION_H}vh` }}
    >
      {/* 第一屏：ChapterHeader 正常流，自然滚走 */}
      <div className="h-screen px-8 md:px-20 flex items-center">
        <div className="w-full max-w-4xl">
          <ChapterHeader
            index="03"
            label="CHRONICLE"
            title="做过的事，"
            italicTitle="按时间倒序。"
            direction="from-right"
          />
          <motion.p
            style={{ opacity: cueOpacity }}
            className="mt-12 font-mono text-[11px] tracking-[0.4em] uppercase text-ink-400 flex items-center gap-4"
          >
            <span>scroll to travel</span>
            <span className="w-10 h-px bg-ink-400" />
            <span>→</span>
          </motion.p>
        </div>
      </div>

      {/* 之后 400vh 提供 sticky 滚动行程 */}
      <motion.div
        style={{ opacity: trackOpacity }}
        className="sticky top-0 h-screen overflow-hidden"
      >
        {/* 水平导轨线（60% 高度） */}
        <div className="pointer-events-none absolute inset-x-0" style={{ top: '60%' }}>
          <div className="w-full h-px bg-ink-600/25" />
          <motion.div
            style={{ width: lineWidth }}
            className="absolute top-0 left-0 h-px bg-gradient-to-r from-ink-50 via-ink-300/70 to-transparent"
          />
        </div>

        {/* 横向 track */}
        <motion.div
          style={{ x, left: '8vw', top: 0, height: '100%' }}
          className="absolute flex items-center"
        >
          {experience.map((exp, i) => (
            <div
              key={i}
              className="relative flex-shrink-0 h-full flex flex-col justify-center"
              style={{ width: `${ITEM_W}vw`, paddingRight: '4vw' }}
            >
              {/* 内容在上方 */}
              <div style={{ paddingBottom: '22vh' }}>
                <div className="font-mono text-xs tracking-wider text-ink-400 mb-2">
                  {exp.date}
                </div>
                <div className="text-sm text-ink-200/70 mb-5">{exp.company}</div>
                <h3 className="font-serif text-2xl md:text-3xl text-ink-50 leading-tight mb-5">
                  {exp.position}
                </h3>
                <ul className="space-y-2">
                  {exp.highlights.map((h, j) => (
                    <li
                      key={j}
                      className="text-ink-200/70 text-[14px] font-light flex gap-3 leading-relaxed"
                    >
                      <span className="text-ink-500 flex-shrink-0 mt-1">—</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 时间轴节点（贴在 60% 水平线上） */}
              <div
                className="absolute pointer-events-none"
                style={{ top: 'calc(60% - 6px)', left: 0 }}
              >
                <div className="relative w-3 h-3">
                  <div className="absolute inset-0 bg-ink-50 rounded-full ring-4 ring-[#0e0906] z-10" />
                  <div className="absolute -inset-2 bg-ink-50/15 rounded-full blur-sm" />
                </div>
              </div>

              {/* 序号 */}
              <div
                className="absolute font-mono text-[10px] tracking-[0.4em] text-ink-500"
                style={{ top: 'calc(60% + 18px)', left: 0 }}
              >
                0{i + 1} / 0{experience.length}
              </div>
            </div>
          ))}
        </motion.div>

        {/* 右下提示 */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-10 right-24 font-mono text-[10px] tracking-[0.4em] uppercase text-ink-500 flex items-center gap-3"
        >
          <span>scroll</span>
          <div className="w-8 h-px bg-ink-500" />
        </motion.div>
      </motion.div>
    </section>
  );
}
