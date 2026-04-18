import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { contact, basic } from '../data/resume';
import { DecryptedText, VariableProximity } from './FancyText';

type LinkKind = 'link' | 'qr';

interface ContactItem {
  label: string;
  value: string;
  href?: string;
  kind: LinkKind;
  qrSrc?: string;
}

const items: ContactItem[] = [
  { label: 'Email', value: contact.email, href: `mailto:${contact.email}`, kind: 'link' },
  { label: 'GitHub', value: contact.github, href: `https://${contact.github}`, kind: 'link' },
  { label: 'Gitee', value: contact.gitee, href: `https://${contact.gitee}`, kind: 'link' },
  { label: 'Website', value: contact.website, href: `https://${contact.website}`, kind: 'link' },
  { label: 'Douyin', value: '扫码 · hover 查看', kind: 'qr', qrSrc: '/douyin-qr.jpg' },
];

export default function Contact() {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end end'],
  });
  const titleScale = useTransform(scrollYProgress, [0, 0.6], [0.9, 1]);
  const titleY = useTransform(scrollYProgress, [0, 0.6], [60, 0]);

  return (
    <section ref={ref} className="relative px-8 md:px-20 py-32 md:py-48 text-ink-50 overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-[80%]" style={{ background: 'radial-gradient(ellipse at center, rgba(248,246,241,0.05) 0%, transparent 60%)' }} />

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-12 font-mono">
          <span className="text-xs text-ink-400">06 /</span>
          <span className="text-xs tracking-[0.4em] uppercase text-ink-200/70">
            <DecryptedText text="EPILOGUE" trigger="view" />
          </span>
          <div className="flex-1 h-px bg-ink-600/50" />
        </div>

        <motion.h2
          style={{ scale: titleScale, y: titleY }}
          className="font-serif text-[clamp(4rem,14vw,14rem)] leading-[0.9] text-ink-50 mb-20 cursor-default select-none"
        >
          <div className="overflow-hidden">
            <motion.div
              initial={{ y: '100%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
            >
              <VariableProximity text="让我们，" radius={180} />
            </motion.div>
          </div>
          <div className="overflow-hidden italic text-ink-400">
            <motion.div
              initial={{ y: '100%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1.1, delay: 0.15, ease: [0.76, 0, 0.24, 1] }}
            >
              <VariableProximity text="聊点什么。" radius={180} />
            </motion.div>
          </div>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-5xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <p className="text-ink-200/80 font-light leading-relaxed text-lg mb-8 max-w-md">
              如果你对我做过的事感兴趣，或者有有趣的项目想一起聊聊，
              <br />
              欢迎通过以下任意方式联系我。
            </p>
            <div className="text-xs tracking-widest uppercase text-ink-400 font-mono">
              — {basic.name}
            </div>
          </motion.div>

          <div className="space-y-px bg-ink-600/30">
            {items.map((l, i) => {
              const content = (
                <>
                  <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-px bg-ink-50 origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-out" />
                  <div className="relative">
                    <div className="text-[10px] tracking-[0.4em] uppercase text-ink-400 mb-1 font-mono">
                      {l.label}
                    </div>
                    <div className="font-serif text-xl text-ink-50">{l.value}</div>
                  </div>
                  <div className="text-ink-400 group-hover:text-ink-50 group-hover:translate-x-3 transition-all duration-500">
                    {l.kind === 'qr' ? '⌗' : '→'}
                  </div>

                  {l.kind === 'qr' && (
                    <div
                      className="pointer-events-none absolute right-full top-1/2 -translate-y-1/2 mr-4 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out z-30"
                    >
                      <div className="relative bg-[#ede6d1] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.6)]" style={{ width: '13rem' }}>
                        <img
                          src={l.qrSrc}
                          alt="Douyin QR"
                          className="block w-full h-auto"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                            const ph = e.currentTarget.nextElementSibling as HTMLDivElement | null;
                            if (ph) ph.style.display = 'flex';
                          }}
                        />
                        <div
                          className="hidden w-full aspect-square items-center justify-center text-[10px] tracking-[0.3em] uppercase text-ink-600 bg-[#f4efd9] font-mono text-center px-2 leading-relaxed"
                        >
                          — 把二维码<br />放到 public/douyin-qr.png —
                        </div>
                        <div className="mt-2 text-center font-mono text-[9px] tracking-[0.4em] uppercase text-ink-800">
                          DOUYIN
                        </div>
                        {/* pointer */}
                        <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-[#ede6d1] rotate-45" />
                      </div>
                    </div>
                  )}
                </>
              );

              const baseClass = 'group relative flex items-center justify-between bg-transparent hover:bg-[#111110] px-6 py-7 transition-colors';
              const motionProps = {
                initial: { opacity: 0, x: 30 },
                whileInView: { opacity: 1, x: 0 },
                viewport: { once: true },
                transition: { duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
              };

              if (l.kind === 'link' && l.href) {
                return (
                  <motion.a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    {...motionProps}
                    className={baseClass}
                  >
                    {content}
                  </motion.a>
                );
              }
              return (
                <motion.div key={l.label} {...motionProps} className={`${baseClass} cursor-pointer`}>
                  {content}
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.8 }}
          className="mt-40 pt-8 border-t border-ink-600/30 flex items-center justify-between text-[10px] tracking-[0.4em] uppercase text-ink-400 font-mono"
        >
          <span>© {new Date().getFullYear()} {basic.name}</span>
          <span>— FIN —</span>
        </motion.div>
      </div>
    </section>
  );
}
