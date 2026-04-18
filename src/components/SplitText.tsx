import { motion } from 'framer-motion';

interface Props {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}

export default function SplitText({ text, className = '', delay = 0, stagger = 0.04 }: Props) {
  const chars = Array.from(text);
  return (
    <span className={`inline-block ${className}`} aria-label={text}>
      {chars.map((c, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block"
          initial={{ y: '100%', opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{
            duration: 0.7,
            delay: delay + i * stagger,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ display: 'inline-block' }}
        >
          {c === ' ' ? '\u00A0' : c}
        </motion.span>
      ))}
    </span>
  );
}
