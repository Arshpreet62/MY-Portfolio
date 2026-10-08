/* Engraved portrait.
   Renders the cut-out photo as tone-following line engraving in the page's ink
   colour, and lets the visitor look at the real photo through a drafting-circle
   lens. WebGL1 + OES_standard_derivatives, one draw call, no libraries.
   Redraws only while something moves (draw-in, lens), and not while offscreen. */
(function () {
  'use strict';

  const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

  const FRAG = `
#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform sampler2D uTex;
uniform vec3 uInk;
uniform vec3 uGround;
uniform vec3 uRing;
uniform vec2 uMouse;
uniform float uLens;
uniform float uProgress;
uniform float uDpr;
uniform float uSpacing;
uniform float uInvert;
uniform vec2 uTexSize;
varying vec2 vUv;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

// One family of parallel engraved lines. 'cover' is how much of the gap the
// line fills (0..1), so darker tone = fatter line, like a burin cut.
float engrave(vec2 p, float angle, float spacing, float cover, float bend) {
  vec2 d = vec2(cos(angle), sin(angle));
  float v = dot(p, d) / spacing + bend;
  float f = abs(fract(v) - 0.5) * 2.0;
  float aa = fwidth(v) * 1.5;
  // The last factor fades a line out as its cover reaches zero; without it,
  // every family leaves a faint hairline across the highlights.
  return (1.0 - smoothstep(cover - aa, cover + aa, f)) * smoothstep(0.0, aa, cover);
}

float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

void main() {
  vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
  vec4 tex = texture2D(uTex, uv);
  float a = tex.a;

  // Tone from a softened copy of the photo, so lines follow form, not grain.
  // A much broader blur steers the curve of the lines: it has to change
  // slowly, or the lines break up into a mesh on textured skin.
  vec2 px = 2.5 / uTexSize;
  vec2 wide = 14.0 / uTexSize;
  float Ls = 0.0;
  float Lb = 0.0;
  for (int i = -1; i <= 1; i++) {
    for (int j = -1; j <= 1; j++) {
      vec2 o = vec2(float(i), float(j));
      Ls += luma(texture2D(uTex, uv + o * px).rgb);
      Lb += luma(texture2D(uTex, uv + o * wide).rgb);
    }
  }
  Ls /= 9.0;
  Lb /= 9.0;
  // The face sits between 0.15 and 0.75 luma in this studio photo, with dark
  // hair and overshirt; stretch that range so features carry the contrast,
  // shadows keep some line, and highlights come out as clean paper.
  float L = smoothstep(0.06, 0.66, mix(Ls, luma(tex.rgb), 0.35));
  // On a light ground the lines carry the shadows; on a dark ground they carry the light.
  float tone = mix(1.0 - L, L, uInvert);

  vec2 p = gl_FragCoord.xy / uDpr;
  float bend = Lb * 1.8;
  // l1 never quite vanishes, so the lit side of the face keeps a fine hairline
  // and its edge; l2 and l3 only cross it in the shadows.
  float l1 = engrave(p, radians(58.0), uSpacing, clamp(0.1 + tone * 0.8, 0.1, 0.78), bend);
  float l2 = engrave(p, radians(-32.0), uSpacing, clamp((tone - 0.64) * 1.3, 0.0, 0.55), bend * 0.55);
  float l3 = engrave(p, radians(12.0), uSpacing * 0.85, clamp((tone - 0.86) * 2.5, 0.0, 0.5), 0.0);
  float ink = max(l1, max(l2, l3));

  // Draw-in: strokes arrive top-down with a ragged, hand-drawn front.
  float front = noise(p * 0.02) * 0.3 + vUv.y * -0.7 + 0.7;
  float drawn = smoothstep(front - 0.06, front, uProgress * 1.08);

  // Lens: the real photograph, framed like a drafting-circle template.
  vec2 frag = gl_FragCoord.xy;
  float dist = length(frag - uMouse);
  float r = uLens;
  float inside = 1.0 - smoothstep(r - 1.2 * uDpr, r, dist);
  float ring = (1.0 - smoothstep(0.35 * uDpr, 1.35 * uDpr, abs(dist - r))) * step(1.0, r);
  vec2 q = frag - uMouse;
  float tick = step(abs(q.y), 0.6 * uDpr) * step(r, abs(q.x)) * step(abs(q.x), r + 10.0 * uDpr)
             + step(abs(q.x), 0.6 * uDpr) * step(r, abs(q.y)) * step(abs(q.y), r + 10.0 * uDpr);
  tick *= step(1.0, r);

  // The drawn part of the figure is solid ground, so type set behind the
  // portrait is hidden by it, as it would be behind a real cut-out.
  float cover = a * drawn;
  vec4 hatch = vec4(mix(uGround, uInk, ink) * cover, cover);
  vec4 photo = vec4(tex.rgb * a, a);
  vec4 col = mix(hatch, photo, inside);
  float mark = clamp(ring + tick, 0.0, 1.0);
  col = mix(col, vec4(uRing, 1.0), mark);
  gl_FragColor = col;
}`;

  function cssColor(el, name, fallback) {
    const probe = document.createElement('span');
    probe.style.color = `var(${name}, ${fallback})`;
    probe.style.display = 'none';
    el.appendChild(probe);
    const rgb = getComputedStyle(probe).color.match(/[\d.]+/g) || [0, 0, 0];
    probe.remove();
    return [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255];
  }

  function compile(gl, type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }

  function mount(host) {
    const img = host.querySelector('img');
    if (!img) return;
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false });
    if (!gl || !gl.getExtension('OES_standard_derivatives')) return; // the <img> stays: real photo fallback

    let prog;
    try {
      prog = gl.createProgram();
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    } catch (err) {
      console.warn('portrait: falling back to photo', err);
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = {};
    ['uTex', 'uInk', 'uGround', 'uRing', 'uMouse', 'uLens', 'uProgress', 'uDpr', 'uSpacing', 'uInvert', 'uTexSize'].forEach((n) => (U[n] = gl.getUniformLocation(prog, n)));

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const state = { progress: reduced.matches ? 1 : 0, lens: 0, lensTarget: 0, mx: -999, my: -999, tx: -999, ty: -999, visible: true, raf: 0, dpr: 1, t0: 0 };
    let ink = [0, 0, 0], ground = [1, 1, 1], ring = [0, 0, 0], invert = 0;
    const lum = (c) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
    const readColors = () => {
      ink = cssColor(host, '--ink', '#111');
      ground = cssColor(host, '--ground', '#ddd');
      ring = cssColor(host, '--signal', '#e8b400');
      invert = lum(ink) > lum(ground) ? 1 : 0;
      request();
    };

    const tex = gl.createTexture();
    function upload() {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }

    function resize() {
      const r = host.getBoundingClientRect();
      state.dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(r.width * state.dpr));
      canvas.height = Math.max(1, Math.round(r.height * state.dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      request();
    }

    function draw() {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1i(U.uTex, 0);
      gl.uniform3fv(U.uInk, ink);
      gl.uniform3fv(U.uGround, ground);
      gl.uniform3fv(U.uRing, ring);
      gl.uniform2f(U.uMouse, state.mx * state.dpr, canvas.height - state.my * state.dpr);
      gl.uniform1f(U.uLens, state.lens * state.dpr);
      gl.uniform1f(U.uProgress, state.progress);
      gl.uniform1f(U.uDpr, state.dpr);
      // Finer lines on dense screens; on 1x screens thinner lines alias, so space them out.
      const small = canvas.width / state.dpr < 420;
      gl.uniform1f(U.uSpacing, state.dpr >= 1.5 ? (small ? 3.6 : 4.6) : (small ? 4.4 : 5.4));
      gl.uniform1f(U.uInvert, invert);
      gl.uniform2f(U.uTexSize, img.naturalWidth, img.naturalHeight);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    function frame(now) {
      state.raf = 0;
      let busy = false;
      if (state.progress < 1) {
        if (!state.t0) state.t0 = now;
        const t = Math.min(1, (now - state.t0) / 1900);
        state.progress = 1 - Math.pow(1 - t, 3);
        busy = t < 1;
      }
      const k = 0.2;
      state.mx += (state.tx - state.mx) * k;
      state.my += (state.ty - state.my) * k;
      state.lens += (state.lensTarget - state.lens) * 0.16;
      if (Math.abs(state.tx - state.mx) > 0.2 || Math.abs(state.ty - state.my) > 0.2 || Math.abs(state.lensTarget - state.lens) > 0.2) busy = true;
      else { state.mx = state.tx; state.my = state.ty; state.lens = state.lensTarget; }
      draw();
      if (busy) request();
    }
    function request() { if (!state.raf && state.visible) state.raf = requestAnimationFrame(frame); }

    const lensSize = () => Math.max(56, Math.min(110, host.clientWidth * 0.2));
    function point(e) {
      const r = canvas.getBoundingClientRect();
      state.tx = e.clientX - r.left;
      state.ty = e.clientY - r.top;
      if (state.mx < -900) { state.mx = state.tx; state.my = state.ty; }
    }
    canvas.addEventListener('pointerenter', (e) => { point(e); state.lensTarget = lensSize(); request(); });
    canvas.addEventListener('pointermove', (e) => { point(e); if (e.pointerType !== 'mouse' && e.buttons === 0) return; state.lensTarget = lensSize(); request(); });
    canvas.addEventListener('pointerdown', (e) => { point(e); state.lensTarget = lensSize(); request(); });
    const hide = () => { state.lensTarget = 0; request(); };
    canvas.addEventListener('pointerleave', hide);
    canvas.addEventListener('pointerup', (e) => { if (e.pointerType !== 'mouse') hide(); });
    canvas.addEventListener('pointercancel', hide);

    canvas.addEventListener('webglcontextlost', (e) => {
      // Rare (GPU reset, too many contexts). Show the photograph instead.
      e.preventDefault();
      cancelAnimationFrame(state.raf);
      canvas.remove();
      host.classList.remove('is-engraved');
      host.dispatchEvent(new CustomEvent('portrait:lost', { bubbles: true }));
    });

    const start = () => {
      try {
        upload();
      } catch (err) {
        // The browser won't let WebGL read this image (opened from file://, or served
        // from another origin without CORS). The photograph stays in place.
        console.warn('portrait: showing the photograph instead', err);
        return;
      }
      host.classList.add('is-engraved');
      host.appendChild(canvas);
      host.dispatchEvent(new CustomEvent('portrait:ready', { bubbles: true }));
      resize();
      readColors();
      new ResizeObserver(resize).observe(host);
      new IntersectionObserver(([e]) => { state.visible = e.isIntersecting; if (state.visible) request(); }).observe(host);
      new MutationObserver(readColors).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', readColors);
    };
    if (img.complete && img.naturalWidth) start();
    else img.addEventListener('load', start, { once: true });
  }

  const boot = () => document.querySelectorAll('[data-portrait]').forEach(mount);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
