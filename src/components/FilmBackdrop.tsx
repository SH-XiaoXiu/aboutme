import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Global flowing backdrop — organic ink-in-water with restrained palette.
 * Color temperature + brightness shift as the user scrolls through sections.
 *
 * Scroll journey (4 palette stops):
 *   0.00 – Hero          : 暖铜 warm bronze
 *   0.33 – About/Skills  : 黎明蓝 cool dusk
 *   0.66 – Exp/Projects  : 深夜 deep night indigo
 *   1.00 – Gallery/Epilog: 琥珀晨光 amber dawn
 */

function Plane() {
  const ref = useRef<THREE.ShaderMaterial>(null);
  const scrollTarget = useRef(0);
  const scrollCurrent = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      scrollTarget.current = max > 0 ? window.scrollY / max : 0;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime:   { value: 0 },
      uRes:    { value: new THREE.Vector2(1, 1) },
      uScroll: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    if (!ref.current) return;
    // Smooth lerp toward scroll target
    scrollCurrent.current += (scrollTarget.current - scrollCurrent.current) * 0.04;
    ref.current.uniforms.uTime.value   = state.clock.getElapsedTime();
    ref.current.uniforms.uRes.value.set(state.size.width, state.size.height);
    ref.current.uniforms.uScroll.value = scrollCurrent.current;
  });

  const vert = /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

  const frag = /* glsl */ `
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform vec2  uRes;
    uniform float uScroll; // 0–1 page progress

    vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
    vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
    vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
    float snoise(vec2 v){
      const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
      vec2 i=floor(v+dot(v,C.yy));
      vec2 x0=v-i+dot(i,C.xx);
      vec2 i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.);
      vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;
      i=mod289(i);
      vec3 p=permute(permute(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));
      vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);
      m=m*m;m=m*m;
      vec3 x=2.*fract(p*C.www)-1.;
      vec3 h=abs(x)-0.5;
      vec3 ox=floor(x+0.5);
      vec3 a0=x-ox;
      m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
      vec3 g;
      g.x=a0.x*x0.x+h.x*x0.y;
      g.yz=a0.yz*x12.xz+h.yz*x12.yw;
      return 130.*dot(m,g);
    }
    float fbm(vec2 p){
      float v=0.;float a=0.5;
      for(int i=0;i<5;i++){v+=a*snoise(p);p*=2.0;a*=0.5;}
      return v;
    }

    // Piecewise-linear mix across 4 palette stops (t = 0–1)
    vec3 palMix(vec3 c0,vec3 c1,vec3 c2,vec3 c3,float t){
      float s = clamp(t,0.0,1.0)*3.0;
      float f = fract(s);
      if(s < 1.0) return mix(c0,c1,smoothstep(0.0,1.0,f));
      if(s < 2.0) return mix(c1,c2,smoothstep(0.0,1.0,f));
      return         mix(c2,c3,smoothstep(0.0,1.0,f));
    }

    void main() {
      vec2 uv = vUv;
      vec2 p  = uv * 2.0 - 1.0;
      p.x *= uRes.x / uRes.y;

      float t = uTime * 0.06;

      vec2 aniso = vec2(p.x * 0.35, p.y * 2.2);
      vec2 q = vec2(
        fbm(aniso + vec2(0.0,  t)),
        fbm(aniso + vec2(5.2, -t))
      );
      vec2 r = vec2(
        fbm(aniso + q*1.3 + vec2(1.7+t*0.6, 9.2)),
        fbm(aniso + q*1.3 + vec2(8.3, 2.8-t*0.6))
      );
      float f = fbm(aniso + r*0.9);

      float brush = fbm(vec2(p.x*0.6, p.y*60.0+t*3.0))*0.5+0.5;

      float sc = uScroll;

      // ── 4 palette stops ──────────────────────────────────────────────
      // 0  暖铜   warm bronze
      vec3 b0 = vec3(0.055,0.042,0.028);
      vec3 m0 = vec3(0.120,0.096,0.068);
      vec3 s0 = vec3(0.275,0.222,0.150);
      vec3 h0 = vec3(0.490,0.395,0.265);

      // 1  黎明蓝  cool dusk
      vec3 b1 = vec3(0.025,0.030,0.055);
      vec3 m1 = vec3(0.052,0.068,0.102);
      vec3 s1 = vec3(0.115,0.152,0.218);
      vec3 h1 = vec3(0.195,0.260,0.370);

      // 2  深夜    deep-night indigo
      vec3 b2 = vec3(0.016,0.018,0.040);
      vec3 m2 = vec3(0.036,0.040,0.078);
      vec3 s2 = vec3(0.080,0.086,0.165);
      vec3 h2 = vec3(0.145,0.155,0.290);

      // 3  琥珀晨光  amber dawn
      vec3 b3 = vec3(0.065,0.030,0.012);
      vec3 m3 = vec3(0.145,0.070,0.026);
      vec3 s3 = vec3(0.320,0.168,0.062);
      vec3 h3 = vec3(0.560,0.318,0.110);

      vec3 cBase = palMix(b0,b1,b2,b3, sc);
      vec3 cMid  = palMix(m0,m1,m2,m3, sc);
      vec3 cSilv = palMix(s0,s1,s2,s3, sc);
      vec3 cHilt = palMix(h0,h1,h2,h3, sc);

      // ── Sheen tint  (warm→cool→warm) ────────────────────────────────
      vec3 sheen0 = vec3(0.28,0.22,0.14); // warm bronze
      vec3 sheen1 = vec3(0.14,0.18,0.28); // cool blue
      vec3 sheen2 = vec3(0.08,0.10,0.22); // deep indigo
      vec3 sheen3 = vec3(0.36,0.24,0.10); // amber
      vec3 sheenTint = palMix(sheen0,sheen1,sheen2,sheen3, sc);

      // ── Brightness: slightly deeper at mid scroll, brighter at dawn ──
      // stop values: 1.0, 0.88, 0.80, 1.08
      float brt = palMix(
        vec3(1.00), vec3(0.88), vec3(0.80), vec3(1.08), sc
      ).r;

      // ── Compose ──────────────────────────────────────────────────────
      vec3 col = mix(cBase, cMid, smoothstep(-0.2,0.4,f));
      col = mix(col, cSilv, smoothstep(0.35,0.80,f)*0.60);
      col = mix(col, cHilt, smoothstep(0.90,1.20,f+length(r)*0.2)*0.22);

      col *= 0.88 + brush*0.22;

      float sheenF = exp(-pow((p.x - p.y*0.3 + sin(t*0.8))*0.9,2.0)*0.6);
      col += sheenTint * sheenF * 0.08;

      float vig = smoothstep(1.4,0.25,length(p));
      col *= 0.38 + vig*0.80;

      col *= brt;

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={ref}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

interface Props {
  fixed?: boolean;
}

export default function FilmBackdrop({ fixed = false }: Props) {
  const pos = fixed ? 'fixed' : 'absolute';
  return (
    <div
      className={`${pos} inset-0 pointer-events-none overflow-hidden`}
      style={{ zIndex: 0 }}
    >
      <Canvas
        className="!absolute inset-0"
        gl={{ antialias: false, alpha: false }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 1], near: 0.1, far: 2 }}
      >
        <Plane />
      </Canvas>
    </div>
  );
}
