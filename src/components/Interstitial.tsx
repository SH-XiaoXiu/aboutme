import { motion, useMotionTemplate, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef } from 'react';
import { DecryptedText } from './FancyText';

export type InterstitialVariant = 'default' | 'curtain' | 'diagonal' | 'radial' | 'glitch';

interface Props {
  from: string;
  to: string;
  toLabel: string;
  quote?: string;
  variant?: InterstitialVariant;
}

interface VariantProps {
  scrollYProgress: MotionValue<number>;
  from: string;
  to: string;
  toLabel: string;
  quote?: string;
}

/** 章节之间的过场：一屏高度的静默插片，像胶片过片头。 */
export default function Interstitial({ from, to, toLabel, quote, variant = 'default' }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const props: VariantProps = { scrollYProgress, from, to, toLabel, quote };

  return (
    <section ref={ref} className="relative h-[80vh] flex items-center justify-center overflow-hidden">
      {variant === 'default'  && <DefaultVariant  {...props} />}
      {variant === 'curtain'  && <CurtainVariant  {...props} />}
      {variant === 'diagonal' && <DiagonalVariant {...props} />}
      {variant === 'radial'   && <RadialVariant   {...props} />}
      {variant === 'glitch'   && <GlitchVariant   {...props} />}
    </section>
  );
}

// ─── Default ─────────────────────────────────────────────────────────────────

