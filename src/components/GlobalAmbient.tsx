import { useEffect, useState } from 'react';
import InteractiveParticles from './InteractiveParticles';

/** 固定在视口后方的全站粒子层。一个实例，穿越所有章节，不在章节间断裂。 */
export default function GlobalAmbient() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -((e.clientY / window.innerHeight) * 2 - 1);
      setMouse({ x: x * 1.2, y: y * 1.2 });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: 0.22 }}
    >
      <InteractiveParticles mouse={mouse} />
    </div>
  );
}
