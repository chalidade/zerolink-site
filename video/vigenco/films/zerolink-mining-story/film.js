// ZeroLink by PUAS · "Every worker home" (English). Cinematic 1920×1080, 80 BPM, 62 s.
// One driller's day at a remote mine: a child's drawing at dawn, a pit far from any tower, a wall gives way at night,
// the crew's phones carry his SOS, the compass leads them to him, and he is home by morning.
// Letterboxed, slow, warm light; the landscape is SVG, the app appears only where it matters.
(async function () {
  try {
    const { clamp, lerp, stepR, Track, ColorTrack, SP, vis, applyVis, mix } = M;
    const C = { cream: '#f2edd5', muted: '#a9b9b3', dim: '#6d8580', gold: '#f6b84c', goldInk: '#072b26', teal: '#0e6054',
      card: '#0a302a', card2: '#0e3932', sos: '#ef4b4b', red: '#ff6b6b', paper: '#f7f1e1', crayon: '#2b2b2b', leaf: '#169678' };
    await Promise.all(['italic 400 90px "Instrument Serif"', '400 90px "Instrument Serif"', '600 24px "JetBrains Mono"', '800 80px "Plus Jakarta Sans"', '600 30px "Plus Jakarta Sans"']
      .map((f) => document.fonts.load(f).catch(() => null)));
    await document.fonts.ready;
    await new Promise((r) => { const i = new Image(); i.onload = i.onerror = r; i.src = 'assets/mark.png'; });

    const cues = []; const cue = (t, k, o = {}) => cues.push({ t, k, ...o });
    const sky = document.getElementById('sky'), world = document.getElementById('world'), hud = document.getElementById('hud');
    const draws = [];
    const add = (html, parent = hud) => { const d = document.createElement('div'); d.innerHTML = html.trim(); const e = d.firstElementChild; parent.appendChild(e); return e; };
    const at = (e, x, y) => { e.style.left = x.toFixed(2) + 'px'; e.style.top = y.toFixed(2) + 'px'; return e; };
    const ctr = (e, cx, cy) => at(e, cx - e.offsetWidth / 2, cy - e.offsetHeight / 2);
    // slow, soft fades for this film
    const SL = { w: 6, z: 1 };
    const fade = (t, tin, tout, dIn = 1.0, dOut = 0.8) => clamp(stepR(t - tin, SL)) * (tout == null ? 1 : 1 - clamp((t - tout) / dOut));
    const showF = (e, tin, tout, extra) => draws.push((t) => {
      const o = fade(t, tin, tout); e.style.opacity = o.toFixed(3); e.style.visibility = o < 0.003 ? 'hidden' : 'visible';
      const dy = (1 - clamp(stepR(t - tin, SL))) * 18;
      e.style.transform = `translateY(${dy.toFixed(2)}px) ${extra ? extra(t) : ''}`;
      e.style.filter = o < 0.98 ? `blur(${((1 - o) * 6).toFixed(2)}px)` : 'none';
    });
    let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const P = (d, sw = 2.2) => `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
    const I = {
      nosig: P('<path d="M4 20v-2M9 20v-5M14 20v-8M19 20V7"/><path d="m3 3 18 18"/>', 2.4),
      up: P('<path d="M12 20V4"/><path d="m5 11 7-7 7 7"/>', 2.8),
      check: P('<path d="M20 6 9 17l-5-5"/>', 3),
    };
    const ico = (k, s, col = 'currentColor') => `<span class="ic" style="width:${s}px;height:${s}px;color:${col}">${I[k]}</span>`;

    // ───────── Beats ─────────
    const B = { home: 0, pit: 8.5, net: 15, night: 21.5, fall: 22.6, sos: 25.6, call: 28.5, found: 38, dawn: 44.5, end: 53.5 };
    const DUR = 62;

    // ───────── Sky: night → pre-dawn → deep night → dawn ─────────
    const skyTop = new ColorTrack('#020f0d'), skyBot = new ColorTrack('#020f0d');
    skyTop.to(B.pit - 0.5, '#0b2b3a', { w: 1.2, z: 1 }); skyBot.to(B.pit - 0.5, '#7a4e3a', { w: 1.2, z: 1 });
    skyTop.to(B.net + 4, '#03141a', { w: 1.0, z: 1 }); skyBot.to(B.net + 4, '#0c2a2a', { w: 1.0, z: 1 });
    skyTop.to(B.dawn - 0.5, '#3b5d6b', { w: 1.0, z: 1 }); skyBot.to(B.dawn - 0.5, '#f3b26a', { w: 1.0, z: 1 });
    skyTop.to(B.end - 0.4, '#04201c', { w: 2, z: 1 }); skyBot.to(B.end - 0.4, '#04201c', { w: 2, z: 1 });
    const homeGlow = add(`<div style="left:0;top:0;width:1920px;height:1080px;background:radial-gradient(900px 700px at 50% 45%, rgba(247,212,141,.28), transparent 70%)"></div>`, world);
    draws.push((t) => {
      sky.style.background = `linear-gradient(180deg, ${skyTop.at(t)} 0%, ${skyBot.at(t)} 100%)`;
      homeGlow.style.opacity = (fade(t, 0.3, B.pit - 0.8) + 0.7 * fade(t, B.dawn + 3.6, B.end - 0.5)).toFixed(3);
    });

    // stars
    const stars = add(`<svg width="1920" height="1080" style="left:0;top:0"></svg>`, world);
    const NS = 'http://www.w3.org/2000/svg';
    const sv = (tag, attrs, p) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); p.appendChild(e); return e; };
    const st = Array.from({ length: 110 }, () => ({ e: sv('circle', { cx: rnd() * 1920, cy: 96 + rnd() * 470, r: 0.8 + rnd() * 1.8, fill: '#f2edd5' }, stars), ph: rnd() * 6 }));
    draws.push((t) => {
      const night = fade(t, B.pit, B.pit + 3, 1, 2) * 0.5 + fade(t, B.net + 2, B.dawn, 1.5, 1.5);
      st.forEach((s) => s.e.setAttribute('opacity', (night * (0.45 + 0.4 * Math.sin(t * 1.3 + s.ph))).toFixed(3)));
    });

    // landscape: far ridge, the pit (benches), near ground; parallax
    const land = add(`<svg width="2200" height="1080" viewBox="0 0 2200 1080" style="left:-140px;top:0"></svg>`, world);
    const ridge = sv('path', { d: 'M0 640 L180 560 L330 600 L520 500 L700 570 L900 520 L1080 590 L1300 480 L1500 560 L1700 510 L1900 580 L2200 520 L2200 1080 L0 1080 Z', fill: '#0b2522' }, land);
    // the pit: stepped benches going down to a floor
    const benches = [];
    for (let i = 0; i < 5; i++) {
      const y = 660 + i * 62, inset = i * 120;
      benches.push(sv('path', { d: `M${200 + inset} ${y} L${2000 - inset} ${y} L${1990 - inset - 60} ${y + 62} L${210 + inset + 60} ${y + 62} Z`, fill: mix('#173a33', '#0a1d1a', i / 5) }, land));
      sv('line', { x1: 200 + inset, y1: y, x2: 2000 - inset, y2: y, stroke: 'rgba(242,237,213,.10)', 'stroke-width': 2 }, land);
    }
    sv('path', { d: 'M0 650 L200 660 L260 1080 L0 1080 Z M2200 650 L2000 660 L1940 1080 L2200 1080 Z', fill: '#081a17' }, land);
    const tint = sv('rect', { x: 0, y: 0, width: 2200, height: 1080, fill: '#f3b26a', opacity: 0 }, land);
    tint.style.mixBlendMode = 'soft-light';
    // haul trucks: two pairs of lights crawling along benches
    const trucks = [0, 1].map((i) => sv('circle', { cx: 0, cy: 0, r: 5, fill: '#ffd98a' }, land));
    // crew phones on the benches (Bayu is #4)
    const crewPos = [[520, 652], [760, 714], [1010, 652], [1260, 714], [1540, 776], [880, 776], [1180, 838], [640, 838], [1420, 652], [1700, 714], [980, 900], [1320, 900]];
    const BAYU = 4;
    const links = [];
    crewPos.forEach((p, i) => crewPos.forEach((q, j) => { if (j > i && Math.hypot(p[0] - q[0], p[1] - q[1]) < 300) links.push([i, j, sv('line', { x1: p[0], y1: p[1], x2: q[0], y2: q[1], stroke: C.gold, 'stroke-width': 2, opacity: 0 }, land)]); }));
    const crew = crewPos.map((p, i) => ({ halo: sv('circle', { cx: p[0], cy: p[1], r: 16, fill: 'none', stroke: C.gold, 'stroke-width': 2, opacity: 0 }, land), dot: sv('circle', { cx: p[0], cy: p[1], r: 7, fill: C.gold, opacity: 0 }, land) }));
    // headlamp cones for the rescue (three crew walk to Bayu)
    const defs = sv('defs', {}, land);
    const g = sv('radialGradient', { id: 'cone', cx: '0', cy: '0.5', r: '1' }, defs);
    sv('stop', { offset: '0', 'stop-color': '#ffe6a8', 'stop-opacity': '.55' }, g); sv('stop', { offset: '1', 'stop-color': '#ffe6a8', 'stop-opacity': '0' }, g);
    const rescuers = [0, 2, 8].map((i) => ({ i, cone: sv('path', { d: 'M0 0 L220 -70 L220 70 Z', fill: 'url(#cone)', opacity: 0 }, land) }));
    // dust cloud
    const dust = sv('ellipse', { cx: crewPos[BAYU][0] + 40, cy: crewPos[BAYU][1] - 20, rx: 260, ry: 150, fill: '#8a7a64', opacity: 0 }, land);
    dust.style.filter = 'blur(40px)';
    const rocks = Array.from({ length: 14 }, () => ({ e: sv('circle', { cx: 0, cy: 0, r: 4 + rnd() * 8, fill: '#3b4a44', opacity: 0 }, land), x: crewPos[BAYU][0] - 80 + rnd() * 200, d: rnd() * 0.5 }));

    const landOn = (t) => fade(t, B.pit, B.end - 0.6, 1.2, 1.0);
    draws.push((t) => {
      const lo = landOn(t);
      land.style.opacity = lo.toFixed(3);
      // camera: slow push over the scene, plus a shake when the wall gives
      const pan = -60 * clamp((t - B.pit) / (B.end - B.pit));
      const zoom = 1 + 0.06 * clamp((t - B.pit) / 14) + 0.08 * stepR(t - B.call, { w: 1.2, z: 1 }) - 0.12 * stepR(t - B.found, { w: 1, z: 1 });
      const h = t - B.fall; const sh = h > 0 && h < 2.2 ? 10 * Math.exp(-h * 1.6) * Math.sin(h * 38) : 0;
      const fx = crewPos[BAYU][0] - 140, fy = crewPos[BAYU][1];
      land.style.transformOrigin = `${fx}px ${fy}px`;
      land.style.transform = `translate(${(pan + sh).toFixed(2)}px, ${(sh * 0.5).toFixed(2)}px) scale(${zoom.toFixed(4)})`;
      tint.setAttribute('opacity', (0.55 * fade(t, B.dawn, B.end, 1.2, 1)).toFixed(3));
      trucks.forEach((tr, i) => {
        const k = ((t * 0.04 + i * 0.5) % 1); const y = 652 + i * 124;
        tr.setAttribute('cx', (300 + 1600 * k).toFixed(1)); tr.setAttribute('cy', (y - 6).toFixed(1));
        tr.setAttribute('opacity', (0.9 * (t < B.fall || t > B.dawn ? 1 : 0.2)).toFixed(2));
      });
      // crew lights: appear one by one during "net"
      crew.forEach((c, i) => {
        const ta = B.net + 0.4 + i * 0.22;
        let o = clamp(stepR(t - ta, SP.pop));
        let col = C.gold;
        if (i === BAYU && t > B.fall + 0.6) { col = t > B.sos ? C.red : '#7a6a55'; o *= t > B.sos ? 0.7 + 0.3 * Math.sin((t - B.sos) * 8) : 0.5; }
        if (i === BAYU && t > B.found) { col = C.gold; o = 1; }
        c.dot.setAttribute('fill', col); c.dot.setAttribute('opacity', o.toFixed(3));
        // halos: everyone rings when the SOS arrives
        let hr = 16, ho = 0;
        if (t > B.call && t < B.call + 3) { const ph = ((t - B.call - i * 0.05) % 1); hr = 14 + 40 * ph; ho = 0.8 * (1 - ph); c.halo.setAttribute('stroke', C.red); }
        else if (i === BAYU && t > B.sos && t < B.found) { const ph = ((t - B.sos) % 1.2) / 1.2; hr = 14 + 70 * ph; ho = 0.9 * (1 - ph); c.halo.setAttribute('stroke', C.red); }
        else if (t > B.found && t < B.found + 4) { const ph = clamp((t - B.found - 0.6 - i * 0.18) / 0.6); hr = 12 + 14 * ph; ho = ph > 0 && ph < 1 ? 0.9 * (1 - ph) : 0; c.halo.setAttribute('stroke', C.leaf); }
        c.halo.setAttribute('r', hr.toFixed(1)); c.halo.setAttribute('opacity', ho.toFixed(3));
      });
      links.forEach(([i, j, l]) => {
        const ta = B.net + 0.6 + Math.max(i, j) * 0.22;
        let o = 0.35 * clamp((t - ta) / 0.5) * (1 - 0.7 * clamp((t - B.night) / 1));
        if (t > B.call && t < B.found) o = (i === BAYU || j === BAYU) ? 0.6 : 0.18;
        if (t > B.found) o = 0.3 * (1 - clamp((t - B.dawn) / 1.5));
        if ([0, 2, 8].some((r) => r === i || r === j)) o *= 1 - clamp((t - B.call - 2.4) / 0.4) * (1 - clamp((t - B.dawn) / 1));
        l.setAttribute('opacity', o.toFixed(3));
        l.setAttribute('stroke', t > B.call && t < B.found && (i === BAYU || j === BAYU) ? C.red : C.gold);
      });
      // the fall
      const d = clamp((t - B.fall) / 0.4) * (1 - clamp((t - B.fall - 4) / 3));
      dust.setAttribute('opacity', (0.42 * d).toFixed(3));
      dust.setAttribute('rx', (180 + 120 * clamp((t - B.fall) / 2)).toFixed(1));
      rocks.forEach((r) => { const k = clamp((t - B.fall - r.d) / 0.9); r.e.setAttribute('cx', r.x.toFixed(1)); r.e.setAttribute('cy', (590 + 200 * k * k).toFixed(1)); r.e.setAttribute('opacity', (k > 0 && t < B.dawn ? 0.9 : 0).toFixed(2)); });
      // rescue: three headlamps walk to Bayu
      rescuers.forEach(({ i, cone }, k) => {
        const p0 = crewPos[i], p1 = [crewPos[BAYU][0] - 60 + k * 50, crewPos[BAYU][1] - 10 + k * 8];
        const p = stepR(t - B.call - 2.6 - k * 0.3, { w: 0.9, z: 1 });
        const x = lerp(p0[0], p1[0], p), y = lerp(p0[1], p1[1], p);
        crew[i].dot.setAttribute('cx', x.toFixed(1)); crew[i].dot.setAttribute('cy', y.toFixed(1));
        crew[i].halo.setAttribute('cx', x.toFixed(1)); crew[i].halo.setAttribute('cy', y.toFixed(1));
        const ang = Math.atan2(crewPos[BAYU][1] - y, crewPos[BAYU][0] - x) * 180 / Math.PI;
        const o = fade(t, B.call + 2.4, B.found + 2, 0.6, 1) * 0.9;
        cone.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${ang.toFixed(1)})`);
        cone.setAttribute('opacity', o.toFixed(3));
      });
    });

    // ───────── Typography ─────────
    const stamp = (txt, tin, tout, y = 170) => { const e = add(`<div class="mono" style="left:0;top:${y}px;width:1920px;text-align:center;font:600 24px/1 'JetBrains Mono';letter-spacing:.22em;color:${C.gold}">${txt}</div>`); showF(e, tin, tout); cue(tin, 'tick'); return e; };
    const line = (html, tin, tout, y, size = 64, col = C.cream) => { const e = add(`<div class="serif" style="left:160px;top:${y}px;width:1600px;text-align:center;font-size:${size}px;line-height:1.15;color:${col}">${html}</div>`); showF(e, tin, tout); cue(tin, 'note', { n: Math.round(tin) % 5 }); return e; };

    // ══ 0 · home, before dawn ══
    stamp('04:40 · HOME', 0.6, B.pit - 1.0);
    line('Bayu leaves before his daughter wakes.', 1.4, B.pit - 1.0, 236);
    const draw = add(`<div style="width:560px;height:400px;border-radius:6px;background:${C.paper};box-shadow:0 40px 90px -20px rgba(0,0,0,.7);padding:22px">
      <svg viewBox="0 0 520 300" width="516" height="300" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="448" cy="62" r="34" stroke="#f0a020" stroke-width="7"/>
        ${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<path d="M${448 + 46 * Math.cos(a * Math.PI / 180)} ${62 + 46 * Math.sin(a * Math.PI / 180)} L${448 + 62 * Math.cos(a * Math.PI / 180)} ${62 + 62 * Math.sin(a * Math.PI / 180)}" stroke="#f0a020" stroke-width="6"/>`).join('')}
        <path d="M20 270 Q140 230 260 262 T510 258" stroke="#5c9e48" stroke-width="8"/>
        <circle cx="170" cy="118" r="30" stroke="${C.crayon}" stroke-width="6"/>
        <path d="M134 108 Q170 58 206 108 Z" fill="#f6b84c" stroke="${C.crayon}" stroke-width="6"/>
        <path d="M170 150 L170 220 M170 170 L128 196 M170 170 L212 150 M170 220 L140 262 M170 220 L200 262" stroke="${C.crayon}" stroke-width="6"/>
        <circle cx="290" cy="170" r="20" stroke="${C.crayon}" stroke-width="6"/>
        <path d="M290 190 L290 236 M290 204 L260 188 M290 204 L320 214 M290 236 L272 262 M290 236 L306 262" stroke="${C.crayon}" stroke-width="6"/>
        <path d="M232 128 c-10 -16 -34 -6 -22 12 l22 20 l22 -20 c12 -18 -12 -28 -22 -12z" fill="#e8467c" stroke="#e8467c" stroke-width="3"/>
      </svg>
      <div class="serif" style="margin-top:6px;text-align:center;font-size:44px;line-height:1;color:#c2255c">Come home safe, Papa</div></div>`);
    ctr(draw, 960, 640);
    showF(draw, 3.4, B.pit - 1.0, (t) => `rotate(${(-3 + 0.6 * Math.sin(t * 0.8)).toFixed(2)}deg)`);
    cue(0, 'born'); cue(3.4, 'shimmer');

    // ══ 8.5 · the pit ══
    stamp('06:00 · PIT 3', B.pit + 0.8, B.net - 0.6);
    line('Far from the nearest tower.', B.pit + 1.4, B.net - 0.6, 210, 72);
    const sig = add(`<div style="display:flex;align-items:center;gap:14px;padding:14px 26px;border-radius:999px;background:rgba(2,15,13,.7);color:${C.red};font:700 26px/1 'Plus Jakarta Sans';white-space:nowrap">${ico('nosig', 30)}No service</div>`);
    ctr(sig, 960, 330);
    showF(sig, B.pit + 3.0, B.net - 0.6); cue(B.pit + 3.0, 'alert');

    // ══ 15 · the crew becomes the network ══
    line('Out here, the crew’s phones <span style="color:#f6b84c">become the network.</span>', B.net + 0.4, B.night - 0.4, 210, 64);
    const chip = add(`<div style="display:flex;align-items:center;gap:14px;padding:12px 24px 12px 12px;border-radius:999px;background:rgba(10,48,42,.9);box-shadow:inset 0 0 0 2px rgba(246,184,76,.35);white-space:nowrap">
      <img src="assets/mark.png" style="width:40px;height:40px;border-radius:50%"><span style="font:700 26px/1 'Plus Jakarta Sans'">Night shift · <span class="n" style="color:${C.gold}">0</span> phones linked</span></div>`);
    ctr(chip, 960, 330);
    const chipN = chip.querySelector('.n');
    showF(chip, B.net + 1.2, B.night - 0.4);
    draws.push((t) => { let n = 0; crewPos.forEach((_, i) => { if (t > B.net + 0.4 + i * 0.22) n++; }); chipN.textContent = n; });
    crewPos.forEach((_, i) => cue(B.net + 0.4 + i * 0.22, 'pop', { n: i % 4, v: 0.5 }));

    // ══ 21.5 · night, the wall gives way ══
    stamp('21:14 · BENCH 4', B.night, B.call - 0.4);
    line('A wall gives way.', B.fall + 0.4, B.call - 0.4, 210, 76);
    line('Bayu is cut off. <span style="color:#ff6b6b">He presses SOS.</span>', B.sos, B.call - 0.4, 300, 56, C.cream);
    cue(B.night - 1.6, 'riser', { d: 1.6 }); cue(B.fall, 'drop'); cue(B.fall + 0.1, 'slam', { n: 0 }); cue(B.sos, 'alert'); cue(B.sos + 0.6, 'alert');

    // ══ 28.5 · every phone hears him ══
    const sosC = add(`<div style="width:620px;padding:28px 32px;border-radius:30px;background:${C.sos};color:#fff;box-shadow:0 40px 90px -20px rgba(0,0,0,.75)">
      <div class="mono" style="font:700 20px/1 'JetBrains Mono';letter-spacing:.14em;opacity:.85">SOS · 21:15</div>
      <div style="margin-top:12px;display:flex;align-items:center;gap:16px;font:800 46px/1.05 'Plus Jakarta Sans';letter-spacing:-.02em">${'<div class="av" style="width:58px;height:58px;background:#fff;color:#1c7ed6;font-size:28px">B</div>'}Bayu needs help</div>
      <div style="margin-top:16px;font:600 26px/1.4 'Plus Jakarta Sans';opacity:.95"><span class="d">140</span> m to the southwest · battery 18%<br>Blood type O+ · driller, rig 7</div></div>`);
    at(sosC, 1180, 150);
    const sosD = sosC.querySelector('.d');
    showF(sosC, B.call, B.found - 0.3, (t) => `scale(${(0.92 + 0.08 * clamp(stepR(t - B.call, SP.pop))).toFixed(4)})`);
    draws.push((t) => { sosD.textContent = Math.max(0, Math.round(140 * (1 - clamp((t - B.call - 2.8) / 6.2)))); });
    const l1 = add(`<div class="serif" style="left:160px;top:170px;width:900px;font-size:60px;line-height:1.12;color:${C.cream}">Every phone on the crew<br><span style="color:#ff6b6b">hears him.</span></div>`);
    showF(l1, B.call + 0.5, B.call + 4.4);
    const l2 = add(`<div class="serif" style="left:160px;top:170px;width:900px;font-size:60px;line-height:1.12;color:${C.cream}">The compass leads them<br><span style="color:#f6b84c">through the dust.</span></div>`);
    showF(l2, B.call + 4.8, B.found - 0.3);
    const arrow = add(`<div style="width:120px;height:120px;border-radius:50%;background:rgba(2,15,13,.75);display:flex;align-items:center;justify-content:center;box-shadow:inset 0 0 0 3px rgba(246,184,76,.5)">${ico('up', 64, C.gold)}</div>`);
    at(arrow, 1180, 420);
    showF(arrow, B.call + 2.6, B.found - 0.3, (t) => `rotate(${(-135 + 20 * Math.sin((t - B.call) * 1.4) * (1 - clamp((t - B.call - 5) / 2))).toFixed(1)}deg)`);
    cue(B.call, 'alert'); cue(B.call + 0.5, 'alert'); cue(B.call + 1.0, 'alert');
    cue(B.call + 2.6, 'whoosh', { v: 0.4 });
    for (let k = 0; k < 6; k++) cue(B.call + 3.2 + k * 1.0, 'tick');

    // ══ 38 · found ══
    stamp('21:31', B.found, B.dawn - 0.5);
    line('Found.', B.found + 0.3, B.dawn - 0.5, 200, 120, C.cream);
    const hc = add(`<div style="display:flex;align-items:center;gap:18px;padding:18px 30px;border-radius:999px;background:rgba(10,48,42,.92);box-shadow:inset 0 0 0 2px rgba(22,150,120,.6);white-space:nowrap;font:700 30px/1 'Plus Jakarta Sans'">
      <span style="width:44px;height:44px;border-radius:50%;background:${C.leaf};display:flex;align-items:center;justify-content:center">${ico('check', 26, '#fff')}</span>
      Headcount · <span class="n" style="color:${C.gold}">0</span>&nbsp;of 12 safe</div>`);
    ctr(hc, 960, 380);
    const hcN = hc.querySelector('.n');
    showF(hc, B.found + 1.2, B.dawn - 0.5);
    draws.push((t) => { hcN.textContent = Math.round(12 * clamp((t - B.found - 1.4) / 2.2)); });
    cue(B.found + 0.3, 'settle'); cue(B.found + 3.7, 'check');

    // ══ 44.5 · dawn, home ══
    stamp('06:10 · HOME', B.dawn + 0.6, B.end - 0.6);
    line('He made it home.', B.dawn + 1.2, B.end - 0.6, 230, 84);
    const draw2 = draw.cloneNode(true); hud.appendChild(draw2);
    ctr(draw2, 960, 640);
    showF(draw2, B.dawn + 3.2, B.end - 0.6, (t) => `rotate(${(2 + 0.5 * Math.sin(t * 0.8)).toFixed(2)}deg) scale(.9)`);
    cue(B.dawn, 'shimmer'); cue(B.dawn + 3.2, 'note', { n: 2 });

    // ══ 53.5 · end ══
    const lg = add(`<div style="width:170px;height:170px;border-radius:50%;background:${C.cream} url(assets/mark.png) center/78% no-repeat"></div>`);
    ctr(lg, 960, 300);
    showF(lg, B.end, null);
    const wm = add(`<div style="left:0;top:420px;width:1920px;text-align:center;font:800 108px/1 'Plus Jakarta Sans';letter-spacing:-.05em">Zero<span style="color:${C.gold}">Link</span></div>`);
    showF(wm, B.end + 0.5, null);
    const tg = add(`<div class="serif" style="left:0;top:560px;width:1920px;text-align:center;font-size:58px;line-height:1.1;color:${C.cream}">Because someone is <span style="color:${C.gold}">waiting at home.</span></div>`);
    showF(tg, B.end + 1.3, null);
    const sub = add(`<div style="left:0;top:660px;width:1920px;text-align:center;font:500 30px/1.3 'Plus Jakarta Sans';color:${C.muted}">Offline group voice, SOS and headcount for mining &amp; energy sites.</div>`);
    showF(sub, B.end + 2.0, null);
    const url = add(`<div class="mono" style="height:84px;padding:0 44px;border-radius:42px;background:${C.gold};color:${C.goldInk};display:flex;align-items:center;font:700 34px/1 'JetBrains Mono'">zerolink.web.id</div>`);
    ctr(url, 960, 790);
    showF(url, B.end + 2.8, null);
    cue(B.end, 'born'); cue(B.end + 0.5, 'pop'); cue(B.end + 1.3, 'shimmer'); cue(B.end + 2.8, 'cta'); cue(DUR - 1.5, 'settle');

    // letterbox: bars ease out a little for the end card
    const bt = document.getElementById('barT'), bb = document.getElementById('barB');
    draws.push((t) => { const h = 96 * (1 - 0.6 * clamp(stepR(t - B.end, SL))); bt.style.height = bb.style.height = h.toFixed(1) + 'px'; });

    window.seek = (t) => { for (const d of draws) d(t); };
    cues.sort((a, b) => a.t - b.t);
    window.FILM = { width: 1920, height: 1080, bpm: 80, duration: DUR,
      sections: { intro: [0, B.pit], build: [B.net, B.fall], drop: [B.fall, B.found], outro: [B.dawn, DUR] }, cues };
    window.seek(0);
    window.READY = true;
  } catch (err) {
    window.FILM_ERROR = String(err && err.stack || err);
    console.error(err);
  }
})();
