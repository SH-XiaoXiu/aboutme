import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Global flowing backdrop — organic ink-in-water with restrained palette.
 * 复刻早期 Hero 的流动质感，但色彩极度克制（深墨 + 极淡暖尾），全站共享。
 */

function Plane() {
  const ref = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
    }),
    []
  );

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.uniforms.uTime.value = state.clock.getElapsedTime();
    ref.current.uniforms.uRes.value.set(state.size.width, state.size.height);
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
    uniform vec2 uRes;

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
      float v=0.;
      float a=0.5;
      for(int i=0;i<5;i++){
        v+=a*snoise(p);
        p*=2.0;
        a*=0.5;
      }
      return v;
    }

    void main() {
      vec2 uv = vUv;
      vec2 p = uv * 2.0 - 1.0;
      p.x *= uRes.x / uRes.y;

      float t = uTime * 0.06;

      // 横向拉长的域畸变 —— 拉丝方向性来源
      vec2 aniso = vec2(p.x * 0.35, p.y * 2.2);
      vec2 q = vec2(
        fbm(aniso + vec2(0.0, t)),
        fbm(aniso + vec2(5.2, -t))
      );
      vec2 r = vec2(
        fbm(aniso + q*1.3 + vec2(1.7 + t*0.6, 9.2)),
        fbm(aniso + q*1.3 + vec2(8.3, 2.8 - t*0.6))
      );
      float f = fbm(aniso + r*0.9);

      // 二级细拉丝纹（横向细对比，更稀）
      float brush = fbm(vec2(p.x * 0.6, p.y * 60.0 + t*3.0)) * 0.5 + 0.5;

      // 暖青铜阶（Paper & Bronze）
      vec3 base = vec3(0.055, 0.042, 0.028);
      vec3 mid  = vec3(0.120, 0.096, 0.068);
      vec3 silv = vec3(0.275, 0.222, 0.150);
      vec3 hilt = vec3(0.490, 0.395, 0.265);

      vec3 col = mix(base, mid, smoothstep(-0.2, 0.4, f));
      col = mix(col, silv, smoothstep(0.35, 0.80, f) * 0.60);
      col = mix(col, hilt, smoothstep(0.90, 1.20, f + length(r)*0.2) * 0.22);

      // 叠加拉丝细纹
      col *= 0.88 + brush * 0.22;

      // 斜向反光扫过（暖铜受光）
      float sheen = exp(-pow((p.x - p.y * 0.3 + sin(t*0.8)) * 0.9, 2.0) * 0.6);
      col += vec3(0.28, 0.22, 0.14) * sheen * 0.08;

      // 椭圆暗角
      float vig = smoothstep(1.4, 0.25, length(p));
      col *= 0.38 + vig * 0.80;

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
  /** 是否以 fixed 定位贴视口（用于全站全局背景） */
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