function DefaultVariant({ scrollYProgress, from, to, toLabel, quote }: VariantProps) {
  const fromOpacity  = useTransform(scrollYProgress, [0.2, 0.4, 0.5], [0, 1, 0]);
  const fromX        = useTransform(scrollYProgress, [0.2, 0.5], ['-10%', '-40%']);
  const toOpacity    = useTransform(scrollYProgress, [0.5, 0.6, 0.8], [0, 1, 0]);
  const toX          = useTransform(scrollYProgress, [0.5, 0.8], ['40%', '10%']);
  const lineScale    = useTransform(scrollYProgress, [0.3, 0.7], [0, 1]);
  const quoteOpacity = useTransform(scrollYProgress, [0.45, 0.55, 0.65], [0, 1, 0]);

  return (
    <div className="relative w-full max-w-6xl px-8 md:px-20">
      <div className="relative flex items-center justify-center gap-8 md:gap-16">
        <motion.div
          style={{ opacity: fromOpacity, x: fromX }}
          className="font-serif text-[18vw] md:text-[14vw] leading-none text-ink-50/[0.06] select-none"
        >
          {from}
        </motion.div>

        <motion.div
          style={{ scaleX: lineScale }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-ink-200/60 to-transparent origin-center"
        />

        <motion.div
          style={{ opacity: toOpacity, x: toX }}
          className="font-serif text-[18vw] md:text-[14vw] leading-none text-ink-50/[0.12] select-none"
        >
          {to}
        </motion.div>
      </div>

      <QuoteBlock quote={quote} toLabel={toLabel} opacity={quoteOpacity} />
    </div>
  );
}

// ─── Curtain ──────────────────────────────────────────────────────────────────
// 一道细竖线从左向右扫过，like 电影放映机的进片门

function CurtainVariant({ scrollYProgress, from, to, toLabel, quote }: VariantProps) {
  // 扫描线：从屏幕左边到右边（用 translateX 驱动）
  const scanX        = useTransform(scrollYProgress, [0.18, 0.82], ['0vw', '100vw']);

  // from 数字：随扫描线推进，从右向左飞出
  const fromOpacity  = useTransform(scrollYProgress, [0.15, 0.28, 0.5], [0, 1, 0]);
  const fromX        = useTransform(scrollYProgress, [0.15, 0.5], ['0%', '-55%']);

  // to 数字：扫描线过后从右侧推入
  const toOpacity    = useTransform(scrollYProgress, [0.5, 0.68, 0.85], [0, 1, 0]);
  const toX          = useTransform(scrollYProgress, [0.5, 0.85], ['55%', '0%']);

  const quoteOpacity = useTransform(scrollYProgress, [0.44, 0.5, 0.56], [0, 1, 0]);

  return (
    <div className="relative w-full h-full">
      {/* 细竖向扫描线 */}
      <motion.div
        style={{
          x: scanX,
          background: 'linear-gradient(to bottom, transparent 0%, rgba(221,213,197,0.5) 15%, rgba(221,213,197,0.9) 50%, rgba(221,213,197,0.5) 85%, transparent 100%)',
        }}
        className="absolute left-0 top-0 bottom-0 w-px pointer-events-none"
      />

      {/* from 数字 */}
      <motion.div
        style={{ opacity: fromOpacity, x: fromX }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[18vw] md:text-[14vw] leading-none text-ink-50/20 select-none"
      >
        {from}
      </motion.div>

      {/* to 数字 */}
      <motion.div
        style={{ opacity: toOpacity, x: toX }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[18vw] md:text-[14vw] leading-none text-ink-50/30 select-none"
      >
        {to}
      </motion.div>

      <QuoteBlock quote={quote} toLabel={toLabel} opacity={quoteOpacity} />
    </div>
  );
}

// ─── Diagonal ─────────────────────────────────────────────────────────────────
// 斜向对角线切割，数字分布在左下/右上象限

function DiagonalVariant({ scrollYProgress, from, to, toLabel, quote }: VariantProps) {
  const fromOpacity  = useTransform(scrollYProgress, [0.15, 0.32, 0.5], [0, 1, 0]);
  const fromX        = useTransform(scrollYProgress, [0.15, 0.5], ['10%', '-8%']);
  const fromY        = useTransform(scrollYProgress, [0.15, 0.5], ['-5%', '0%']);

  const toOpacity    = useTransform(scrollYProgress, [0.5, 0.68, 0.85], [0, 1, 0]);
  const toX          = useTransform(scrollYProgress, [0.5, 0.85], ['-10%', '8%']);
  const toY          = useTransform(scrollYProgress, [0.5, 0.85], ['5%', '0%']);

  const lineScale    = useTransform(scrollYProgress, [0.28, 0.55], [0, 1]);
  const lineOpacity  = useTransform(scrollYProgress, [0.28, 0.4, 0.6, 0.72], [0, 1, 1, 0]);

  const quoteOpacity = useTransform(scrollYProgress, [0.43, 0.5, 0.57], [0, 1, 0]);
  const quoteRotate  = useTransform(scrollYProgress, [0.43, 0.5], [-1.5, 0]);

  return (
    <div className="relative w-full h-full">
      {/* from 数字 — 右上象限 */}
      <motion.div
        style={{ opacity: fromOpacity, x: fromX, y: fromY }}
        className="absolute top-[10%] right-[8%] font-serif text-[16vw] md:text-[12vw] leading-none text-ink-50/20 select-none"
      >
        {from}
      </motion.div>

      {/* 对角线：scaleX从中心扩展 */}
      <motion.div
        style={{ scaleX: lineScale, opacity: lineOpacity }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 origin-center"
      >
        <div
          className="w-[140vw] h-px bg-gradient-to-r from-transparent via-ink-200/70 to-transparent"
          style={{ transform: 'rotate(-32deg)' }}
        />
      </motion.div>

      {/* to 数字 — 左下象限 */}
      <motion.div
        style={{ opacity: toOpacity, x: toX, y: toY }}
        className="absolute bottom-[10%] left-[8%] font-serif text-[16vw] md:text-[12vw] leading-none text-ink-50/30 select-none"
      >
        {to}
      </motion.div>

      {/* Quote — 中心，微旋入 */}
      <motion.div
        style={{ opacity: quoteOpacity, rotate: quoteRotate }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10 pointer-events-none w-full px-8"
      >
        {quote && (
          <div className="font-serif italic text-ink-200/80 text-xl md:text-3xl mb-6 max-w-2xl mx-auto leading-relaxed">
            "{quote}"
          </div>
        )}
        <div className="font-mono text-[10px] md:text-xs tracking-[0.5em] uppercase text-ink-400">
          <DecryptedText text={`NEXT · ${toLabel}`} trigger="view" speed={35} />
        </div>
      </motion.div>
    </div>
  );
}

// ─── Radial ───────────────────────────────────────────────────────────────────
// 镜头光圈从中心扩散，快门叶片辐射线

function RadialVariant({ scrollYProgress, from, to, toLabel, quote }: VariantProps) {
  const circleR      = useTransform(scrollYProgress, [0.2, 0.5, 0.8], ['0%', '75%', '0%']);
  const circleClip   = useMotionTemplate`circle(${circleR} at 50% 50%)`;
  const glowOpacity  = useTransform(scrollYProgress, [0.2, 0.35, 0.65, 0.8], [0, 1, 1, 0]);

  const fromOpacity  = useTransform(scrollYProgress, [0.2, 0.38, 0.5], [0, 1, 0]);
  const fromScale    = useTransform(scrollYProgress, [0.2, 0.5], [0.8, 1.08]);
  const toOpacity    = useTransform(scrollYProgress, [0.5, 0.62, 0.8], [0, 1, 0]);
  const toScale      = useTransform(scrollYProgress, [0.5, 0.8], [1.15, 0.93]);

  const spokeOpacity = useTransform(scrollYProgress, [0.28, 0.42, 0.58, 0.72], [0, 0.6, 0.6, 0]);
  const spokeRotate  = useTransform(scrollYProgress, [0.2, 0.8], [0, 50]);

  const quoteOpacity = useTransform(scrollYProgress, [0.44, 0.5, 0.56], [0, 1, 0]);
  const quoteScale   = useTransform(scrollYProgress, [0.44, 0.5, 0.56], [0.93, 1, 0.93]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* 圆形暖金光晕（clip-path控制圆形边界） */}
      <motion.div
        style={{ clipPath: circleClip, opacity: glowOpacity }}
        className="absolute inset-0 pointer-events-none"
      >
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(circle at 50% 50%, rgba(160,129,96,0.35) 0%, rgba(140,110,80,0.18) 40%, transparent 70%)' }}
        />
      </motion.div>

      {/* 快门辐射线 */}
      <motion.div
        style={{ opacity: spokeOpacity, rotate: spokeRotate }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute inset-0" preserveAspectRatio="xMidYMid slice">
          {Array.from({ length: 8 }).map((_, i) => (
            <line
              key={i}
              x1="50" y1="50"
              x2={50 + 60 * Math.cos((i * Math.PI) / 4)}
              y2={50 + 60 * Math.sin((i * Math.PI) / 4)}
              stroke="rgba(221,213,197,0.25)"
              strokeWidth="0.3"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
      </motion.div>

      {/* from 数字 */}
      <motion.div
        style={{ opacity: fromOpacity, scale: fromScale }}
        className="absolute font-serif text-[18vw] md:text-[14vw] leading-none text-ink-50/20 select-none"
      >
        {from}
      </motion.div>

      {/* to 数字 */}
      <motion.div
        style={{ opacity: toOpacity, scale: toScale }}
        className="absolute font-serif text-[18vw] md:text-[14vw] leading-none text-ink-50/30 select-none"
      >
        {to}
      </motion.div>

      {/* Quote */}
      <motion.div
        style={{ opacity: quoteOpacity, scale: quoteScale }}
        className="relative z-10 text-center pointer-events-none px-8"
      >
        {quote && (
          <div className="font-serif italic text-ink-200/80 text-xl md:text-3xl mb-6 max-w-2xl mx-auto leading-relaxed">
            "{quote}"
          </div>
        )}
        <div className="font-mono text-[10px] md:text-xs tracking-[0.5em] uppercase text-ink-400">
          <DecryptedText text={`NEXT · ${toLabel}`} trigger="view" speed={35} />
        </div>
      </motion.div>
    </div>
  );
}

// ─── Glitch ───────────────────────────────────────────────────────────────────
// 数字信号故障：RGB通道分离 + 画面撕裂 + 几何畸变

function GlitchVariant({ scrollYProgress, from, to, toLabel, quote }: VariantProps) {
  const fromOpacity  = useTransform(scrollYProgress, [0.2, 0.35, 0.5], [0, 1, 0]);
  const toOpacity    = useTransform(scrollYProgress, [0.5, 0.65, 0.8], [0, 1, 0]);
  const mainSkewX    = useTransform(scrollYProgress, [0.35, 0.42, 0.5, 0.58, 0.65], [0, -5, 0, 4, 0]);

  // RGB 通道错位：偏移量更大，更强烈
  const redX         = useTransform(scrollYProgress, [0.35, 0.43, 0.5, 0.57, 0.65], [0, 22, -12, 24, 0]);
  const redY         = useTransform(scrollYProgress, [0.35, 0.5, 0.65], [0, -6, 0]);
  const blueX        = useTransform(scrollYProgress, [0.35, 0.43, 0.5, 0.57, 0.65], [0, -18, 10, -20, 0]);

  // 撕裂条带
  const tear1Opacity = useTransform(scrollYProgress, [0.38, 0.44, 0.56, 0.62], [0, 1, 1, 0]);
  const tear1X       = useTransform(scrollYProgress, [0.38, 0.5, 0.62], [-25, 35, -20]);
  const tear2Opacity = useTransform(scrollYProgress, [0.40, 0.46, 0.54, 0.60], [0, 1, 1, 0]);
  const tear2X       = useTransform(scrollYProgress, [0.40, 0.5, 0.60], [20, -30, 25]);

  const lineScale    = useTransform(scrollYProgress, [0.35, 0.65], [0, 1]);
  const lineOpacity  = useTransform(scrollYProgress, [0.35, 0.45, 0.55, 0.65], [0, 1, 1, 0]);
  const quoteOpacity = useTransform(scrollYProgress, [0.44, 0.5, 0.56], [0, 1, 0]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <motion.div
        style={{ skewX: mainSkewX }}
        className="relative w-full max-w-6xl px-8 md:px-20"
      >
        {/* 主数字层 */}
        <div className="relative flex items-center justify-center gap-8 md:gap-16">
          <motion.div
            style={{ opacity: fromOpacity }}
            className="font-serif text-[18vw] md:text-[14vw] leading-none text-ink-50/20 select-none"
          >
            {from}
          </motion.div>

          {/* 中央横线 */}
          <motion.div
            style={{
              scaleX: lineScale,
              opacity: lineOpacity,
              background: 'linear-gradient(to right, transparent, rgba(221,213,197,0.7) 30%, rgba(221,213,197,1) 50%, rgba(221,213,197,0.7) 70%, transparent)',
            }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-px origin-center"
          />

          <motion.div
            style={{ opacity: toOpacity }}
            className="font-serif text-[18vw] md:text-[14vw] leading-none text-ink-50/30 select-none"
          >
            {to}
          </motion.div>
        </div>

        {/* RGB 红色通道副本 */}
        <motion.div
          style={{ opacity: fromOpacity, x: redX, y: redY }}
          className="absolute inset-0 flex items-center justify-center gap-8 md:gap-16 pointer-events-none"
        >
          <div
            className="font-serif text-[18vw] md:text-[14vw] leading-none select-none"
            style={{ color: 'rgba(255,60,60,0.28)', mixBlendMode: 'screen' }}
          >
            {from}
          </div>
        </motion.div>

        {/* RGB 蓝色通道副本 */}
        <motion.div
          style={{ opacity: fromOpacity, x: blueX }}
          className="absolute inset-0 flex items-center justify-center gap-8 md:gap-16 pointer-events-none"
        >
          <div
            className="font-serif text-[18vw] md:text-[14vw] leading-none select-none"
            style={{ color: 'rgba(60,60,255,0.22)', mixBlendMode: 'screen' }}
          >
            {from}
          </div>
        </motion.div>

        {/* 撕裂条带 1 */}
        <motion.div
          style={{ opacity: tear1Opacity, x: tear1X, top: '30%', height: '12px' }}
          className="absolute left-0 right-0 overflow-hidden pointer-events-none flex items-center justify-center gap-8 md:gap-16"
        >
          <div className="font-serif text-[18vw] md:text-[14vw] leading-none text-ink-50/40 select-none whitespace-nowrap">
            {from}
          </div>
        </motion.div>

        {/* 撕裂条带 2 */}
        <motion.div
          style={{ opacity: tear2Opacity, x: tear2X, top: '62%', height: '10px' }}
          className="absolute left-0 right-0 overflow-hidden pointer-events-none flex items-center justify-center gap-8 md:gap-16"
        >
          <div className="font-serif text-[18vw] md:text-[14vw] leading-none text-ink-50/35 select-none whitespace-nowrap">
            {to}
          </div>
        </motion.div>
      </motion.div>

      <QuoteBlock quote={quote} toLabel={toLabel} opacity={quoteOpacity} />
    </div>
  );
}

// ─── Shared ───────────────────────────────────────────────────────────────────

function QuoteBlock({
  quote,
  toLabel,
  opacity,
}: {
  quote?: string;
  toLabel: string;
  opacity: MotionValue<number>;
}) {
  return (
    <motion.div
      style={{ opacity }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10 pointer-events-none w-full px-8"
    >
      {quote && (
        <div className="font-serif italic text-ink-200/80 text-xl md:text-3xl mb-6 max-w-2xl mx-auto leading-relaxed">
          "{quote}"
        </div>
      )}
      <div className="font-mono text-[10px] md:text-xs tracking-[0.5em] uppercase text-ink-400">
        <DecryptedText text={`NEXT · ${toLabel}`} trigger="view" speed={35} />
      </div>
    </motion.div>
  );
}
