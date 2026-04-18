import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { experience } from '../data/resume';
import ChapterHeader from './ChapterHeader';

export default function Experience() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 70%', 'end 60%'],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section className="relative px-8 md:px-20 py-32 md:py-48 text-ink-50 overflow-hidden">
      <div className="relative z-10">
        <ChapterHeader
          index="03"
          label="CHRONICLE"
          title="做过的事，"
          italicTitle="按时间倒序。"
        />

        <div ref={timelineRef} className="relative max-w-5xl">
          {/* static faint rail */}
          <div className="absolute left-0 md:left-1/4 top-0 bottom-0 w-px bg-ink-600/25" />
          {/* animated drawing line */}
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-0 md:left-1/4 top-0 w-px bg-gradient-to-b from-ink-50 via-ink-200 to-ink-400/0"
          />

          {experience.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative pl-8 md:pl-0 md:grid md:grid-cols-4 gap-8 pb-24 last:pb-0"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute left-0 md:left-1/4 top-3 w-3 h-3 -translate-x-1/2 z-10"
              >
                <div className="absolute inset-0 bg-ink-50 rounded-full ring-4 ring-[#0a0908]" />
                <div className="absolute -inset-2 bg-ink-50/20 rounded-full blur-sm animate-pulse" />
              </motion.div>

              <div className="md:pr-12 md:text-right">
                <div className="font-mono text-xs text-ink-400 tracking-wider">{exp.date}</div>
                <div className="mt-2 text-sm text-ink-200/80">{exp.company}</div>
              </div>

              <div className="md:col-span-3 md:pl-12 mt-4 md:mt-0">
                <h3 className="font-serif text-3xl md:text-4xl text-ink-50 mb-6 leading-tight">
                  {exp.position}
                </h3>
                <ul className="space-y-3">
                  {exp.highlights.map((h, j) => (
                    <motion.li
                      key={j}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: j * 0.08 }}
                      className="text-ink-200/75 leading-relaxed text-[15px] font-light flex gap-3"
                    >
                      <span className="text-ink-400 flex-shrink-0 mt-2.5">—</span>
                      <span>{h}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
