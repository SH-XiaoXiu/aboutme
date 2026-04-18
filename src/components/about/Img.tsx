import type { AboutImage } from '../../utils/aboutImages';

interface Props {
  image: AboutImage;
  className?: string;
  aspect?: string; // tailwind aspect utility
}

/** 默认黑白，hover 回色，边角标记，底部 caption 可选。 */
export default function Img({ image, className = '', aspect }: Props) {
  return (
    <figure className={`group relative overflow-hidden ${className}`}>
      <div className={`relative ${aspect ?? 'aspect-[3/4]'} overflow-hidden`}>
        <img
          src={image.src}
          alt={image.caption ?? image.key}
          loading="lazy"
          className="w-full h-full object-cover grayscale contrast-[1.05] brightness-95 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700 ease-out group-hover:scale-[1.02]"
        />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-ink-50/[0.04] group-hover:ring-ink-50/10 transition" />
      </div>
      {/* corner brackets */}
      <div className="pointer-events-none absolute top-1 left-1 w-3 h-3 border-t border-l border-ink-200/30" />
      <div className="pointer-events-none absolute top-1 right-1 w-3 h-3 border-t border-r border-ink-200/30" />
      <div className="pointer-events-none absolute bottom-1 left-1 w-3 h-3 border-b border-l border-ink-200/30" />
      <div className="pointer-events-none absolute bottom-1 right-1 w-3 h-3 border-b border-r border-ink-200/30" />
    </figure>
  );
}
