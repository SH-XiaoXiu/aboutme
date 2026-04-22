import { motion, useMotionTemplate, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import type { AboutBlock } from '../../data/resume';

export default function HabitsBlock({ block }: { block: AboutBlock }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 85%', 'end 20%'],
  });
  const shellX = useTransform(scrollYProgress, [0, 1], [-18, 18]);
  const titleY = useTransform(scrollYProgress, [0, 1], [18, -18]);
  const numberX = useTransform(scrollYProgress, [0, 1], [26, -18]);
  const numberY = useTransform(scrollYProgress, [0, 1], [-40, 36]);
  const lineScale = useTransform(scrollYProgress, [0, 1], [0.72, 1]);

  return (
    <div ref={ref} className="relative py-20 md:py-32 overflow-hidden">
      <div className="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-4 font-mono text-[10px] tracking-[0.38em] uppercase text-ink-300/70">
          <span>{block.index}</span>
          <motion.span
            style={{ scaleX: lineScale }}
            className="h-px w-12 origin-left bg-ink-200/40"
          />
          <span>{block.label}</span>
        </div>
        <p className="max-w-sm font-serif italic text-lg leading-relaxed text-ink-400 md:text-xl">
          {block.subtitle}
        </p>
      </div>

      <motion.div style={{ x: shellX }} className="relative">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(180deg, rgba(240,235,229,0.18) 0px, rgba(240,235,229,0.18) 1px, transparent 1px, transparent 22px)',
          }}
        />
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-ink-200/45 via-ink-200/10 to-transparent" />
        <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-ink-200/10 to-ink-200/45" />

        <motion.div
          style={{ x: numberX, y: numberY }}
          className="pointer-events-none absolute -right-2 top-6 font-serif leading-none text-ink-50/[0.06] select-none"
          aria-hidden
        >
          <span
            style={{
              fontSize: 'clamp(9rem, 22vw, 20rem)',
              WebkitTextStroke: '1px rgba(240,235,229,0.14)',
              color: 'transparent',
            }}
          >
            {block.index}
          </span>
        </motion.div>

        <motion.div
          style={{ y: titleY }}
          className="relative z-10 max-w-md pt-6 md:pt-10"
        >
          <div className="mb-3 font-mono text-[10px] tracking-[0.4em] uppercase text-ink-400">
            poster / daily mode
          </div>
          {block.title && (
            <h3 className="font-serif text-3xl leading-[1.05] text-ink-50 md:text-6xl">
              {block.title}
            </h3>
          )}
        </motion.div>

        <div className="mt-12 hidden md:block">
          {block.habitItems?.[0] && (
            <PosterSentence
              index={1}
              text={block.habitItems[0]}
              progress={scrollYProgress}
              range={[0.02, 0.28]}
              from="left"
              className="max-w-5xl"
              textClassName="max-w-4xl text-[3.2rem] leading-[0.98] lg:text-[5.5rem]"
            />
          )}
          {block.habitItems?.[1] && (
            <div className="mt-10 flex justify-end pr-[6%]">
              <PosterSentence
                index={2}
                text={block.habitItems[1]}
                progress={scrollYProgress}
                range={[0.14, 0.42]}
                from="right"
                className="max-w-md text-right"
                textClassName="ml-auto max-w-md text-[1.35rem] leading-[1.35] lg:text-[1.8rem]"
                align="right"
              />
            </div>
          )}
          {block.habitItems?.[2] && (
            <div className="mt-12 pl-[8%]">
              <PosterSentence
                index={3}
                text={block.habitItems[2]}
                progress={scrollYProgress}
                range={[0.26, 0.52]}
                from="left"
                className="max-w-xl"
                textClassName="max-w-lg text-[1.6rem] leading-[1.18] lg:text-[2.45rem]"
              />
            </div>
          )}
          {block.habitItems?.[3] && (
            <div className="mt-10 flex justify-end pr-[14%]">
              <PosterSentence
                index={4}
                text={block.habitItems[3]}
                progress={scrollYProgress}
                range={[0.4, 0.66]}
                from="right"
                className="max-w-sm text-right"
                textClassName="ml-auto max-w-xs text-[1.2rem] leading-[1.3] lg:text-[1.65rem]"
                align="right"
              />
            </div>
          )}
          {block.habitItems?.[4] && (
            <div className="mt-12 pl-[18%]">
              <PosterSentence
                index={5}
                text={block.habitItems[4]}
                progress={scrollYProgress}
                range={[0.56, 0.84]}
                from="left"
                className="max-w-2xl"
                textClassName="max-w-2xl text-[1.35rem] leading-[1.28] lg:text-[2rem]"
              />
            </div>
          )}
        </div>

        <div className="mt-10 space-y-10 md:hidden">
          {block.habitItems?.map((item, i) => (
            <PosterSentence
              key={item}
              index={i + 1}
              text={item}
              progress={scrollYProgress}
              range={[0.06 + i * 0.08, 0.34 + i * 0.08]}
              from={i % 2 === 0 ? 'left' : 'right'}
              className={i % 2 === 0 ? 'max-w-[90%]' : 'ml-auto max-w-[82%] text-right'}
              textClassName={i === 0 ? 'text-[2.3rem] leading-[0.98]' : 'text-[1.35rem] leading-[1.28]'}
              align={i % 2 === 0 ? 'left' : 'right'}
            />
          ))}
        </div>

        {block.closer && (
          <motion.p
            style={{ opacity: useTransform(scrollYProgress, [0.68, 1], [0.2, 0.85]) }}
            className="relative z-10 mt-12 max-w-md font-serif italic text-lg leading-relaxed text-ink-200/70 md:mt-16 md:text-xl"
          >
            {block.closer}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

function PosterSentence({
  index,
  text,
  progress,
  range,
  from,
  className,
  textClassName,
  align = 'left',
}: {
  index: number;
  text: string;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  range: [number, number];
  from: 'left' | 'right';
  className?: string;
  textClassName?: string;
  align?: 'left' | 'right';
}) {
  const x = useTransform(progress, range, [from === 'left' ? -64 : 64, 0]);
  const opacity = useTransform(progress, range, [0.18, 1]);
  const blur = useTransform(progress, range, [12, 0]);
  const clip = useTransform(progress, range, [100, 0]);
  const filter = useMotionTemplate`blur(${blur}px)`;
  const clipPath =
    from === 'left'
      ? useMotionTemplate`inset(0 ${clip}% 0 0)`
      : useMotionTemplate`inset(0 0 0 ${clip}%)`;

  return (
    <motion.div
      style={{ x, opacity, filter, clipPath }}
      className={`relative z-10 ${className ?? ''}`}
    >
      <div
        className={`mb-4 flex items-center gap-4 font-mono text-[10px] tracking-[0.36em] uppercase text-ink-400 ${
          align === 'right' ? 'justify-end' : ''
        }`}
      >
        <span>{String(index).padStart(2, '0')}</span>
        <span className="h-px w-10 bg-ink-200/30" />
      </div>
      <p className={`font-serif text-ink-50 ${textClassName ?? ''}`}>{text}</p>
    </motion.div>
  );
}
