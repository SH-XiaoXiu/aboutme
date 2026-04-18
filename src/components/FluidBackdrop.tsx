import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

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

  const vert = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

  // Flowing nebula / ink-in-water shader. Warm amber highlights on near-black base.
  const frag = `
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uRes;

    // simplex-ish noise
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

    // fbm
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

      float t = uTime * 0.12;

      // domain warp for flow
      vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, -t)));
      vec2 r = vec2(fbm(p + q*1.5 + vec2(1.7 + t, 9.2)), fbm(p + q*1.5 + vec2(8.3, 2.8 - t)));

      float f = fbm(p + r*1.2);

      // color palette — quiet ink, mostly monochrome with the faintest warm hint
      vec3 base = vec3(0.045, 0.043, 0.040);
      vec3 mid = vec3(0.095, 0.088, 0.080);
      vec3 warm = vec3(0.28, 0.25, 0.21);
      vec3 glow = vec3(0.52, 0.48, 0.42);

      vec3 col = mix(base, mid, smoothstep(-0.2, 0.4, f));
      col = mix(col, warm, smoothstep(0.35, 0.75, f) * 0.6);
      col = mix(col, glow, smoothstep(0.8, 1.15, f + length(r)*0.3) * 0.25);

      // radial vignette from center
      float vig = smoothstep(1.4, 0.2, length(p));
      col *= 0.3 + vig * 0.8;

      // subtle volumetric light streaks diagonally
      float streak = sin((p.x * 1.8 + p.y * 0.6) * 3.0 + t * 1.2) * 0.5 + 0.5;
      streak = pow(streak, 10.0);
      col += glow * streak * 0.04;

      // grain
      float g = fract(sin(dot(uv*uRes, vec2(12.9898,78.233))) * 43758.5453);
      col += (g - 0.5) * 0.025;

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={ref} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} depthTest={false} depthWrite={false} />
    </mesh>
  );
}

export default function FluidBackdrop() {
  return (
    <Canvas
      className="!absolute inset-0"
      gl={{ antialias: false, alpha: false }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 1], near: 0.1, far: 2 }}
    >
      <Plane />
    </Canvas>
  );
}
