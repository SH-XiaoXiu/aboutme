import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Global flowing backdrop — two entirely different visual characters:
 *
 * Dark  (uTheme = 0): 胶片铜墨
 *   Fast (t×0.06), anisotropic drip (0.35 × 2.2), high distortion (r×0.9)
 *   → liquid ink falling in darkness
 *
 * Light (uTheme = 1): 宣纸水晕
 *   Slow (t×0.015), nearly isotropic (0.72 × 1.35), low distortion (r×0.22)
 *   → still paper with faint absorbed-watercolour wash
 *
 * Both parameters and palettes are interpolated during theme switch.
 */

function Plane() {
  const { theme } = useTheme();
  const ref = useRef<THREE.ShaderMaterial>(null);
  const scrollTarget  = useRef(0);
  const scrollCurrent = useRef(0);
  const themeTarget   = useRef(theme === 'light' ? 1 : 0);
  const themeCurrent  = useRef(theme === 'light' ? 1 : 0);

  useEffect(() => {
    themeTarget.current = theme === 'light' ? 1 : 0;
  }, [theme]);

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
      uTheme:  { value: theme === 'light' ? 1 : 0 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame((state) => {
    if (!ref.current) return;
    scrollCurrent.current += (scrollTarget.current - scrollCurrent.current) * 0.04;
    themeCurrent.current  += (themeTarget.current  - themeCurrent.current)  * 0.03;
    ref.current.uniforms.uTime.value   = state.clock.getElapsedTime();
    ref.current.uniforms.uRes.value.set(state.size.width, state.size.height);
    ref.current.uniforms.uScroll.value = scrollCurrent.current;
    ref.current.uniforms.uTheme.value  = themeCurrent.current;
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
    uniform float uScroll;
    uniform float uTheme;   // 0 = dark · 1 = light (smoothly interpolated)

    // ── Simplex noise (unchanged) ──────────────────────────────────
    vec3 mod289v3(vec3 x){return x-floor(x*(1./289.))*289.;}
    vec2 mod289v2(vec2 x){return x-floor(x*(1./289.))*289.;}
    vec3 permute(vec3 x){return mod289v3(((x*34.)+1.)*x);}
    float snoise(vec2 v){
      const vec4 C=vec4(.211324865405187,.366025403784439,-.577350269189626,.024390243902439);
      vec2 i=floor(v+dot(v,C.yy));
      vec2 x0=v-i+dot(i,C.xx);
      vec2 i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.);
      vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1;
      i=mod289v2(i);
      vec3 p=permute(permute(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));
      vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);
      m=m*m; m=m*m;
      vec3 xn=2.*fract(p*C.www)-1.;
      vec3 h=abs(xn)-.5;
      vec3 ox=floor(xn+.5);
      vec3 a0=xn-ox;
      m*=1.79284291400159-.85373472095314*(a0*a0+h*h);
      vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw;
      return 130.*dot(m,g);
    }
    float fbm(vec2 p){
      float v=0.; float a=.5;
      for(int i=0;i<5;i++){v+=a*snoise(p);p*=2.;a*=.5;}
      return v;
    }

    // ── Piecewise-smooth palette mixer (4 stops, t = 0–1) ─────────
    vec3 pal4(vec3 c0,vec3 c1,vec3 c2,vec3 c3,float t){
      float s=clamp(t,0.,1.)*3.;
      float f=fract(s);
      if(s<1.) return mix(c0,c1,smoothstep(0.,1.,f));
      if(s<2.) return mix(c1,c2,smoothstep(0.,1.,f));
      return        mix(c2,c3,smoothstep(0.,1.,f));
    }

    void main(){
      vec2 uv = vUv;
      vec2 p  = uv*2.-1.;
      p.x *= uRes.x/uRes.y;

      // ── Algorithm parameters differ between themes ─────────────
      // Dark: fast, drip-anisotropic, high distortion
      // Light: slow, nearly isotropic, low distortion (paper wash)
      float timeScale  = mix(0.060, 0.016, uTheme);
      float anisoX     = mix(0.35,  0.72,  uTheme);
      float anisoY     = mix(2.20,  1.35,  uTheme);
      float distortStr = mix(0.90,  0.22,  uTheme);
      float brushAmp   = mix(0.22,  0.03,  uTheme);  // brush-stroke intensity
      float brushBase  = mix(0.88,  0.97,  uTheme);  // brush multiply base
      float sheenStr   = mix(0.08,  0.010, uTheme);  // specular sheen
      float vigDarkW   = mix(0.38,  0.96,  uTheme);  // vignette base (light = near-white)
      float vigRangeW  = mix(0.80,  0.04,  uTheme);  // vignette range

      float t = uTime * timeScale;

      vec2 aniso = vec2(p.x*anisoX, p.y*anisoY);

      vec2 q = vec2(
        fbm(aniso + vec2(0.0,   t)),
        fbm(aniso + vec2(5.2,  -t))
      );
      vec2 r = vec2(
        fbm(aniso + q*1.3 + vec2(1.7+t*0.6, 9.2)),
        fbm(aniso + q*1.3 + vec2(8.3, 2.8-t*0.6))
      );
      float f = fbm(aniso + r*distortStr);

      // Brush texture: dark = vertical strokes, light = horizontal fibers
      float brushScaleX = mix(0.6,  12.0, uTheme);
      float brushScaleY = mix(60.0,  2.0, uTheme);
      float brush = fbm(vec2(p.x*brushScaleX, p.y*brushScaleY + t*3.))*0.5+0.5;

      float sc = uScroll;

      // ── Dark palette 胶片铜墨 ─────────────────────────────────────
      // 0 暖铜         1 黎明蓝        2 深夜          3 琥珀晨
      vec3 db0=vec3(.055,.042,.028); vec3 dm0=vec3(.120,.096,.068);
      vec3 ds0=vec3(.275,.222,.150); vec3 dh0=vec3(.490,.395,.265);
      vec3 db1=vec3(.025,.030,.055); vec3 dm1=vec3(.052,.068,.102);
      vec3 ds1=vec3(.115,.152,.218); vec3 dh1=vec3(.195,.260,.370);
      vec3 db2=vec3(.016,.018,.040); vec3 dm2=vec3(.036,.040,.078);
      vec3 ds2=vec3(.080,.086,.165); vec3 dh2=vec3(.145,.155,.290);
      vec3 db3=vec3(.065,.030,.012); vec3 dm3=vec3(.145,.070,.026);
      vec3 ds3=vec3(.320,.168,.062); vec3 dh3=vec3(.560,.318,.110);

      // ── Light palette Apple 净白 ──────────────────────────────────
      // Values raised to 0.960–1.000 so brush+vignette math lands ~0.96 (near-white)
      // 0 系统白(冷)  1 暖象牙     2 青灰(blue-tinted) 3 暖纸(amber tint)
      vec3 lb0=vec3(.958,.956,.960); vec3 lm0=vec3(.970,.968,.972);
      vec3 ls0=vec3(.982,.980,.983); vec3 lh0=vec3(.995,.994,.996);
      vec3 lb1=vec3(.960,.956,.946); vec3 lm1=vec3(.972,.969,.960);
      vec3 ls1=vec3(.984,.981,.974); vec3 lh1=vec3(.997,.995,.988);
      vec3 lb2=vec3(.942,.946,.958); vec3 lm2=vec3(.958,.961,.970);
      vec3 ls2=vec3(.974,.976,.982); vec3 lh2=vec3(.988,.990,.994);
      vec3 lb3=vec3(.956,.950,.938); vec3 lm3=vec3(.968,.963,.952);
      vec3 ls3=vec3(.980,.976,.966); vec3 lh3=vec3(.994,.991,.982);

      vec3 cBase = mix(pal4(db0,db1,db2,db3,sc), pal4(lb0,lb1,lb2,lb3,sc), uTheme);
      vec3 cMid  = mix(pal4(dm0,dm1,dm2,dm3,sc), pal4(lm0,lm1,lm2,lm3,sc), uTheme);
      vec3 cSilv = mix(pal4(ds0,ds1,ds2,ds3,sc), pal4(ls0,ls1,ls2,ls3,sc), uTheme);
      vec3 cHilt = mix(pal4(dh0,dh1,dh2,dh3,sc), pal4(lh0,lh1,lh2,lh3,sc), uTheme);

      // Sheen: dark = warm bronze streak, light = ultra-faint Apple blue shimmer
      vec3 dSheen = pal4(vec3(.28,.22,.14),vec3(.14,.18,.28),vec3(.08,.10,.22),vec3(.36,.24,.10),sc);
      vec3 lSheen = pal4(vec3(.00,.04,.09),vec3(.00,.04,.09),vec3(.00,.04,.09),vec3(.00,.03,.07),sc);
      vec3 sheenTint = mix(dSheen, lSheen, uTheme);

      // Brightness modulation per section
      float dBrt = pal4(vec3(1.00),vec3(0.88),vec3(0.80),vec3(1.08),sc).r;
      float lBrt = pal4(vec3(1.00),vec3(1.01),vec3(0.98),vec3(1.04),sc).r;
      float brt  = mix(dBrt, lBrt, uTheme);

      // ── Compose ──────────────────────────────────────────────────
      vec3 col = mix(cBase, cMid,  smoothstep(-0.2, 0.4,  f));
      col = mix(col, cSilv, smoothstep( 0.35, 0.80, f)*0.60);
      col = mix(col, cHilt, smoothstep( 0.90, 1.20, f+length(r)*0.2)*0.22);

      col *= brushBase + brush*brushAmp;

      float sheenF = exp(-pow((p.x-p.y*0.3+sin(t*0.8))*0.9, 2.)*0.6);
      col += sheenTint * sheenF * sheenStr;

      float vig = smoothstep(1.4, 0.25, length(p));
      col *= vigDarkW + vig*vigRangeW;

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
