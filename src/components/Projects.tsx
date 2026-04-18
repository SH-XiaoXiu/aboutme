import { motion } from 'framer-motion';
import { projects } from '../data/resume';
import TiltCard from './TiltCard';
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
  return (
    <section className="relative px-8 md:px-20 py-32 md:py-48 text-ink-50 overflow-hidden">
      <div className="pointer-events-none absolute top-1/4 -left-40 w-[500px] h-[500px] rounded-full bg-ink-50/[0.025] blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 -right-40 w-[500px] h-[500px] rounded-full bg-ink-50/[0.02] blur-3xl" />

      <div className="relative z-10">
        <ChapterHeader
          index="04"
          label="SELECTED WORKS"
          title="做过的东西，"
          italicTitle="证明我还活着。"
        />
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((p, i) => {
          const primary = p.github || p.gitee || p.homepage;
          const [mainName, subName] = p.name.split(' · ');

          return (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, delay: (i % 2) * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <TiltCard className="h-full" intensity={4}>
                <article className="relative h-full bg-[#111110]/55 backdrop-blur border border-ink-600/30 p-7 md:p-9 rounded-sm overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-ink-200/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex items-center justify-between mb-5 font-mono text-[10px] tracking-[0.3em] text-ink-400">
                    <span>0{i + 1} / {String(projects.length).padStart(2, '0')}</span>
                    {p.date && <span>{p.date}</span>}
                  </div>

                  <h3 className="font-serif leading-[1.1] mb-5">
                    {primary ? (
                      <a
                        href={primary}
                        target="_blank"
                        rel="noreferrer"
                        className="text-ink-50 hover:text-ink-200 transition-colors"
                      >
                        <span className="text-2xl md:text-3xl block">{mainName}</span>
                        {subName && (
                          <span className="block italic text-ink-400 text-base md:text-lg mt-1 font-light">
                            {subName}
                          </span>
                        )}
                      </a>
                    ) : (
                      <>
                        <span className="text-2xl md:text-3xl block text-ink-50">{mainName}</span>
                        {subName && (
                          <span className="block italic text-ink-400 text-base md:text-lg mt-1 font-light">
                            {subName}
                          </span>
                        )}
                      </>
                    )}
                  </h3>

                  <p className="text-ink-200/75 leading-relaxed text-sm font-light mb-5">{p.desc}</p>

                  <div className="flex flex-wrap gap-1.5">
                    {p.tech.slice(0, 6).map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 text-[10px] font-mono text-ink-400 border border-ink-600/50 rounded-full group-hover:border-ink-200/40 group-hover:text-ink-200 transition-colors"
                      >
                        {t}
                      </span>
                    ))}
                    {p.tech.length > 6 && (
                      <span className="px-2 py-0.5 text-[10px] font-mono text-ink-400/70">
                        +{p.tech.length - 6}
                      </span>
                    )}
                  </div>

                  <ProjectLinks p={p} />
                </article>
              </TiltCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
