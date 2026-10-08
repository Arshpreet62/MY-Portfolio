/* Page behaviour. Everything here is an enhancement: with JavaScript off the
   page still reads top to bottom, with the photo in place of the engraving,
   each stack drawn already exploded, and a link to GitHub in place of the
   register. */
(function () {
  'use strict';

  const root = document.documentElement;
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const moving = () => !reduceMotion.matches;
  const data = window.PORTFOLIO || { register: [], materials: [] };
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthYear = (iso) => `${months[Number(iso.slice(5, 7)) - 1]} ${iso.slice(0, 4)}`;

  const make = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text != null) el.textContent = text;
    return el;
  };

  /* ---------- Theme: day drawing and blueprint ---------- */

  const themeButton = $('[data-theme-toggle]');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  const themeMeta = $('meta[name="theme-color"]');
  const isDark = () => (root.dataset.theme ? root.dataset.theme === 'dark' : systemDark.matches);

  function syncTheme() {
    // The label names the sheet you switch to, so it reads right in both themes.
    const dark = isDark();
    themeButton.dataset.on = String(dark);
    themeButton.setAttribute('aria-label', dark ? 'Switch to paper' : 'Switch to blueprint');
    $('.bar__theme-label', themeButton).textContent = dark ? 'Paper' : 'Blueprint';
    if (themeMeta) themeMeta.setAttribute('content', getComputedStyle(root).getPropertyValue('--ground').trim());
  }
  themeButton.addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    const apply = () => {
      root.dataset.theme = next;
      try { localStorage.setItem('as-theme', next); } catch (e) { /* private mode: the choice lasts for this visit */ }
      syncTheme();
    };
    // The blueprint is laid over the drawing from the top (see styles.css).
    if (document.startViewTransition && moving()) document.startViewTransition(apply);
    else apply();
  });
  systemDark.addEventListener('change', syncTheme);
  syncTheme();

  /* ---------- Cover: set out, then inked ---------- */

  const cover = $('.cover');
  const guides = $('[data-guides]');
  const dim = $('[data-dim]');
  const dimTarget = $('[data-dim-target]');
  const dimValue = $('[data-dim-value]');
  let dimWidth = 0;
  let counting = false;

  // The baseline of a line of type, read from a zero-height inline box.
  function baselineOf(line) {
    const probe = make('span');
    probe.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
    line.prepend(probe);
    const y = probe.getBoundingClientRect().top;
    probe.remove();
    return y;
  }
  // Cap height as a fraction of the font size, measured from an H.
  function capHeightOf(style) {
    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) return 0.72;
    ctx.font = `${style.fontWeight} 200px ${style.fontFamily}`;
    const m = ctx.measureText('H');
    return m.actualBoundingBoxAscent ? m.actualBoundingBoxAscent / 200 : 0.72;
  }

  function setOutCover() {
    if (!cover || !dimTarget) return;
    const w = dimTarget.getBoundingClientRect().width;
    if (w) {
      dimWidth = w;
      dim.style.setProperty('--dim-w', `${w}px`);
      if (!counting) dimValue.textContent = `${Math.round(w)} px`;
      dim.setAttribute('data-ready', '');
    }
    if (!guides) return;
    const box = cover.getBoundingClientRect();
    const lines = $$('.cover__line', cover);
    const style = getComputedStyle(lines[0]);
    const size = parseFloat(style.fontSize);
    const cap = capHeightOf(style) * size;
    const ys = [];
    lines.forEach((line) => {
      const base = baselineOf(line) - box.top;
      ys.push(base - cap, base);
    });
    const frag = document.createDocumentFragment();
    let k = 0;
    ys.forEach((y) => {
      const g = make('i', 'guide guide--h');
      g.style.top = `${Math.round(y)}px`;
      g.style.setProperty('--k', k++);
      frag.append(g);
    });
    // Extension lines: from the dimension line down past the name.
    const r = dimTarget.getBoundingClientRect();
    const d = dim.getBoundingClientRect();
    const top = (d.height ? d.top + d.height / 2 : r.top) - box.top;
    const bottom = ys[ys.length - 1] + size * 0.14;
    [r.left, r.right].forEach((x) => {
      const g = make('i', 'guide guide--v');
      g.style.left = `${Math.round(x - box.left)}px`;
      g.style.top = `${Math.round(top)}px`;
      g.style.height = `${Math.round(bottom - top)}px`;
      g.style.setProperty('--k', k++);
      frag.append(g);
    });
    guides.replaceChildren(frag);
  }

  function countUp(target, ms) {
    counting = true;
    const t0 = performance.now();
    const step = (now) => {
      const t = clamp((now - t0) / ms, 0, 1);
      dimValue.textContent = `${Math.round(target * ease(t))} px`;
      if (t < 1) requestAnimationFrame(step);
      else counting = false;
    };
    requestAnimationFrame(step);
  }

  if (cover && dimTarget && 'ResizeObserver' in window) {
    let queued = 0;
    const queue = () => { if (!queued) queued = requestAnimationFrame(() => { queued = 0; setOutCover(); }); };
    new ResizeObserver(queue).observe(cover);
    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    fontsReady.then(() => {
      setOutCover();
      // Ink the name, unless the head script's timer already has.
      if (!root.classList.contains('drafting')) return;
      requestAnimationFrame(() => {
        root.classList.add('inking');
        if (dimWidth) countUp(dimWidth, 1000);
        const last = $$('.cover__line').pop();
        const done = () => root.classList.remove('drafting', 'inking');
        last.addEventListener('animationend', done, { once: true });
        setTimeout(done, 2000);
      });
    });
  }

  /* ---------- Cover: engraved portrait controls ---------- */

  const plate = $('[data-portrait]');
  if (plate) {
    const figure = plate.closest('.portrait');
    const caption = $('[data-portrait-cap]');
    const tools = $('[data-portrait-tools]');
    const hint = $('[data-portrait-hint]');
    const photoToggle = $('[data-photo-toggle]');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

    const setHint = () => {
      hint.textContent = finePointer.matches
        ? 'Move over the drawing to see the photograph.'
        : 'Touch and hold the drawing to see the photograph.';
    };
    const ready = () => {
      caption.textContent = 'The author, engraved from a photograph as the page loads.';
      setHint();
      tools.hidden = false;
    };
    plate.addEventListener('portrait:ready', ready);
    plate.addEventListener('portrait:lost', () => {
      caption.textContent = 'The author.';
      tools.hidden = true;
      figure.classList.remove('show-photo');
    });
    finePointer.addEventListener('change', setHint);
    if (plate.classList.contains('is-engraved')) ready();

    photoToggle.addEventListener('click', () => {
      const on = figure.classList.toggle('show-photo');
      // Name what the button will show next, as the theme button does.
      photoToggle.textContent = on ? 'Show engraving' : 'Show photograph';
    });
  }

  /* ---------- Exploded views ---------- */

  const wide = window.matchMedia('(min-width: 1000px)');
  const hover = window.matchMedia('(hover: hover) and (pointer: fine)');
  // Read once per resize, not on every scroll frame.
  const bar = $('.bar');
  let barH = bar ? bar.offsetHeight : 56;
  const barHeight = () => barH;

  const stacks = $$('[data-axo]').map((fig) => {
    const plates = $$('.plate', fig);
    const n = plates.length;
    // Plate thickness and the dashed rise lines between plates.
    plates.forEach((p) => {
      p.append(make('i', 'plate__edge plate__edge--s'), make('i', 'plate__edge plate__edge--w'));
      if (!p.classList.contains('plate--top')) {
        ['nw', 'ne', 'sw', 'se'].forEach((c) => p.append(make('i', `plate__rise plate__rise--${c}`)));
      }
    });
    const keys = $$('.axo__keys li', fig);
    const items = $$('.stratum', fig.closest('.sheet') || fig);
    const s = { fig, pin: $('.axo__pin', fig), stage: $('.axo__stage', fig), plates, keys, items, n, p: -1, t: 1, near: true, px: 0, pz: 0, tx: 0, tz: 0 };

    // Point at a layer in the key, or at a plate, and the two light up together.
    const layerOfItem = (j) => n - 1 - j;
    const activate = (i) => {
      plates.forEach((p, j) => p.classList.toggle('is-active', j === i));
      keys.forEach((k) => k.classList.toggle('is-active', Number(k.style.getPropertyValue('--i')) === i));
      items.forEach((it, j) => it.classList.toggle('is-active', layerOfItem(j) === i));
    };
    items.forEach((it, j) => {
      it.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') activate(layerOfItem(j)); });
      it.addEventListener('pointerleave', () => activate(-1));
    });
    plates.forEach((p, i) => {
      p.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse' && s.t > 0.9) activate(i); });
      p.addEventListener('pointerleave', () => activate(-1));
    });

    // A fine pointer can turn the model a few degrees.
    s.stage.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse' || !moving()) return;
      const r = s.stage.getBoundingClientRect();
      s.tx = ((e.clientY - r.top) / r.height - 0.5) * -7;
      s.tz = ((e.clientX - r.left) / r.width - 0.5) * 9;
      wake();
    });
    s.stage.addEventListener('pointerleave', () => { s.tx = 0; s.tz = 0; wake(); });
    return s;
  });

  // 0 while the elevation arrives, 1 once the stack is fully apart.
  function progressOf(s) {
    const vh = window.innerHeight;
    if (wide.matches) {
      const r = s.fig.getBoundingClientRect();
      const pinTop = barHeight() + vh * 0.025;
      const travel = r.height - s.pin.offsetHeight;
      const range = clamp(travel * 0.8, 220, vh * 0.6);
      return clamp((pinTop + vh * 0.08 - r.top) / range, 0, 1);
    }
    const r = s.stage.getBoundingClientRect();
    const start = vh * 0.97 - r.height; // the whole elevation is in view
    const end = barHeight() + vh * 0.05; // near the top of the screen
    return clamp((start - r.top) / Math.max(180, start - end), 0, 1);
  }

  function render(s, p) {
    if (p === s.p) return;
    s.p = p;
    s.t = ease(clamp(p / 0.55, 0, 1));
    const e = ease(clamp((p - 0.28) / 0.72, 0, 1));
    s.fig.style.setProperty('--t', s.t.toFixed(4));
    s.fig.style.setProperty('--e', e.toFixed(4));
  }

  function turn(s) {
    s.px += (s.tx - s.px) * 0.12;
    s.pz += (s.tz - s.pz) * 0.12;
    const settled = Math.abs(s.tx - s.px) < 0.02 && Math.abs(s.tz - s.pz) < 0.02;
    if (settled) { s.px = s.tx; s.pz = s.tz; }
    s.fig.style.setProperty('--px', `${(s.px * s.t).toFixed(3)}deg`);
    s.fig.style.setProperty('--pz', `${(s.pz * s.t).toFixed(3)}deg`);
    return !settled;
  }

  if (stacks.length && moving()) {
    stacks.forEach((s) => s.fig.classList.add('is-scrubbed'));
    if ('IntersectionObserver' in window) {
      const near = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          const s = stacks.find((x) => x.fig === en.target);
          if (s) s.near = en.isIntersecting;
        });
        wake();
      }, { rootMargin: '60% 0px 60% 0px' });
      stacks.forEach((s) => near.observe(s.fig));
    }
  }

  /* ---------- The sheet you are on ---------- */

  const sheetNo = $('[data-sheet-no]');
  const sheetTitle = $('[data-sheet-title]');
  const sheets = $$('main [data-sheet]');
  let sheetNow = '';
  function syncSheet() {
    if (!sheetNo) return;
    // The last sheet to start above the line, so the gap after one
    // project reads as that project until the next sheet begins.
    const line = window.innerHeight * 0.35;
    let hit = sheets[0];
    sheets.forEach((el) => {
      if (el.getBoundingClientRect().top <= line) hit = el;
    });
    if (hit && hit.dataset.sheet !== sheetNow) {
      sheetNow = hit.dataset.sheet;
      sheetNo.textContent = sheetNow;
      sheetTitle.textContent = hit.dataset.sheetName;
    }
  }

  /* ---------- One frame loop for everything tied to scroll ---------- */

  let frame = 0;
  function tick() {
    frame = 0;
    let again = false;
    syncSheet();
    if (moving()) {
      // Read every position first, then write, so one stack's update never
      // forces the browser to lay out the page again for the next.
      const live = stacks.filter((s) => s.near);
      const ps = live.map(progressOf);
      live.forEach((s, i) => {
        render(s, ps[i]);
        if (turn(s)) again = true;
      });
    }
    if (again) wake();
  }
  function wake() { if (!frame) frame = requestAnimationFrame(tick); }
  window.addEventListener('scroll', wake, { passive: true });
  window.addEventListener('resize', () => { barH = bar ? bar.offsetHeight : 56; stacks.forEach((s) => { s.p = -1; }); wake(); });
  wide.addEventListener('change', () => { stacks.forEach((s) => { s.p = -1; }); wake(); });
  reduceMotion.addEventListener('change', () => {
    stacks.forEach((s) => {
      s.fig.classList.toggle('is-scrubbed', moving());
      if (!moving()) { ['--t', '--e', '--px', '--pz'].forEach((v) => s.fig.style.removeProperty(v)); s.p = -1; }
    });
    wake();
  });
  tick();

  /* ---------- Tables ---------- */

  const link = (href, text, external) => {
    const a = make('a', '', text);
    a.href = href;
    if (external) { a.target = '_blank'; a.rel = 'noopener'; }
    return a;
  };

  // Rows are restyled as stacked blocks on phones, and some browsers drop
  // table semantics when display changes. Explicit roles keep them.
  function keepTableRoles(table) {
    table.setAttribute('role', 'table');
    $$('thead, tbody', table).forEach((g) => g.setAttribute('role', 'rowgroup'));
    $$('tr', table).forEach((tr) => tr.setAttribute('role', 'row'));
    $$('thead th', table).forEach((th) => th.setAttribute('role', 'columnheader'));
    $$('tbody th', table).forEach((th) => th.setAttribute('role', 'rowheader'));
    $$('td', table).forEach((td) => td.setAttribute('role', 'cell'));
  }

  // Schedule of materials, one row group per layer, each with its hatch.
  const hatchOf = { Interface: 'open', Server: 'diag', Data: 'stipple', Proof: 'lines' };
  const schedule = $('[data-materials]');
  if (schedule && data.materials.length) {
    const groups = [];
    data.materials.forEach((m) => {
      let g = groups.find((x) => x.name === m.group);
      if (!g) groups.push((g = { name: m.group, rows: [] }));
      g.rows.push(m);
    });
    groups.forEach((g) => {
      const body = document.createElement('tbody');
      g.rows.forEach((m, i) => {
        const tr = document.createElement('tr');
        if (i === 0) {
          const th = make('th');
          th.scope = 'rowgroup';
          th.rowSpan = g.rows.length;
          const swatch = make('span', 'swatch');
          swatch.dataset.fill = hatchOf[g.name] || 'open';
          swatch.setAttribute('aria-hidden', 'true');
          th.append(swatch, g.name);
          tr.append(th);
        }
        tr.append(make('td', '', m.name), make('td', '', m.used.join(', ')));
        body.append(tr);
      });
      schedule.append(body);
    });
    keepTableRoles(schedule);
  }

  // Drawing register: every repository, numbered in the order it was started.
  const register = $('[data-register]');
  const rowByNo = new Map();
  if (register && data.register.length) {
    const body = $('tbody', register);
    const sheetAnchors = { 'A-101': '#postmen', 'A-102': '#platemate', 'A-103': '#harbour' };
    const rows = data.register.slice().sort((a, b) => b.no - a.no);

    rows.forEach((r) => {
      const tr = document.createElement('tr');
      tr.dataset.kind = r.kind;
      rowByNo.set(r.no, tr);

      const title = make('td', 'reg__title');
      title.append(link(`https://github.com/Arshpreet62/${r.repo}`, r.title, true));
      if (r.sheet && sheetAnchors[r.sheet]) {
        const toSheet = link(sheetAnchors[r.sheet], r.sheet);
        toSheet.className = 'reg__sheet';
        toSheet.setAttribute('aria-label', `Sheet ${r.sheet}, ${r.title} above`);
        title.append(' ', toSheet);
      }

      const updated = make('td', 'reg__date');
      const time = make('time', '', monthYear(r.date));
      time.dateTime = r.date;
      updated.append(time);

      const live = make('td', 'reg__live');
      if (r.live) {
        const a = link(r.live, 'Live site', true);
        a.setAttribute('aria-label', `${r.title}, live site`);
        live.append(a);
      }

      tr.append(
        make('td', 'reg__no num', String(r.no)),
        title,
        make('td', 'reg__note', r.note),
        make('td', 'reg__stack', r.stack),
        make('td', 'reg__rev num', String(r.rev)),
        updated,
        live
      );
      body.append(tr);
    });
    keepTableRoles(register);

    const toggle = $('[data-register-toggle]');
    const count = $('[data-register-count]');
    const practice = rows.filter((r) => r.kind === 'practice').length;
    const builds = rows.length - practice;
    let showAll = false;
    const syncRegister = () => {
      $$('tr[data-kind="practice"]', body).forEach((tr) => { tr.hidden = !showAll; });
      toggle.textContent = showAll ? 'Hide practice repositories' : `Show ${practice} practice repositories`;
      count.textContent = showAll
        ? `Showing all ${rows.length} repositories.`
        : `Showing ${builds} builds. ${practice} practice repositories are hidden.`;
    };
    toggle.hidden = false;
    toggle.addEventListener('click', () => { showAll = !showAll; syncRegister(); });
    syncRegister();
  }

  /* ---------- Street elevation: every repository as a building ---------- */

  const sky = $('[data-skyline]');
  const narrowSky = window.matchMedia('(max-width: 699px)');
  function drawSkyline() {
    if (!sky || !data.register.length) return;
    const frameEl = $('[data-skyline-frame]', sky);
    const readout = $('[data-skyline-readout]', sky);
    const NS = 'http://www.w3.org/2000/svg';
    const svgEl = (tag, attrs, cls) => {
      const el = document.createElementNS(NS, tag);
      Object.entries(attrs || {}).forEach(([k, v]) => el.setAttribute(k, v));
      if (cls) el.setAttribute('class', cls);
      return el;
    };
    const small = narrowSky.matches;
    const rows = data.register.slice().sort((a, b) => a.no - b.no);
    // Phones get a narrower street drawn at their own scale, so every
    // building and label stays in view without sideways scrolling.
    const bw = small ? 10 : 26, gap = small ? 3 : 8, side = small ? 4 : 12;
    const storey = 7; // one storey per commit
    const text = 11;
    const maxRev = Math.max(...rows.map((r) => r.rev));
    const top = 42;
    const ground = top + maxRev * storey;
    const W = side * 2 + rows.length * (bw + gap) - gap;
    const H = ground + 30;

    const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': `Street elevation of ${rows.length} repositories. Building height is the number of commits; the tallest is ${rows.reduce((a, b) => (b.rev > a.rev ? b : a)).title}.` });
    const defs = svgEl('defs');
    const pattern = svgEl('pattern', { id: 'sky-hatch', width: 6, height: 6, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(-45)' });
    pattern.append(svgEl('rect', { width: 6, height: 6 }, 'sky__hatchbg'), svgEl('rect', { width: 1.4, height: 6 }, 'bldg__hatch'));
    defs.append(pattern);
    svg.append(defs);

    const clear = () => {
      $$('.bldg.is-hot', svg).forEach((b) => b.classList.remove('is-hot'));
      rowByNo.forEach((tr) => tr.classList.remove('is-hot'));
      readout.textContent = '';
    };
    const labels = [];
    rows.forEach((r, k) => {
      const x = side + k * (bw + gap);
      const h = r.rev * storey;
      const y = ground - h;
      const g = svgEl('g', {}, `bldg bldg--${r.kind}`);
      g.style.setProperty('--k', k);
      g.append(svgEl('rect', { x, y, width: bw, height: h }, 'bldg__front'));
      for (let f = 0; f < r.rev; f += 1) {
        const wy = y + f * storey + storey * 0.3;
        const wh = storey * 0.42;
        if (small) {
          g.append(svgEl('rect', { x: x + bw / 2 - 2, y: wy, width: 4, height: wh }, 'bldg__win'));
        } else {
          g.append(svgEl('rect', { x: x + 5, y: wy, width: 6, height: wh }, 'bldg__win'));
          g.append(svgEl('rect', { x: x + bw - 11, y: wy, width: 6, height: wh }, 'bldg__win'));
        }
      }
      if (r.live) {
        g.append(svgEl('line', { x1: x + bw / 2, y1: y, x2: x + bw / 2, y2: y - 9 }, 'bldg__mast'));
        g.append(svgEl('circle', { cx: x + bw / 2, cy: y - 12, r: 3.5 }, 'bldg__lamp'));
      }
      if (r.sheet) {
        // Sheet numbers for the three projects above, lifted clear of the
        // neighbouring roofs with a leader when they need to be.
        const roof = (j) => (rows[j] ? ground - rows[j].rev * storey - (rows[j].live ? 16 : 0) : ground);
        const own = roof(k);
        const half = text * 2; // about half the width of "A-101"
        const reach = Math.ceil(half / (bw + gap));
        let clear = own;
        for (let j = k - reach; j <= k + reach; j += 1) clear = Math.min(clear, roof(j));
        clear -= 9;
        // Keep the label inside the drawing at either end of the street.
        const cx = x + bw / 2;
        const anchor = cx + half > W ? 'end' : cx - half < 0 ? 'start' : 'middle';
        const lx = anchor === 'end' ? x + bw : anchor === 'start' ? x : cx;
        const x0 = anchor === 'end' ? lx - half * 2 : anchor === 'start' ? lx : lx - half;
        // Stack it above any label it would run into.
        labels.forEach((p) => {
          if (x0 < p.x1 + 4 && x0 + half * 2 > p.x0 - 4 && Math.abs(clear - p.y) < text + 4) clear = Math.min(clear, p.y - text - 5);
        });
        labels.push({ x0, x1: x0 + half * 2, y: clear });
        if (clear < own - 12) {
          g.append(svgEl('line', { x1: cx, y1: clear + 4, x2: cx, y2: own - 3 }, 'bldg__mast'));
        }
        const label = svgEl('text', { x: lx, y: clear, 'text-anchor': anchor }, 'bldg__sheet');
        label.style.fontSize = `${text}px`;
        label.textContent = r.sheet;
        g.append(label);
      }
      const say = () => {
        clear();
        g.classList.add('is-hot');
        const tr = rowByNo.get(r.no);
        if (tr && !tr.hidden) tr.classList.add('is-hot');
        readout.textContent = `No. ${r.no}, ${r.title}: ${r.rev} ${r.rev === 1 ? 'commit' : 'commits'}, last push ${monthYear(r.date)}${r.live ? ', live' : ''}.`;
      };
      g.addEventListener('pointerenter', say);
      g.addEventListener('pointerdown', say);
      g.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') clear(); });
      svg.append(g);
    });
    svg.append(svgEl('line', { x1: 0, y1: ground, x2: W, y2: ground }, 'sky__ground'));
    const first = rows[0], last = rows[rows.length - 1];
    const l1 = svgEl('text', { x: side, y: ground + text + 8 }, 'sky__label');
    l1.textContent = `No. ${first.no}, Dec 2024`;
    const l2 = svgEl('text', { x: W - side, y: ground + text + 8, 'text-anchor': 'end' }, 'sky__label');
    l2.textContent = `No. ${last.no}, Sep 2026`;
    [l1, l2].forEach((l) => { l.style.fontSize = `${text}px`; svg.append(l); });

    frameEl.replaceChildren(svg);
    sky.hidden = false;
  }
  drawSkyline();
  narrowSky.addEventListener('change', drawSkyline);

  /* ---------- Links that open a new tab say so ---------- */

  $$('a[target="_blank"]').forEach((a) => {
    const label = a.getAttribute('aria-label');
    if (label) a.setAttribute('aria-label', `${label} (opens in a new tab)`);
    else a.append(make('span', 'sr-only', ' (opens in a new tab)'));
  });

  /* ---------- Contact: copy the address ---------- */

  const copyButton = $('[data-copy]');
  const copyStatus = $('[data-copy-status]');
  if (copyButton) {
    let clearTimer = 0;
    const fallbackCopy = (text) => {
      const field = make('textarea');
      field.value = text;
      field.setAttribute('readonly', '');
      field.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
      document.body.append(field);
      field.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      field.remove();
      return ok;
    };
    copyButton.hidden = false;
    copyButton.addEventListener('click', async () => {
      const text = copyButton.dataset.copy;
      let ok = false;
      try {
        await navigator.clipboard.writeText(text);
        ok = true;
      } catch (e) {
        ok = fallbackCopy(text);
      }
      copyStatus.textContent = ok ? 'Copied to your clipboard.' : 'Copy did not work here. Select the address instead.';
      clearTimeout(clearTimer);
      clearTimer = setTimeout(() => { copyStatus.textContent = ''; }, 5000);
    });
  }

  /* ---------- Drawn as they arrive ---------- */

  // Only things below the fold are held back, only when motion is welcome, and
  // never text: section rules, the skyline rising, the stamp.
  if (moving() && 'IntersectionObserver' in window) {
    const arrive = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const [from, to] = el.dataset.arrive.split(' ');
        el.classList.remove(from);
        el.classList.add(to);
        arrive.unobserve(el);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.2 });
    const hold = (el, from, to) => {
      if (!el || el.getBoundingClientRect().top < window.innerHeight) return;
      el.dataset.arrive = `${from} ${to}`;
      el.classList.add(from);
      arrive.observe(el);
    };
    $$('[data-rule]').forEach((h) => hold(h, 'will-draw', 'is-drawn'));
    hold(sky && !sky.hidden ? sky : null, 'will-rise', 'is-risen');
    hold($('[data-stamp]'), 'will-stamp', 'is-stamped');
  }
})();
