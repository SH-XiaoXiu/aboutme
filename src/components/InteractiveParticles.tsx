import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  mouse: { x: number; y: number };
}

function Field({ mouse }: Props) {
  const ref = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();

  const COUNT = 4000;

  const { positions, randoms } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const rnd = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      // spread across full screen volume
      pos[i * 3] = (Math.random() - 0.5) * 24;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
      rnd[i * 3] = Math.random();
      rnd[i * 3 + 1] = Math.random();
      rnd[i * 3 + 2] = Math.random();
    }
    return { positions: pos, randoms: rnd };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uAspect: { value: 1 },
    }),
    []
  );

  useFrame((state) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    materialRef.current.uniforms.uMouse.value.x = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uMouse.value.x,
      mouse.x * 10,
      0.08
    );
    materialRef.current.uniforms.uMouse.value.y = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uMouse.value.y,
      mouse.y * 6,
      0.08
    );
    materialRef.current.uniforms.uAspect.value = size.width / size.height;
  });

  const vert = `
    attribute vec3 aRandom;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uPixelRatio;
    varying float vGlow;

    void main() {
      vec3 pos = position;

      // gentle orbit / drift
      float t = uTime * 0.2;
      pos.x += sin(t + aRandom.x * 6.28) * 0.3;
      pos.y += cos(t * 0.8 + aRandom.y * 6.28) * 0.3;
      pos.z += sin(t * 0.5 + aRandom.z * 6.28) * 0.2;

      // push away from mouse (2D in xy plane)
      vec2 toMouse = pos.xy - uMouse;
      float d = length(toMouse);
      float force = smoothstep(3.5, 0.0, d) * 1.8;
      pos.xy += normalize(toMouse + 0.0001) * force;

      vec4 mv = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mv;

      float size = (1.0 + aRandom.z * 1.2) * uPixelRatio;
      gl_PointSize = size * (40.0 / -mv.z);

      vGlow = force * 0.7 + smoothstep(0.3, 0.0, d) * 0.3;
    }
  `;

  const frag = `
    varying float vGlow;
    void main() {
      vec2 uv = gl_PointCoord - 0.5;
      float d = length(uv);
      if (d > 0.5) discard;
      float alpha = smoothstep(0.5, 0.0, d);
      vec3 base = vec3(0.88, 0.85, 0.78); // soft ivory
      vec3 hot = vec3(0.98, 0.94, 0.86);
      vec3 col = mix(base, hot, vGlow);
      gl_FragColor = vec4(col, alpha * (0.18 + vGlow * 0.5));
    }
  `;

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={COUNT}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          count={COUNT}
          array={randoms}
          itemSize={3}
          args={[randoms, 3]}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vert}
        fragmentShader={frag}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function InteractiveParticles({ mouse }: Props) {
  return (
    <Canvas
      className="!absolute inset-0"
      camera={{ position: [0, 0, 8], fov: 55 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <Field mouse={mouse} />
    </Canvas>
  );
}
