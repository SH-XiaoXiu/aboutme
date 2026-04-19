import { motion } from 'framer-motion';
import { useState } from 'react';
import { projects } from '../data/resume';
import ChapterHeader from './ChapterHeader';

const LINK_LABELS: Record<string, string> = {
  github: 'GITHUB',
  gitee: 'GITEE',
  homepage: 'HOMEPAGE',
};

function ProjectLinks({ p }: { p: (typeof projects)[number] }) {
  const links = (['github', 'gitee', 'homepage'] as const)
    .map((k) => (p[k] ? { k, url: p[k]! } : null))
    .filter(Boolean) as { k: 'github' | 'gitee' | 'homepage'; url: string }[];
  if (!links.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-6">
      {links.map((l) => (
        <a
          key={l.k}
          href={l.url}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="group/link flex items-center gap-2 font-mono text-[11px] tracking-[0.3em] text-ink-400 hover:text-ink-50 transition-colors"
        >
          <span className="inline-block w-4 h-px bg-current transition-all duration-300 group-hover/link:w-7" />
          <span>{LINK_LABELS[l.k]}</span>
          <span className="transition-transform duration-300 group-hover/link:translate-x-1">↗</span>
        </a>
      ))}
    </div>
  );
}

export default function Projects() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section className="relative px-8 md:px-16 py-32 md:py-48 text-ink-50 overflow-hidden">
      <div className="pointer-events-none absolute top-1/4 -left-40 w-[500px] h-[500px] rounded-full bg-ink-50/[0.025] blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 -right-40 w-[500px] h-[500px] rounded-full bg-ink-50/[0.02] blur-3xl" />

      <div className="relative z-10">
        <ChapterHeader
          index="04"
          label="SELECTED WORKS"
          title="做过的东西，"
          italicTitle="证明我还活着。"
          direction="zoom"
        />
      </div>

      {/* 抽屉式横排：悬停展开，离开整体收回 */}
      <div
        className="relative z-10 mt-12 md:mt-20 flex gap-2 md:gap-3 h-[62vh] md:h-[72vh]"
        onMouseLeave={() => setHoveredIdx(null)}
      >
        {projects.map((p, i) => {
          const primary = p.github || p.gitee || p.homepage;
          const [mainName, subName] = p.name.split(' · ');
          const isHovered = hoveredIdx === i;
          const someHovered = hoveredIdx !== null;

          return (
            <motion.div
              key={p.name}
              onMouseEnter={() => setHoveredIdx(i)}
              animate={{
                flexGrow: isHovered ? 4.2 : someHovered ? 0.9 : 1.5,
              }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ flexBasis: 0, flexShrink: 1, minWidth: 0 }}
              className="relative overflow-hidden bg-[var(--card-bg)]/55 backdrop-blur border border-ink-600/30 rounded-sm cursor-pointer group hover:border-ink-200/40 transition-colors"
            >
              {/* 底色叠一层暖金渐变制造层次 */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-ink-50/[0.04] via-transparent to-ink-50/[0.02]" />

              {/* 悬停时顶部细光条 */}
              <div
                className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ink-200/60 to-transparent transition-opacity duration-500"
                style={{ opacity: isHovered ? 1 : 0 }}
              />

              {/* 折叠态：居中斜向标题 */}
              <motion.div
                animate={{ opacity: isHovered ? 0 : 1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 pointer-events-none"
              >
                {/* 左上序号 */}
                <div className="absolute top-6 left-6 md:top-7 md:left-7 font-mono text-[10px] tracking-[0.35em] text-ink-400">
                  0{i + 1}
                </div>

                {/* 右下日期 */}
                {p.date && (
                  <div className="absolute bottom-6 right-6 md:bottom-7 md:right-7 font-mono text-[10px] tracking-[0.3em] text-ink-500">
                    {p.date}
                  </div>
                )}

                {/* 左下总数 */}
                <div className="absolute bottom-6 left-6 md:bottom-7 md:left-7 font-mono text-[10px] tracking-[0.35em] text-ink-600">
                  / {String(projects.length).padStart(2, '0')}
                </div>

                {/* 居中斜向标题 */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden px-4">
                  <div style={{ transform: 'rotate(-18deg)' }} className="text-center">
                    <h3 className="font-serif text-2xl md:text-3xl text-ink-50 leading-tight whitespace-nowrap">
                      {mainName}
                    </h3>
                    {subName && (
                      <p className="font-serif italic text-xs md:text-sm text-ink-400 mt-2 whitespace-nowrap">
                        {subName}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* 展开态：完整内容横排 */}
              <motion.div
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.35, delay: isHovered ? 0.2 : 0 }}
                style={{ pointerEvents: isHovered ? 'auto' : 'none' }}
                className="absolute inset-0 p-8 md:p-12 flex flex-col overflow-auto"
              >
                <div className="flex items-baseline justify-between mb-6 font-mono text-[10px] tracking-[0.3em] text-ink-400">
                  <span>
                    0{i + 1} / {String(projects.length).padStart(2, '0')}
                  </span>
                  {p.date && <span>{p.date}</span>}
                </div>

                <h3 className="font-serif leading-[1.05] mb-6">
                  {primary ? (
                    <a
                      href={primary}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-ink-50 hover:text-ink-200 transition-colors"
                    >
                      <span className="text-2xl md:text-4xl lg:text-5xl block">{mainName}</span>
                      {subName && (
                        <span className="block italic text-ink-400 text-base md:text-xl mt-2 font-light">
                          {subName}
                        </span>
                      )}
                    </a>
                  ) : (
                    <>
                      <span className="text-2xl md:text-4xl lg:text-5xl block text-ink-50">
                        {mainName}
                      </span>
                      {subName && (
                        <span className="block italic text-ink-400 text-base md:text-xl mt-2 font-light">
                          {subName}
                        </span>
                      )}
                    </>
                  )}
                </h3>

                <p className="text-ink-200/85 leading-relaxed text-[14px] md:text-[15px] font-light mb-6 max-w-2xl">
                  {p.desc}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 text-[10px] font-mono text-ink-400 border border-ink-600/60 rounded-full"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-auto">
                  <ProjectLinks p={p} />
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <p className="relative z-10 mt-8 font-mono text-[10px] tracking-[0.4em] uppercase text-ink-500">
        hover · to · expand
      </p>
    </section>
  );
}
