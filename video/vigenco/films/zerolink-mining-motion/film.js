// ZeroLink by PUAS · "ZeroLink for Mining & Energy" (English). Landscape 1920×1080, 120 BPM, 62 s.
// Motion story of one shift crew on a remote mine site: UI pieces built in HTML, driven by springs, a cursor, a camera.
// Scenes: crowd/no signal → phones link → push-to-talk → announcement → meeting point → roll call
// → search card → SOS (drop) → straight from the app → end card.
(async function () {
  try {
    const { clamp, lerp, stepR, Track, ColorTrack, SP, vis, applyVis, press, ripple, mix } = M;
    const C = { night: '#04201c', card: '#0a302a', card2: '#0e3932', cream: '#f2edd5', paper: '#f6f4ea', muted: '#a9b9b3',
      dim: '#6d8580', ink: '#0b2622', grey: '#5d6f6a', gold: '#f6b84c', goldInk: '#072b26', teal: '#0e6054', leaf: '#169678',
      lamp: '#f7d48d', sos: '#ef4b4b', red: '#ff6b6b', amber: '#d68c20', ahmad: '#e8590c', siti: '#d6336c', hamid: '#169678',
      aminah: '#1c7ed6', line: '#e4e1d3', annBg: '#fff4d8' };

    await Promise.all([
      document.fonts.load('800 80px "Plus Jakarta Sans"'), document.fonts.load('500 30px "Plus Jakarta Sans"'),
      document.fonts.load('700 30px "Plus Jakarta Sans"'), document.fonts.load('600 30px "Plus Jakarta Sans"'),
      document.fonts.load('600 24px "JetBrains Mono"'), document.fonts.load('700 30px "JetBrains Mono"'),
      document.fonts.load('italic 400 90px "Instrument Serif"'),
    ].map((p) => p.catch(() => null)));
    await document.fonts.ready;
    const imgs = ['mark.png', '2-grup-dan-chat.jpg', '24-titik-kumpul-di-kompas.jpg', '19-sos-dengan-info-medis.jpg'];
    await Promise.all(imgs.map((s) => new Promise((r) => { const i = new Image(); i.onload = i.onerror = r; i.src = 'assets/' + s; })));

    const cues = [];
    const cue = (t, k, o = {}) => cues.push({ t, k, ...o });
    const world = document.getElementById('world');
    const hud = document.getElementById('hud');
    const redL = document.getElementById('red');
    const lampL = document.getElementById('lamp');
    const draws = [];
    const add = (html, parent = hud) => { const d = document.createElement('div'); d.innerHTML = html.trim(); const e = d.firstElementChild; parent.appendChild(e); return e; };
    const W = (html) => add(html, world);
    const at = (e, x, y) => { e.style.left = x.toFixed(2) + 'px'; e.style.top = y.toFixed(2) + 'px'; return e; };
    const ctr = (e, cx, cy) => at(e, cx - e.offsetWidth / 2, cy - e.offsetHeight / 2);
    const show = (e, tin, tout, extra = '') => draws.push((t) => applyVis(e, vis(t, tin, tout), typeof extra === 'function' ? extra(t) : extra));
    const popS = (t, tin, s0 = 0.5) => s0 + (1 - s0) * stepR(t - tin, SP.pop);
    const bump = (t, tc, a = 0.06, d = 0.08) => 1 + a * Math.exp(-(((t - tc) / d) ** 2));
    const P = (d, sw = 2.2) => `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
    const I = {
      wifi: P('<path d="M2 8.5a15 15 0 0 1 20 0"/><path d="M5 12a10.5 10.5 0 0 1 14 0"/><path d="M8.5 15.5a5.5 5.5 0 0 1 7 0"/><circle cx="12" cy="19" r="1" fill="currentColor"/>'),
      mic: P('<rect x="9" y="2.5" width="6" height="11.5" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0"/><path d="M12 17.5V21"/>'),
      check: P('<path d="M20 6 9 17l-5-5"/>', 3),
      arrow: P('<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>', 2.6),
      up: P('<path d="M12 20V4"/><path d="m5 11 7-7 7 7"/>', 2.8),
      flag: P('<path d="M5 22V3.5"/><path d="M5 4h12l-2.5 4L17 12H5"/>', 2.4),
      batt: P('<rect x="2.5" y="7.5" width="17" height="9" rx="2"/><path d="M21.5 10.5v3"/><path d="M5 10v4" stroke-width="3"/>'),
      nosig: P('<path d="M4 20v-2M9 20v-5M14 20v-8M19 20V7"/><path d="m3 3 18 18"/>', 2.4),
      mega: P('<path d="M3 10v4h3l7 5V5L6 10z"/><path d="M17 9a4 4 0 0 1 0 6"/><path d="M19.5 6.5a7.5 7.5 0 0 1 0 11"/>'),
      search: P('<circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.8-4.8"/>', 2.6),
      clock: P('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
      send: P('<path d="M4 12 20 4l-6 16-3-7z"/>'),
    };
    const ico = (k, s, col = 'currentColor', st = '') => `<span class="ic" style="width:${s}px;height:${s}px;color:${col};${st}">${I[k]}</span>`;
    const av = (l, col, s, fs, ink = '#fff', st = '') => `<div class="av" style="width:${s}px;height:${s}px;background:${col};color:${ink};font-size:${fs}px;${st}">${l}</div>`;

    // ───────────────────────── Scene times ─────────────────────────
    const T = { link: 5, talk: 10, ann: 17, meet: 24, roll: 31, find: 37, sos: 43, app: 50, end: 56 };
    const DUR = 62.0;

    // ───────────────────────── Camera ─────────────────────────
    const CAM = { z: new Track(Math.log(1.08)), zx: new Track(960), zy: new Track(480) };
    const cam = (t, z, zx, zy, sp = SP.cam) => { CAM.z.to(t, Math.log(z), sp); if (zx != null) { CAM.zx.to(t, zx, sp); CAM.zy.to(t, zy, sp); } };
    cam(0.2, 1.0);
    [T.link, T.talk, T.ann, T.meet, T.roll, T.find, T.app].forEach((tb) => { cam(tb - 0.4, 1.03); cam(tb + 0.3, 1.0); });
    cam(T.ann + 3.6, 1.06, 960, 400); cam(T.ann + 4.6, 1.0, 960, 480);
    cam(T.sos - 0.1, 1.12, 960, 470, { w: 9, z: 1 }); cam(T.sos + 0.4, 1.0, 960, 480, { w: 7, z: 1 });
    cam(T.sos + 4.5, 1.05, 1340, 470); cam(T.sos + 6.8, 1.0, 960, 480);
    const shake = (t) => { const h = t - T.sos; return h > 0 && h < 0.7 ? 12 * Math.exp(-h * 7) * Math.sin(h * 70) : 0; };
    const toS = (x, y, t) => { const z = Math.exp(CAM.z.at(t)), zx = CAM.zx.at(t), zy = CAM.zy.at(t); return [zx + (x - zx) * z + shake(t), zy + (y - zy) * z]; };

    draws.push((t) => {
      lampL.style.opacity = (0.35 * vis(t, 0, T.link - 0.3).o + 0.5 * stepR(t - T.end, { w: 3, z: 1 })).toFixed(3);
      const r = clamp((t - T.sos + 0.05) / 0.15) * (1 - clamp((t - T.sos - 6.4) / 0.5));
      redL.style.opacity = (r * (0.75 + 0.25 * Math.sin((t - T.sos) * 6))).toFixed(3);
    });

    // ───────────────────────── HUD: tag + scene clock, caption ─────────────────────────
    const tag = add(`<div style="left:120px;top:64px;height:58px;display:flex;align-items:center;gap:16px;padding:0 24px 0 12px;border-radius:29px;background:rgba(14,57,50,.85);box-shadow:inset 0 0 0 2px rgba(242,237,213,.1);white-space:nowrap">
      <img src="assets/mark.png" style="width:38px;height:38px;border-radius:50%">
      <span style="font:700 24px/1 'Plus Jakarta Sans';color:${C.cream}">ZeroLink <span style="color:${C.gold}">for Mining &amp; Energy</span></span>
      <span style="width:2px;height:26px;background:rgba(242,237,213,.16)"></span></div>`);
    const slot = add(`<span class="mono" style="position:relative;display:inline-block;width:330px;height:30px;font:600 22px/30px 'JetBrains Mono';letter-spacing:.06em;color:${C.muted}"></span>`, tag);
    const clock = [[0, '13:10', 'PIT 3 · NO COVERAGE'], [T.link, '13:11', 'CREW LINKED'], [T.talk, '13:15', 'SUPERVISOR'],
      [T.ann, '13:20', 'BLAST NOTICE'], [T.meet, '13:42', 'MUSTER POINT B'], [T.roll, '13:47', 'HEADCOUNT'], [T.find, '13:52', 'SEARCH'],
      [T.sos, '14:32', 'MAN DOWN'], [T.app, '', 'STRAIGHT FROM THE APP']];
    clock.forEach(([tb, hh, st], i) => {
      const nx = clock[i + 1] ? clock[i + 1][0] - 0.125 : T.end - 0.2;
      const e = add(`<span style="position:absolute;left:0;top:0;white-space:nowrap">${hh ? `<b style="color:${C.cream}">${hh}</b>&nbsp; ` : ''}${st}</span>`, slot);
      show(e, i ? tb : 0.3, nx);
      if (i) cue(tb, 'tick');
    });
    draws.push((t) => applyVis(tag, vis(t, 0.2, T.end - 0.2)));

    const caps = [];
    const caption = (html, tin, tout) => {
      const e = add(`<div style="left:0;top:930px;width:1920px;text-align:center;font:600 36px/1.3 'Plus Jakarta Sans';color:${C.cream};letter-spacing:-.01em">${html}</div>`);
      show(e, tin, tout); caps.push(e); return e;
    };
    const em = (s) => `<span class="serif" style="color:${C.gold};font-size:1.28em">${s}</span>`;

    // ══ 0–5 · the crowd, no signal ══
    const h0 = add(`<div style="left:0;top:250px;width:1920px;text-align:center;font:800 118px/1.02 'Plus Jakarta Sans';letter-spacing:-.045em"></div>`);
    [['Deep in the pit.', 0.4], [`Far from any ${em('tower.')}`, 1.3]].forEach(([w, tw], i) => {
      if (i) h0.appendChild(document.createElement('br'));
      const e = add(`<span style="display:inline-block">${w}</span>`, h0);
      show(e, tw, T.link - 0.4, (t) => `scale(${bump(t, tw, 0.05).toFixed(4)})`);
      cue(tw, 'slam', { n: i });
    });
    // status pill: bars drop, "No service"
    const sbar = add(`<div style="left:660px;top:620px;width:600px;height:120px;border-radius:60px;background:${C.card2};display:flex;align-items:center;padding:0 46px;box-shadow:inset 0 0 0 3px rgba(242,237,213,.12)"></div>`);
    add(`<div class="mono" style="font:700 40px/1 'JetBrains Mono';color:${C.cream}">13:10</div>`, sbar);
    add(`<div style="flex:1"></div>`, sbar);
    const sig = add(`<div style="position:relative;width:250px;height:50px"></div>`, sbar);
    const bars = [16, 27, 38, 50].map((h, i) => add(`<i style="position:absolute;bottom:0;left:${i * 17}px;width:11px;height:${h}px;border-radius:3px;background:${C.cream}"></i>`, sig));
    const wifiI = add(`<div style="position:absolute;left:86px;top:4px">${ico('wifi', 40, C.cream)}</div>`, sig);
    const noSvc = add(`<div style="position:absolute;right:0;top:0;height:50px;display:flex;align-items:center;gap:12px;color:${C.red};font:700 28px/1 'Plus Jakarta Sans';white-space:nowrap">${ico('nosig', 34)}No service</div>`, sig);
    const drops = [2.2, 2.45, 2.7, 2.95];
    drops.forEach((td) => cue(td, 'tick')); cue(3.3, 'alert');
    draws.push((t) => {
      applyVis(sbar, vis(t, 1.9, T.link - 0.4), `scale(${popS(t, 1.9, 0.8).toFixed(4)})`);
      bars.forEach((b, i) => { const x = clamp((t - drops[3 - i]) / 0.18); b.style.background = mix(C.cream, C.dim, x); b.style.opacity = (1 - 0.8 * x).toFixed(3); });
      wifiI.style.opacity = (1 - clamp((t - 3.0) / 0.2)).toFixed(3);
      applyVis(noSvc, vis(t, 3.3, T.link - 0.4), `scale(${bump(t, 3.3, 0.08).toFixed(4)})`);
    });
    caption(`Mines, plants and offshore rigs run where coverage ends. ${em('Radios don’t reach everyone.')}`, 2.0, T.link - 0.3);
    cue(0, 'born'); cue(2.0, 'shimmer');

    // ══ 5–10 · phones link to each other ══
    const NS = 'http://www.w3.org/2000/svg';
    const svg = W(`<svg width="1920" height="1080" viewBox="0 0 1920 1080" style="left:0;top:0;overflow:visible"></svg>`);
    const sv = (tag, attrs, p = svg) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); p.appendChild(e); return e; };
    const LC = [960, 450];
    const ring = [0, 0.5, 1.0, 1.5].map((d) => ({ tb: T.link + 0.3 + d, e: sv('circle', { cx: LC[0], cy: LC[1], r: 110, fill: 'none', stroke: C.gold, 'stroke-width': 3 }) }));
    draws.push((t) => ring.forEach(({ tb, e }) => {
      const x = (t - tb) / 1.6;
      if (x < 0 || x > 1 || t > T.talk - 0.3) { e.setAttribute('opacity', 0); return; }
      e.setAttribute('r', (110 + 330 * (1 - Math.pow(1 - x, 3))).toFixed(1)); e.setAttribute('opacity', (0.5 * (1 - x)).toFixed(3));
    }));
    const lg1 = W(`<div style="width:210px;height:210px;border-radius:50%;background:${C.cream} url(assets/mark.png) center/78% no-repeat;box-shadow:0 30px 80px -20px rgba(0,0,0,.6)"></div>`);
    ctr(lg1, LC[0], LC[1]);
    show(lg1, T.link + 0.1, T.talk - 0.3, (t) => `scale(${popS(t, T.link + 0.1, 0.4).toFixed(4)})`);
    const crew = [['R', C.ahmad, 'Rudi · operator'], ['D', C.siti, 'Dewi · geologist'], ['H', C.hamid, 'Hasan · supervisor'], ['B', C.aminah, 'Bayu · driller'], ['Y', C.cream, 'You'], ['E', C.amber, 'Eko · electrician']];
    crew.forEach(([l, c, n], i) => {
      const ang = -Math.PI / 2 + i * (Math.PI * 2 / crew.length) + 0.3;
      const x = LC[0] + 400 * Math.cos(ang), y = LC[1] + 250 * Math.sin(ang);
      const ta = T.link + 0.9 + i * 0.25;
      const ln = sv('line', { x1: LC[0], y1: LC[1], x2: x, y2: y, stroke: C.gold, 'stroke-width': 3, 'stroke-dasharray': '6 10', opacity: 0 });
      const a = W(`<div style="display:flex;flex-direction:column;align-items:center;gap:10px;width:200px">${av(l, c, 92, l.length > 1 ? 32 : 40, c === C.cream ? C.goldInk : '#fff', 'box-shadow:0 0 0 6px ' + C.night)}<span style="font:700 22px/1 'Plus Jakarta Sans';color:${C.muted};white-space:nowrap">${n}</span></div>`);
      at(a, x - 100, y - 46);
      show(a, ta, T.talk - 0.3, (t) => `scale(${popS(t, ta, 0.3).toFixed(4)})`);
      draws.push((t) => { const p = clamp((t - ta - 0.15) / 0.35) * (1 - clamp((t - T.talk + 0.4) / 0.15)); ln.setAttribute('opacity', (0.7 * p).toFixed(3)); ln.setAttribute('stroke-dashoffset', (-(t * 40)).toFixed(1)); });
      cue(ta, 'pop', { n: i % 4 });
    });
    const cnt = W(`<div style="width:600px;text-align:center;white-space:nowrap"><span class="n" style="font:800 72px/1 'Plus Jakarta Sans';letter-spacing:-.03em;color:${C.gold}">0</span><span style="font:700 34px/1 'Plus Jakarta Sans';color:${C.cream}"> crew linked</span></div>`);
    at(cnt, 660, 800);
    const cntN = cnt.querySelector('.n');
    show(cnt, T.link + 2.4, T.talk - 0.3);
    draws.push((t) => { const n = Math.round(45 * (1 - Math.pow(1 - clamp((t - T.link - 2.5) / 1.4), 3))); cntN.textContent = n; });
    cue(T.link + 3.9, 'check');
    caption(`Every phone on site links to the next. ${em('No tower, no SIM, no internet.')}`, T.link + 0.6, T.talk - 0.3);
    cue(T.link, 'whoosh', { v: 0.6 }); cue(T.link + 0.1, 'born');

    // ══ 10–17 · push to talk ══
    const HOLD = T.talk + 2.0, REL = T.talk + 4.6;
    const cap = W(`<div style="width:640px;height:150px;border-radius:75px;display:flex;align-items:center;gap:30px;padding:0 30px;box-shadow:0 40px 90px -30px rgba(0,0,0,.7),inset 0 0 0 3px rgba(242,237,213,.12)"></div>`);
    ctr(cap, 960, 560);
    const capC = new ColorTrack(C.card2).to(HOLD, C.gold, { w: 24, z: 1 }).to(REL, C.card2, SP.soft);
    const micB = add(`<div style="width:96px;height:96px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex:none">${ico('mic', 48)}</div>`, cap);
    const capT = add(`<div style="position:relative;flex:1;height:60px"></div>`, cap);
    const tIdle = add(`<span style="position:absolute;left:0;top:8px;font:800 44px/1 'Plus Jakarta Sans';letter-spacing:-.02em;white-space:nowrap">Hold to talk</span>`, capT);
    const wave = add(`<div style="position:absolute;left:0;top:0;height:60px;display:flex;align-items:center;gap:7px"></div>`, capT);
    const wb = Array.from({ length: 30 }, () => add(`<i style="width:8px;border-radius:4px;background:${C.goldInk}"></i>`, wave));
    draws.push((t) => {
      const on = clamp((t - HOLD) / 0.1) * clamp((REL - t) / 0.1);
      applyVis(cap, vis(t, T.talk + 0.1, T.ann - 0.3), `scale(${(popS(t, T.talk + 0.1, 0.6) * (1 - 0.04 * on)).toFixed(4)})`);
      cap.style.background = capC.at(t);
      const ink = on > 0.5 ? C.goldInk : C.cream;
      cap.style.color = ink; micB.style.background = on > 0.5 ? 'rgba(7,43,38,.12)' : C.teal; micB.style.color = on > 0.5 ? C.goldInk : C.cream;
      tIdle.style.opacity = (1 - on).toFixed(3); wave.style.opacity = on.toFixed(3);
      wb.forEach((b, i) => { const h = 8 + 44 * Math.abs(Math.sin(t * 9 + i * 0.7) * Math.sin(t * 3.1 + i * 0.31)) * on; b.style.height = h.toFixed(1) + 'px'; });
    });
    cue(HOLD, 'click'); cue(HOLD + 0.05, 'drag', { d: REL - HOLD }); cue(REL, 'release');
    // speech bubble, typed while the guide talks
    const said = 'Haul road 2 is closed. Use road 1 to the crusher.';
    const bub = W(`<div style="width:760px;padding:26px 34px;border-radius:30px;background:${C.paper};color:${C.ink};box-shadow:0 30px 70px -25px rgba(0,0,0,.6)">
      <div style="display:flex;align-items:center;gap:14px">${av('H', C.hamid, 46, 22)}<span style="font:800 24px/1 'Plus Jakarta Sans';color:${C.hamid}">Hasan · supervisor</span><span class="mono" style="margin-left:auto;font:700 18px/1 'JetBrains Mono';letter-spacing:.1em;color:${C.grey}">LIVE · VOICE</span></div>
      <div class="tx" style="margin-top:16px;font:600 34px/1.3 'Plus Jakarta Sans';min-height:44px"></div></div>`);
    ctr(bub, 960, 300);
    const bubT = bub.querySelector('.tx');
    show(bub, HOLD + 0.2, T.ann - 0.3, (t) => `scale(${popS(t, HOLD + 0.2, 0.85).toFixed(4)})`);
    draws.push((t) => { const n = Math.floor(clamp((t - HOLD - 0.4) / 2.0) * said.length); bubT.textContent = said.slice(0, n); });
    // listeners
    const ls = [['R', C.ahmad], ['D', C.siti], ['B', C.aminah], ['E', C.amber], ['Y', C.cream]];
    ls.forEach(([l, c], i) => {
      const x = 960 + (i - 2) * 170, y = 780;
      const e = W(`<div style="width:100px;height:100px;display:flex;align-items:center;justify-content:center">${av(l, c, 80, l.length > 1 ? 28 : 34, c === C.cream ? C.goldInk : '#fff')}</div>`);
      ctr(e, x, y);
      const rg = W(`<div style="width:80px;height:80px;border-radius:50%;border:3px solid ${C.gold}"></div>`);
      ctr(rg, x, y);
      show(e, T.talk + 0.6 + i * 0.1, T.ann - 0.3);
      draws.push((t) => {
        const on = t > HOLD + 0.3 && t < REL + 0.4;
        const ph = ((t - HOLD - i * 0.12) % 0.8) / 0.8;
        rg.style.opacity = on ? (0.8 * (1 - ph)).toFixed(3) : 0; rg.style.transform = `scale(${(1 + ph * 0.8).toFixed(3)})`;
      });
    });
    caption(`The supervisor speaks. ${em('The whole crew hears it live,')} even where radios don’t reach.`, T.talk + 0.8, T.ann - 0.3);
    cue(T.talk, 'swap', { n: 1 });

    // ══ 17–24 · announcement ══
    const SEND = T.ann + 3.2;
    const annTxt = 'Blasting in Pit 3 at 14:00. Clear the zone by 13:45.';
    const dlg = W(`<div style="width:780px;padding:34px 40px 26px;border-radius:30px;background:${C.paper};color:${C.ink};box-shadow:0 40px 90px -30px rgba(0,0,0,.7)">
      <div style="display:flex;align-items:center;gap:14px;font:800 32px/1 'Plus Jakarta Sans'">${ico('mega', 34, C.amber)}Announcement to all members</div>
      <div style="margin-top:26px;padding-bottom:12px;border-bottom:3px solid ${C.teal};font:500 32px/1.35 'Plus Jakarta Sans';min-height:100px"><span class="tx"></span><i class="caret" style="display:inline-block;width:3px;height:34px;background:${C.teal};vertical-align:-6px;margin-left:2px"></i></div>
      <div style="margin-top:22px;display:flex;justify-content:flex-end;gap:34px;font:800 24px/1 'Plus Jakarta Sans';letter-spacing:.06em;color:${C.teal}"><span>CANCEL</span><span class="sd" style="padding:12px 22px;margin:-12px -22px;border-radius:12px">SEND</span></div></div>`);
    ctr(dlg, 960, 440);
    const dlgT = dlg.querySelector('.tx'), caret = dlg.querySelector('.caret'), sdB = dlg.querySelector('.sd');
    show(dlg, T.ann + 0.1, SEND + 0.25, (t) => `scale(${(popS(t, T.ann + 0.1, 0.7) * (1 - 0.3 * clamp((t - SEND - 0.05) / 0.2))).toFixed(4)})`);
    draws.push((t) => {
      const n = Math.floor(clamp((t - T.ann - 0.6) / 2.0) * annTxt.length); dlgT.textContent = annTxt.slice(0, n);
      caret.style.opacity = Math.floor(t * 3) % 2 ? 0 : 1;
      sdB.style.background = t > SEND - 0.05 && t < SEND + 0.25 ? 'rgba(14,96,84,.15)' : 'transparent';
    });
    for (let i = 0; i < annTxt.length; i += 3) cue(T.ann + 0.6 + 2.0 * i / annTxt.length, 'key', { n: i });
    cue(SEND, 'click'); cue(SEND + 0.1, 'whoosh', { v: 0.6 });
    // delivered banner + recipients
    const ban = W(`<div style="width:900px;padding:26px 34px;border-radius:26px;background:${C.annBg};color:${C.ink};box-shadow:0 30px 80px -30px rgba(0,0,0,.6)">
      <div class="mono" style="font:700 20px/1 'JetBrains Mono';letter-spacing:.12em;color:${C.amber}">ANNOUNCEMENT · HASAN · 13:20</div>
      <div style="margin-top:14px;font:800 36px/1.25 'Plus Jakarta Sans';letter-spacing:-.01em">${annTxt}</div></div>`);
    ctr(ban, 960, 330);
    show(ban, SEND + 0.3, T.meet - 0.3, (t) => `scale(${popS(t, SEND + 0.3, 0.8).toFixed(4)})`);
    cue(SEND + 0.3, 'pop', { n: 2 });
    const rec = [['R', C.ahmad], ['D', C.siti], ['E', C.amber], ['F', '#7048e8'], ['K', '#0ca678'], ['N', '#ae3ec9'], ['Z', '#f59f00'], ['U', '#495057'], ['B', C.aminah]];
    rec.forEach(([l, c], i) => {
      const x = 960 + (i - 4) * 104, y = 560;
      const ta = SEND + 0.7 + i * 0.16;
      const e = W(`<div style="width:84px;height:84px">${av(l, c, 84, l.length > 1 ? 28 : 34)}<div class="bd" style="position:absolute;right:-6px;bottom:-6px;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 4px ${C.night}"></div></div>`);
      ctr(e, x, y);
      const bd = e.querySelector('.bd');
      const last = i === rec.length - 1;
      bd.innerHTML = last ? ico('clock', 22, C.goldInk) : ico('check', 22, '#fff');
      bd.style.background = last ? C.gold : C.leaf;
      show(e, SEND + 0.5 + i * 0.05, T.meet - 0.3, (t) => last ? `scale(1)` : '');
      draws.push((t) => { const p = stepR(t - ta, SP.pop); bd.style.transform = `scale(${p.toFixed(3)})`; e.style.filter = last && t > SEND + 0.6 ? 'grayscale(.7)' : e.style.filter; });
      if (!last) cue(ta, 'tick');
    });
    const dcnt = W(`<div style="width:900px;text-align:center;font:700 30px/1.3 'Plus Jakarta Sans';color:${C.cream};white-space:nowrap">Delivered to <span class="n" style="color:${C.gold}">0</span>/45 <span style="color:${C.muted}">· Bayu gets it when he is back in range</span></div>`);
    ctr(dcnt, 960, 680);
    const dN = dcnt.querySelector('.n');
    show(dcnt, SEND + 0.7, T.meet - 0.3);
    draws.push((t) => { dN.textContent = Math.round(44 * (1 - Math.pow(1 - clamp((t - SEND - 0.7) / 1.5), 3))); });
    cue(SEND + 2.3, 'check');
    caption(`One blast notice for the whole site. ${em('You see who has it.')}`, T.ann + 0.6, T.meet - 0.3);
    cue(T.ann, 'swap', { n: 2 });

    // ══ 24–31 · meeting point on the compass ══
    const RC = [700, 470], RR = 300;
    const disc = W(`<div style="width:${RR * 2}px;height:${RR * 2}px;border-radius:50%;background:radial-gradient(circle at 50% 50%, #12443b, ${C.card} 70%);box-shadow:0 40px 100px -30px rgba(0,0,0,.8),inset 0 0 0 3px rgba(242,237,213,.12)"></div>`);
    ctr(disc, RC[0], RC[1]);
    const rsv = add(`<svg width="${RR * 2}" height="${RR * 2}" viewBox="0 0 ${RR * 2} ${RR * 2}" style="position:absolute;left:0;top:0"></svg>`, disc);
    [0.33, 0.66].forEach((f) => sv('circle', { cx: RR, cy: RR, r: RR * f, fill: 'none', stroke: 'rgba(242,237,213,.12)', 'stroke-width': 2 }, rsv));
    sv('line', { x1: RR, y1: 20, x2: RR, y2: RR * 2 - 20, stroke: 'rgba(242,237,213,.06)', 'stroke-width': 2 }, rsv);
    sv('line', { x1: 20, y1: RR, x2: RR * 2 - 20, y2: RR, stroke: 'rgba(242,237,213,.06)', 'stroke-width': 2 }, rsv);
    [['N', RR, 34, C.red], ['E', RR * 2 - 34, RR, C.muted], ['S', RR, RR * 2 - 34, C.muted], ['W', 34, RR, C.muted]].forEach(([l, x, y, c]) => {
      add(`<div style="position:absolute;left:${x - 15}px;top:${y - 15}px;width:30px;height:30px;text-align:center;font:800 24px/30px 'Plus Jakarta Sans';color:${c}">${l}</div>`, disc);
    });
    const sweep = add(`<div style="position:absolute;left:0;top:0;width:100%;height:100%;border-radius:50%;background:conic-gradient(from 0deg, rgba(246,184,76,.22), transparent 60deg)"></div>`, disc);
    const me = add(`<div style="position:absolute;left:${RR - 14}px;top:${RR - 14}px;width:28px;height:28px;border-radius:50%;background:${C.cream};box-shadow:0 0 0 8px rgba(242,237,213,.18)"></div>`, disc);
    const FL = [RR + 170, RR - 170];
    const flag = add(`<div style="position:absolute;left:${FL[0] - 40}px;top:${FL[1] - 40}px;width:80px;height:80px;border-radius:50%;background:${C.gold};color:${C.goldInk};display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 8px rgba(246,184,76,.25)">${ico('flag', 40)}</div>`, disc);
    show(disc, T.meet + 0.1, T.roll - 0.3, (t) => `scale(${popS(t, T.meet + 0.1, 0.6).toFixed(4)})`);
    draws.push((t) => { me.style.opacity = (1 - clamp((t - T.meet - 2.5) / 0.3)).toFixed(3); sweep.style.transform = `rotate(${((t - T.meet) * 120).toFixed(1)}deg)`; flag.style.transform = `scale(${popS(t, T.meet + 0.7, 0).toFixed(4)})`; });
    cue(T.meet + 0.7, 'pop', { n: 1 });
    const walkers = [['R', C.ahmad, [80, 420], T.meet + 1.6], ['D', C.siti, [470, 520], T.meet + 2.3], ['E', C.amber, [130, 150], T.meet + 3.0], ['Y', C.cream, [RR, RR], T.meet + 3.7]];
    walkers.forEach(([l, c, p0, ta], i) => {
      const d = add(`${av(l, c, 56, 24, c === C.cream ? C.goldInk : '#fff', 'position:absolute;box-shadow:0 0 0 4px ' + C.card)}`, disc);
      const ang = (i * 1.7) % (Math.PI * 2);
      const end = [FL[0] + 62 * Math.cos(ang), FL[1] + 62 * Math.sin(ang)];
      draws.push((t) => {
        const p = stepR(t - (ta - 1.3), { w: 5, z: 1 });
        const x = lerp(p0[0], end[0], p), y = lerp(p0[1], end[1], p);
        d.style.left = (x - 28).toFixed(1) + 'px'; d.style.top = (y - 28).toFixed(1) + 'px';
        d.style.opacity = vis(t, T.meet + 0.9 + i * 0.1, null).o.toFixed(3);
        d.style.transform = `scale(${bump(t, ta, 0.2, 0.1).toFixed(3)})`;
      });
      cue(ta, 'check');
    });
    const mpP = W(`<div style="width:620px;white-space:nowrap">
      <div class="mono" style="font:700 22px/1 'JetBrains Mono';letter-spacing:.14em;color:${C.gold}">MUSTER POINT · SET BY HASAN</div>
      <div style="margin-top:18px;font:800 80px/1 'Plus Jakarta Sans';letter-spacing:-.045em">Muster Point B</div>
      <div style="margin-top:16px;display:flex;align-items:center;gap:14px;font:600 34px/1 'Plus Jakarta Sans';color:${C.muted}">${ico('up', 34, C.gold, 'transform:rotate(45deg)')}<span class="dist">250</span>&nbsp;m · northeast</div>
      <div style="margin-top:48px;font:700 26px/1 'Plus Jakarta Sans';color:${C.muted}">ARRIVED</div>
      <div style="margin-top:10px;font:800 80px/1 'Plus Jakarta Sans'"><span class="n">0</span><span style="color:${C.dim}">/4</span></div></div>`);
    at(mpP, 1120, 250);
    const mpN = mpP.querySelector('.n'), mpD = mpP.querySelector('.dist');
    show(mpP, T.meet + 0.5, T.roll - 0.3);
    draws.push((t) => {
      let n = 0; for (const w of walkers) if (t >= w[3]) n++;
      mpN.textContent = n; mpN.style.color = n === 4 ? C.gold : C.cream;
      mpN.style.display = 'inline-block'; mpN.style.transform = `scale(${walkers.reduce((s, w) => s * bump(t, w[3], 0.18), 1).toFixed(4)})`;
      mpD.textContent = Math.round(250 * (1 - stepR(t - T.meet - 2.4, { w: 4, z: 1 })));
    });
    cue(T.meet + 3.7, 'slam', { n: 3 });
    caption(`Clear the blast zone. ${em('Everyone is guided to the muster point,')} arrivals are counted.`, T.meet + 0.6, T.roll - 0.3);
    cue(T.meet, 'swap', { n: 3 });

    // ══ 31–37 · roll call ══
    const SAFE = T.roll + 1.4;
    const rc = W(`<div style="width:640px;padding:30px 34px;border-radius:30px;background:${C.annBg};color:${C.ink};box-shadow:0 40px 90px -30px rgba(0,0,0,.7)">
      <div class="mono" style="font:700 20px/1 'JetBrains Mono';letter-spacing:.12em;color:${C.amber}">HEADCOUNT · BEFORE THE BLAST</div>
      <div style="margin-top:14px;font:800 42px/1.15 'Plus Jakarta Sans';letter-spacing:-.02em">How are you right now?</div>
      <div style="margin-top:26px;display:flex;gap:14px;font:800 26px/1 'Plus Jakarta Sans';color:#fff">
        <span class="sf" style="flex:1;padding:22px 0;text-align:center;border-radius:16px;background:${C.teal}">Safe</span>
        <span style="flex:1;padding:22px 0;text-align:center;border-radius:16px;background:${C.amber}">Need help</span>
        <span style="flex:1;padding:22px 0;text-align:center;border-radius:16px;background:#e03131">Injured</span></div></div>`);
    at(rc, 160, 300);
    const sfB = rc.querySelector('.sf');
    show(rc, T.roll + 0.1, T.find - 0.3, (t) => `scale(${popS(t, T.roll + 0.1, 0.8).toFixed(4)})`);
    draws.push((t) => { sfB.style.transform = `scale(${press(t, SAFE).toFixed(4)})`; sfB.style.boxShadow = t > SAFE ? `0 0 0 5px ${C.gold}` : 'none'; });
    cue(SAFE, 'click');
    const ppl = [['Y', C.cream, 0], ['R', C.ahmad, 0], ['D', C.siti, 1], ['H', C.hamid, 0], ['E', C.amber, 0], ['F', '#7048e8', 0],
      ['K', '#0ca678', 0], ['N', '#ae3ec9', 0], ['Z', '#f59f00', 0], ['U', '#495057', 0], ['J', '#e64980', 0], ['B', C.aminah, -1]];
    const stc = [C.leaf, C.amber, '#e03131'];
    ppl.forEach(([l, c, s], i) => {
      const x = 1070 + (i % 4) * 160, y = 330 + Math.floor(i / 4) * 170;
      const ta = SAFE + 0.15 + i * 0.13;
      const box = W(`<div style="width:110px;height:110px;border-radius:50%"></div>`);
      ctr(box, x, y);
      const ringE = add(`<div style="position:absolute;inset:0;border-radius:50%"></div>`, box);
      const a = add(av(l, c, 86, l.length > 1 ? 30 : 36, c === C.cream ? C.goldInk : '#fff', 'position:absolute;left:12px;top:12px'), box);
      show(box, T.roll + 0.3 + i * 0.03, T.find - 0.3);
      draws.push((t) => {
        if (s >= 0) { const p = stepR(t - ta, SP.pop); ringE.style.boxShadow = `inset 0 0 0 ${(7 * p).toFixed(1)}px ${stc[s]}`; }
        else if (i === ppl.length - 1) {
          const k = t > ta ? 0.5 + 0.5 * Math.sin((t - ta) * 7) : 0; ringE.style.boxShadow = `0 0 0 ${(4 + 8 * k).toFixed(1)}px rgba(255,107,107,${(0.35 + 0.4 * k).toFixed(2)})`;
          a.style.filter = t > ta ? 'grayscale(1) brightness(.7)' : 'none';
        }
      });
      if (s >= 0 && i % 2 === 0) cue(ta, 'tick');
    });
    const miss = W(`<div style="white-space:nowrap;display:flex;align-items:center;gap:14px;padding:14px 22px;border-radius:999px;background:rgba(255,107,107,.16);color:${C.red};font:800 26px/1 'Plus Jakarta Sans'">Bayu · no answer</div>`);
    at(miss, 1115, 790);
    const MISS = SAFE + 0.15 + 11 * 0.13 + 0.3;
    show(miss, MISS, T.find - 0.3, (t) => `scale(${bump(t, MISS, 0.08).toFixed(4)})`);
    cue(MISS, 'alert');
    const rcN = W(`<div style="white-space:nowrap;font:700 30px/1 'Plus Jakarta Sans';color:${C.muted}"><span class="n" style="color:${C.cream}">0</span> of 12 answered</div>`);
    at(rcN, 160, 640);
    const rcNN = rcN.querySelector('.n');
    show(rcN, SAFE, T.find - 0.3);
    draws.push((t) => { let n = 0; ppl.forEach(([, , s], i) => { if (s >= 0 && t >= SAFE + 0.15 + i * 0.13) n++; }); rcNN.textContent = n; });
    caption(`Headcount in one tap. ${em('Know who is missing before the blast.')}`, T.roll + 0.6, T.find - 0.3);
    cue(T.roll, 'swap', { n: 4 });

    // ══ 37–43 · the search card travels ══
    const nodes = [[260, 470], [620, 400], [960, 500], [1300, 400], [1660, 470]];
    const nodeE = nodes.map(([x, y], i) => {
      const e = W(`<div style="width:120px;height:210px;border-radius:24px;background:#0b0f0e;box-shadow:0 30px 60px -20px rgba(0,0,0,.7),inset 0 0 0 3px rgba(242,237,213,.14);padding:10px">
        <div style="width:100%;height:100%;border-radius:16px;background:${C.card2};display:flex;align-items:flex-end;justify-content:center;padding-bottom:16px"><span class="mono" style="font:700 15px/1 'JetBrains Mono';color:${C.muted};letter-spacing:.08em">${['PIT 3', 'HAUL RD', 'CRUSHER', 'WORKSHOP', 'RIG 7'][i]}</span></div></div>`);
      ctr(e, x, y);
      show(e, T.find + 0.1 + i * 0.08, T.sos - 0.3);
      return e;
    });
    const nsv = W(`<svg width="1920" height="1080" viewBox="0 0 1920 1080" style="left:0;top:0;overflow:visible;pointer-events:none"></svg>`);
    const links = nodes.slice(1).map(([x, y], i) => sv('line', { x1: nodes[i][0], y1: nodes[i][1], x2: x, y2: y, stroke: C.gold, 'stroke-width': 3, 'stroke-dasharray': '4 10', opacity: 0 }, nsv));
    const hopT = (i) => T.find + 1.0 + i * 0.55;
    draws.push((t) => links.forEach((l, i) => { l.setAttribute('opacity', (0.6 * vis(t, hopT(i) - 0.2, T.sos - 0.3).o).toFixed(3)); l.setAttribute('stroke-dashoffset', (-(t * 50)).toFixed(1)); }));
    const pk = W(`<div style="width:120px;height:74px;border-radius:14px;background:${C.paper};color:${C.ink};display:flex;align-items:center;justify-content:center;gap:8px;font:800 16px/1 'Plus Jakarta Sans';box-shadow:0 10px 30px rgba(0,0,0,.5)">${ico('search', 22, C.amber)}SEARCH</div>`);
    draws.push((t) => {
      const k = (t - hopT(0)) / 0.55; const i = clamp(Math.floor(k), 0, nodes.length - 2), f = clamp(k - i);
      const e2 = f < 0.5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2;
      const x = lerp(nodes[i][0], nodes[i + 1][0], e2), y = lerp(nodes[i][1], nodes[i + 1][1], e2) - 150 - 60 * Math.sin(Math.PI * f);
      ctr(pk, x, y);
      const o = t < hopT(0) - 0.2 || t > hopT(nodes.length - 1) + 0.1 ? 0 : 1;
      pk.style.opacity = o; pk.style.visibility = o ? 'visible' : 'hidden';
      nodeE.forEach((n, j) => { const hit = hopT(j) - 0.55; n.style.boxShadow = `0 30px 60px -20px rgba(0,0,0,.7),inset 0 0 0 3px ${t > hit && t < T.sos ? 'rgba(246,184,76,.9)' : 'rgba(242,237,213,.14)'}`; });
    });
    nodes.forEach((_, j) => { if (j) cue(hopT(j) - 0.55, 'pop', { n: j % 4 }); });
    const FOUND = T.find + 4.2;
    const sc = W(`<div style="width:780px;padding:28px 34px;border-radius:28px;background:${C.annBg};color:${C.ink};box-shadow:0 40px 90px -30px rgba(0,0,0,.8)">
      <div class="mono" style="font:700 20px/1 'JetBrains Mono';letter-spacing:.12em;color:${C.amber}">LOOKING FOR SOMEONE · 13:52</div>
      <div style="margin-top:12px;font:800 46px/1.1 'Plus Jakarta Sans';letter-spacing:-.02em">Bayu · driller</div>
      <div style="margin-top:12px;font:500 28px/1.35 'Plus Jakarta Sans';color:${C.grey}">Orange coverall, white helmet. Last seen at drill rig 7, phone battery low.</div>
      <div class="fb" style="margin-top:22px;padding:20px 0;border-radius:16px;text-align:center;font:800 26px/1 'Plus Jakarta Sans';color:#fff"></div></div>`);
    ctr(sc, 960, 640);
    const fb = sc.querySelector('.fb');
    show(sc, T.find + 3.1, T.sos - 0.3, (t) => `scale(${popS(t, T.find + 3.1, 0.6).toFixed(4)})`);
    draws.push((t) => { const f = t >= FOUND; fb.textContent = f ? '✓ Safe at rig 7 · marked by Rudi' : 'Found them'; fb.style.background = f ? C.leaf : C.teal; fb.style.transform = `scale(${(press(t, FOUND) * bump(t, FOUND + 0.05, 0.05)).toFixed(4)})`; });
    cue(FOUND, 'click'); cue(FOUND + 0.1, 'check');
    caption(`The search card travels phone to phone across the site. ${em('Found, and everyone knows.')}`, T.find + 0.6, T.sos - 0.3);
    cue(T.find, 'swap', { n: 5 });

    // ══ 43–50 · SOS (the drop) ══
    cue(T.sos - 2.4, 'riser', { d: 2.4 }); cue(T.sos, 'drop'); cue(T.sos + 0.15, 'alert'); cue(T.sos + 0.8, 'alert'); cue(T.sos + 1.5, 'alert');
    [0, 0.5, 1.0, 1.5].forEach((d, i) => cue(T.sos + d, 'slam', { n: 8 + i }));
    const sos = W(`<div style="width:1600px;height:600px;border-radius:56px;background:${C.sos};box-shadow:0 60px 140px -30px rgba(0,0,0,.8);display:flex;align-items:center;padding:0 90px;gap:80px;color:#fff"></div>`);
    ctr(sos, 960, 470);
    const sL = add(`<div style="flex:1"></div>`, sos);
    add(`<div class="mono" style="font:700 24px/1 'JetBrains Mono';letter-spacing:.14em;opacity:.85">SOS · CONVEYOR 2 · 14:32</div>`, sL);
    add(`<div style="margin-top:20px;font:800 120px/1 'Plus Jakarta Sans';letter-spacing:-.05em">SOS</div>`, sL);
    add(`<div style="margin-top:14px;display:flex;align-items:center;gap:18px;font:800 46px/1.1 'Plus Jakarta Sans'">${av('D', '#fff', 64, 30, C.siti)}Dewi needs help</div>`, sL);
    const chips = add(`<div style="margin-top:30px;display:flex;flex-wrap:wrap;gap:12px"></div>`, sL);
    const chipE = ['Fall injury', 'Blood type B+', 'Allergy penicillin', 'Battery 34%'].map((c) => add(`<span style="padding:12px 20px;border-radius:999px;background:rgba(255,255,255,.18);font:700 24px/1 'Plus Jakarta Sans';white-space:nowrap">${c}</span>`, chips));
    const sR = add(`<div style="width:420px;height:420px;border-radius:50%;background:rgba(0,0,0,.18);position:relative;flex:none"></div>`, sos);
    const arr = add(`<div style="position:absolute;left:110px;top:110px;width:200px;height:200px;color:#fff">${ico('up', 200, '#fff')}</div>`, sR);
    const dist = add(`<div style="position:absolute;left:0;bottom:-74px;width:420px;text-align:center;font:800 46px/1 'Plus Jakarta Sans';white-space:nowrap"><span class="n">180</span> m · east</div>`, sR);
    const dN2 = dist.querySelector('.n');
    draws.push((t) => {
      applyVis(sos, vis(t, T.sos, T.app - 0.3), `scale(${(popS(t, T.sos, 0.4) * [0.5, 1.0, 1.5].reduce((s, d) => s * bump(t, T.sos + d, 0.015), 1)).toFixed(4)})`);
      chipE.forEach((c, i) => { const ta = T.sos + 1.2 + i * 0.3; c.style.opacity = stepR(t - ta, SP.text).toFixed(3); c.style.transform = `scale(${popS(t, ta, 0.6).toFixed(3)})`; });
      const ang = -40 + 130 * stepR(t - T.sos - 2.4, { w: 6, z: 0.6 });
      arr.style.transform = `rotate(${ang.toFixed(1)}deg)`;
      const d = Math.max(0, Math.round(180 * (1 - clamp((t - T.sos - 3.0) / 3.0))));
      dN2.textContent = d; dist.lastChild.textContent = d === 0 ? ' m · with her' : ' m · east';
    });
    chipE.forEach((_, i) => cue(T.sos + 1.2 + i * 0.3, 'pop', { n: i }));
    cue(T.sos + 6.0, 'settle');
    caption(`Man-down SOS with location and medical card. ${em('Help is led straight to her.')}`, T.sos + 0.6, T.app - 0.3);

    // ══ 50–56 · straight from the app ══
    const shots = [['2-grup-dan-chat', -330, 0.86, -8], ['19-sos-dengan-info-medis', 0, 1, 0], ['24-titik-kumpul-di-kompas', 330, 0.86, 8]];
    shots.forEach(([s, dx, sc0, rot], i) => {
      const ph = W(`<div style="width:330px;height:700px;border-radius:44px;background:#0b0f0e;padding:12px;box-shadow:0 50px 110px -30px rgba(0,0,0,.85),inset 0 0 0 3px rgba(242,237,213,.14)">
        <div style="width:306px;height:676px;border-radius:34px;overflow:hidden;background:url(assets/${s}.jpg) center/cover"></div></div>`);
      ctr(ph, 960 + dx, 450);
      const ta = T.app + 0.15 + (i === 1 ? 0 : 0.25);
      draws.push((t) => {
        const p = stepR(t - ta, SP.shape);
        const fl = Math.sin((t - T.app) * 1.4 + i) * 8;
        applyVis(ph, vis(t, ta, T.end - 0.3), `translateY(${((1 - p) * 120 + fl).toFixed(1)}px) rotate(${(rot * p).toFixed(2)}deg) scale(${(sc0 * (0.85 + 0.15 * p)).toFixed(4)})`);
        ph.style.zIndex = i === 1 ? 3 : 2;
      });
      cue(ta, 'pop', { n: i });
    });
    caption(`Real screens, ${em('straight from the app.')}`, T.app + 0.6, T.end - 0.3);
    cue(T.app, 'whoosh', { v: 0.7 }); cue(T.app + 0.6, 'shimmer');

    // ══ 56–62 · end card ══
    const CTA = T.end + 3.2;
    const lg = W(`<div style="width:190px;height:190px;border-radius:50%;background:${C.cream} url(assets/mark.png) center/78% no-repeat"></div>`);
    ctr(lg, 960, 280);
    draws.push((t) => applyVis(lg, vis(t, T.end, null), `scale(${popS(t, T.end, 0.6).toFixed(4)})`));
    cue(T.end, 'slam', { n: 12 }); cue(T.end, 'born');
    const wm = add(`<div style="left:0;top:430px;width:1920px;text-align:center;font:800 116px/1 'Plus Jakarta Sans';letter-spacing:-.05em">Zero<span style="color:${C.gold}">Link</span></div>`);
    const tg = add(`<div style="left:0;top:570px;width:1920px;text-align:center;font:500 42px/1.2 'Plus Jakarta Sans';color:${C.muted}">for mining &amp; energy sites · keep every worker ${em('connected.')}</div>`);
    show(wm, T.end + 0.5, null); show(tg, T.end + 1.0, null); cue(T.end + 0.5, 'pop'); cue(T.end + 1.0, 'shimmer');
    const cta = add(`<div style="top:700px;height:96px;border-radius:48px;display:flex;align-items:center;justify-content:center;font:800 34px/1 'Plus Jakarta Sans';white-space:nowrap;overflow:hidden"></div>`);
    const ctaA = add(`<span style="position:absolute;display:flex;align-items:center;gap:14px">Equip your crew${ico('arrow', 34)}</span>`, cta);
    const ctaB = add(`<span style="position:absolute" class="mono">zerolink.web.id</span>`, cta);
    const ctaC = new ColorTrack(C.gold).to(CTA, C.cream, SP.soft);
    const CWt = new Track(500).to(CTA, 470, SP.shape);
    draws.push((t) => {
      const w = CWt.at(t); cta.style.left = (960 - w / 2).toFixed(2) + 'px'; cta.style.width = w.toFixed(2) + 'px';
      applyVis(cta, vis(t, T.end + 1.5, null), `scale(${(popS(t, T.end + 1.5, 0.8) * press(t, CTA)).toFixed(4)})`);
      cta.style.background = ctaC.at(t); cta.style.color = C.goldInk;
      applyVis(ctaA, vis(t, T.end + 1.6, CTA - 0.05, 0.08)); applyVis(ctaB, vis(t, CTA + 0.05, null));
    });
    cue(T.end + 1.5, 'pop'); cue(CTA, 'cta');
    const fine = add(`<div class="mono" style="left:0;top:860px;width:1920px;text-align:center;font:600 24px/1.6 'JetBrains Mono';color:${C.muted};letter-spacing:.04em">Works without towers, SIM or internet · Android 6.0+</div>`);
    show(fine, T.end + 2.4, null); cue(T.end + 2.4, 'shimmer');

    // ───────────────────────── Cursor ("Hasan") ─────────────────────────
    const cur = add(`<div class="cur"><svg viewBox="0 0 24 24"><path d="M4 2.5 20 11l-7 1.8L9.6 20z" fill="#f2edd5" stroke="#072b26" stroke-width="1.6" stroke-linejoin="round"/></svg><span class="pill">Hasan</span></div>`);
    const curPill = cur.querySelector('.pill');
    const rip = add('<div class="rip"></div>');
    const CX = new Track(1560), CYt = new Track(990), CO = new Track(0);
    const mv = (t, x, y, sp = SP.cursor) => { CX.to(t, x, sp); CYt.to(t, y, sp); };
    const clicks = [HOLD, SEND, SAFE, FOUND, CTA];
    CO.to(T.talk + 0.6, 1, SP.text);
    mv(T.talk + 1.0, 720, 580);                 // mic button
    mv(REL + 0.4, 1560, 990, SP.soft);
    // SEND button of the dialog (bottom right)
    mv(T.ann + 2.4, 960 + 390 - 70, 440 + dlg.offsetHeight / 2 - 40);
    mv(SEND + 0.6, 1560, 990, SP.soft);
    mv(T.roll + 0.6, 160 + 100, 300 + rc.offsetHeight - 70);   // Safe
    mv(SAFE + 0.6, 1560, 990, SP.soft);
    mv(T.find + 3.6, 960, 640 + sc.offsetHeight / 2 - 70);      // Found them
    mv(FOUND + 0.6, 1560, 1000, SP.soft);
    CO.to(FOUND + 0.9, 0, SP.text);
    mv(T.end + 1.8, 1500, 980, SP.snap); CO.to(T.end + 2.0, 1, SP.text);
    mv(CTA - 0.6, 990, 750);
    mv(CTA + 0.9, 1300, 980, SP.soft);
    CO.to(DUR - 0.8, 0, SP.text);
    draws.push((t) => {
      const [sx, sy] = toS(CX.at(t), CYt.at(t), t);
      const o = clamp(CO.at(t));
      const vx = (toS(CX.at(t + 0.01), CYt.at(t + 0.01), t + 0.01)[0] - sx) / 0.01;
      let s = 1; for (const c of clicks) s *= press(t, c);
      s *= 1 - 0.12 * clamp((t - HOLD) / 0.08) * clamp((REL - t) / 0.08);
      at(cur, sx, sy); cur.style.opacity = o.toFixed(3); cur.style.visibility = o < 0.01 ? 'hidden' : 'visible';
      cur.style.transform = `rotate(${clamp(-vx * 0.0045, -14, 14).toFixed(2)}deg) scale(${s.toFixed(4)})`;
      curPill.textContent = t > T.end ? 'You' : 'Hasan';
      let rp = null, rx = 0, ry = 0; for (const c of clicks) { const r = ripple(t, c); if (r) { rp = r; [rx, ry] = toS(CX.at(c), CYt.at(c), t); } }
      if (rp && o > 0.3) { at(rip, rx, ry); rip.style.opacity = rp.o.toFixed(3); rip.style.transform = `scale(${rp.s.toFixed(3)})`; } else rip.style.opacity = 0;
    });

    // ───────────────────────── Seek ─────────────────────────
    window.seek = (t) => {
      const z = Math.exp(CAM.z.at(t)), zx = CAM.zx.at(t), zy = CAM.zy.at(t), q = shake(t);
      world.style.transform = `translate(${(zx + q).toFixed(2)}px, ${zy.toFixed(2)}px) scale(${z.toFixed(5)}) translate(${(-zx).toFixed(2)}px, ${(-zy).toFixed(2)}px)`;
      for (const d of draws) d(t);
    };
    cues.sort((a, b) => a.t - b.t);
    window.FILM = { width: 1920, height: 1080, bpm: 120, duration: DUR,
      sections: { intro: [0, T.link], build: [T.find, T.sos], drop: [T.sos, T.app], outro: [T.end, DUR] }, cues };
    window.seek(0);
    window.READY = true;
  } catch (err) {
    window.FILM_ERROR = String(err && err.stack || err);
    console.error(err);
  }
})();
