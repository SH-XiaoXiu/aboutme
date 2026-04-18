import { useRef, useState, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

export default function TiltCard({ children, className = '', intensity = 8 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [glow, setGlow] = useState({ x: 50, y: 50, active: false });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const tiltX = (y - 0.5) * -intensity;
    const tiltY = (x - 0.5) * intensity;
    setStyle({
      transform: `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.01)`,
    });
    setGlow({ x: x * 100, y: y * 100, active: true });
  };

  const onLeave = () => {
    setStyle({
      transform: 'perspective(1200px) rotateX(0) rotateY(0) scale(1)',
    });
    setGlow((g) => ({ ...g, active: false }));
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`relative transition-transform duration-300 ease-out will-change-transform ${className}`}
      style={style}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity: glow.active ? 1 : 0,
          background: `radial-gradient(400px circle at ${glow.x}% ${glow.y}%, rgba(201, 168, 118, 0.15), transparent 50%)`,
        }}
      />
      {children}
    </div>
  );
}
