import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  mouse: { x: number; y: number };
}

/* ===================== 底层：余烬 ===================== */
function EmberField({ mouse }: Props) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const COUNT = 900;

  const { positions, randoms } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const rnd = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 26;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
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
    }),
    []
  );

  useFrame((state) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    materialRef.current.uniforms.uMouse.value.x = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uMouse.value.x,
      mouse.x * 10,
      0.06
    );
    materialRef.current.uniforms.uMouse.value.y = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uMouse.value.y,
      mouse.y * 6,
      0.06
    );
  });

  const vert = `
    attribute vec3 aRandom;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uPixelRatio;
    varying float vHeat;

    void main() {
      vec3 pos = position;
      float speed = 0.08 + aRandom.z * 0.22;
      float phase = aRandom.x * 6.2831;
      pos.y = mod(pos.y + uTime * speed + phase, 16.0) - 8.0;
      pos.x += sin(uTime * 0.35 + aRandom.y * 6.2831) * 0.22;

      vec2 toMouse = uMouse - pos.xy;
      float d = length(toMouse);
      float attract = smoothstep(3.6, 0.0, d) * 0.45;
      pos.xy += toMouse * attract * 0.08;

      vec4 mv = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mv;

      float base = 0.7 + aRandom.z * 1.4;
      float hero = step(0.85, aRandom.z) * 2.2;
      gl_PointSize = (base + hero) * uPixelRatio * (40.0 / -mv.z);

      vHeat = attract + aRandom.z * 0.15;
    }
  `;

  const frag = `
    varying float vHeat;
    void main() {
      vec2 uv = gl_PointCoord - 0.5;
      float d = length(uv);
      if (d > 0.5) discard;

      float core  = smoothstep(0.18, 0.0, d);
      float outer = smoothstep(0.5, 0.08, d);

      vec3 cCool = vec3(0.64, 0.54, 0.38);
      vec3 cWarm = vec3(0.92, 0.78, 0.55);
      vec3 cHot  = vec3(1.00, 0.90, 0.72);
      vec3 col = mix(cCool, cWarm, core);
      col = mix(col, cHot, vHeat);

      float a = outer * (0.22 + vHeat * 0.55);
      gl_FragColor = vec4(col, a);
    }
  `;

  return (
    <points>
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

/* ===================== 上层：星座网 ===================== */
/**
 * 慢漂的节点 + 动态近邻连线。
 * 鼠标作为虚拟节点参与连线（鼠标附近连线更亮/更多）。
 */
function ConstellationWeb({ mouse }: Props) {
  const NODE_COUNT = 70;
  const MAX_LINKS = NODE_COUNT * 6; // 每个节点最多 6 条连线
  const LINK_THRESHOLD = 3.4;       // 世界坐标距离阈值
  const BOUNDS = { x: 13, y: 8 };

  // 节点本地状态（位置 + 速度）
  const nodes = useMemo(() => {
    const arr: { x: number; y: number; vx: number; vy: number; z: number }[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      arr.push({
        x: (Math.random() - 0.5) * BOUNDS.x * 2,
        y: (Math.random() - 0.5) * BOUNDS.y * 2,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        z: (Math.random() - 0.5) * 2,
      });
    }
    return arr;
  }, []);

  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const nodePositions = useMemo(() => new Float32Array(NODE_COUNT * 3), []);
  const linePositions = useMemo(() => new Float32Array(MAX_LINKS * 2 * 3), []);
  const lineAlphas = useMemo(() => new Float32Array(MAX_LINKS * 2), []);

  const pointGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
    return g;
  }, [nodePositions]);

  const lineGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    g.setAttribute('aAlpha', new THREE.BufferAttribute(lineAlphas, 1));
    return g;
  }, [linePositions, lineAlphas]);

  const mouseWorld = useRef(new THREE.Vector2(0, 0));

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30); // 保护
    // 平滑鼠标世界坐标
    mouseWorld.current.x = THREE.MathUtils.lerp(mouseWorld.current.x, mouse.x * 10, 0.08);
    mouseWorld.current.y = THREE.MathUtils.lerp(mouseWorld.current.y, mouse.y * 6, 0.08);

    // 更新节点位置（匀速 + 边界反弹）
    for (const n of nodes) {
      n.x += n.vx * dt * 10;
      n.y += n.vy * dt * 10;
      if (n.x > BOUNDS.x || n.x < -BOUNDS.x) n.vx *= -1;
      if (n.y > BOUNDS.y || n.y < -BOUNDS.y) n.vy *= -1;
      n.x = Math.max(-BOUNDS.x, Math.min(BOUNDS.x, n.x));
      n.y = Math.max(-BOUNDS.y, Math.min(BOUNDS.y, n.y));
    }

    // 写入 points 几何
    for (let i = 0; i < NODE_COUNT; i++) {
      nodePositions[i * 3] = nodes[i].x;
      nodePositions[i * 3 + 1] = nodes[i].y;
      nodePositions[i * 3 + 2] = nodes[i].z;
    }
    pointGeom.attributes.position.needsUpdate = true;

    // 建立连线（O(n^2)，n=70 → 2415 对，完全可接受）
    let linkIdx = 0;
    const thr2 = LINK_THRESHOLD * LINK_THRESHOLD;
    for (let i = 0; i < NODE_COUNT && linkIdx < MAX_LINKS; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < NODE_COUNT && linkIdx < MAX_LINKS; j++) {
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < thr2) {
          const d = Math.sqrt(d2);
          const alpha = Math.max(0, 1 - d / LINK_THRESHOLD);
          const base = linkIdx * 2 * 3;
          linePositions[base] = a.x;
          linePositions[base + 1] = a.y;
          linePositions[base + 2] = a.z;
          linePositions[base + 3] = b.x;
          linePositions[base + 4] = b.y;
          linePositions[base + 5] = b.z;
          lineAlphas[linkIdx * 2] = alpha;
          lineAlphas[linkIdx * 2 + 1] = alpha;
          linkIdx++;
        }
      }
    }

    // 鼠标与节点的连线（更亮、更长范围）
    const MOUSE_THR = 4.2;
    const mThr2 = MOUSE_THR * MOUSE_THR;
    for (let i = 0; i < NODE_COUNT && linkIdx < MAX_LINKS; i++) {
      const n = nodes[i];
      const dx = n.x - mouseWorld.current.x;
      const dy = n.y - mouseWorld.current.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < mThr2) {
        const d = Math.sqrt(d2);
        const alpha = Math.max(0, 1 - d / MOUSE_THR) * 1.4;
        const base = linkIdx * 2 * 3;
        linePositions[base] = n.x;
        linePositions[base + 1] = n.y;
        linePositions[base + 2] = n.z;
        linePositions[base + 3] = mouseWorld.current.x;
        linePositions[base + 4] = mouseWorld.current.y;
        linePositions[base + 5] = 0;
        lineAlphas[linkIdx * 2] = alpha;
        lineAlphas[linkIdx * 2 + 1] = Math.min(1, alpha * 1.5);
        linkIdx++;
      }
    }

    // 剩余 slot 清零
    for (let k = linkIdx; k < MAX_LINKS; k++) {
      const base = k * 2 * 3;
      linePositions[base] = linePositions[base + 1] = linePositions[base + 2] = 0;
      linePositions[base + 3] = linePositions[base + 4] = linePositions[base + 5] = 0;
      lineAlphas[k * 2] = 0;
      lineAlphas[k * 2 + 1] = 0;
    }

    lineGeom.attributes.position.needsUpdate = true;
    lineGeom.attributes.aAlpha.needsUpdate = true;
    lineGeom.setDrawRange(0, linkIdx * 2);

    void state;
  });

  // 节点：小亮点
  const nodeVert = `
    uniform float uPixelRatio;
    void main() {
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mv;
      gl_PointSize = 2.2 * uPixelRatio * (40.0 / -mv.z);
    }
  `;
  const nodeFrag = `
    void main() {
      vec2 uv = gl_PointCoord - 0.5;
      float d = length(uv);
      if (d > 0.5) discard;
      float a = smoothstep(0.5, 0.0, d) * 0.6;
      gl_FragColor = vec4(0.82, 0.68, 0.44, a);
    }
  `;
  const nodeUniforms = useMemo(() => ({
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
  }), []);

  // 连线：按每端 alpha 渐变
  const lineVert = `
    attribute float aAlpha;
    varying float vA;
    void main() {
      vA = aAlpha;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
  const lineFrag = `
    varying float vA;
    void main() {
      if (vA < 0.01) discard;
      gl_FragColor = vec4(0.78, 0.64, 0.42, vA * 0.38);
    }
  `;

  // 确保 geometry 的 position attribute 在 ref 挂上时初始化
  useEffect(() => {
    if (pointsRef.current) pointsRef.current.geometry = pointGeom;
    if (linesRef.current) linesRef.current.geometry = lineGeom;
  }, [pointGeom, lineGeom]);

  return (
    <group>
      <points ref={pointsRef} geometry={pointGeom}>
        <shaderMaterial
          vertexShader={nodeVert}
          fragmentShader={nodeFrag}
          uniforms={nodeUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <lineSegments ref={linesRef} geometry={lineGeom}>
        <shaderMaterial
          vertexShader={lineVert}
          fragmentShader={lineFrag}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
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
      <EmberField mouse={mouse} />
      <ConstellationWeb mouse={mouse} />
    </Canvas>
  );
}
