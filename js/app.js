/* ==========================================================================
   APP CORE LOGIC - EXACT INSTAGRAM MATCH & EXPORT
   ========================================================================== */

(function () {
  'use strict';

  // --- STATE ---
  const state = {
    theme: 'light',
    activeTab: 'stats',
    statusBar: { time: '11:35', signal: 4, network: 'wifi', battery: 35, silent: true, showBatteryNum: true },
    story:     { image: DEFAULT_STORY_IMAGES[0], viewsCount: '92', showPill: true },
    tabViewersCount: '92',
    stats: {
      views: 92, interactions: 2, profileActivity: 0,
      followersPct: 97.8, nonfollowersPct: 2.2,
      reached: 90, likes: 2, replies: '0', shares: '--'
    },
    viewers: [
      { id: 'v1', username: 'emily.clarke', name: 'Emily Clarke', verified: true, reaction: '❤️', ring: 'gradient', avatar: DEFAULT_AVATARS[0] }
    ]
  };

  // --- INIT ---
  document.addEventListener('DOMContentLoaded', () => {
    initPresetButtons();
    initToolbarControls();
    initTabSwitching();
    initFormBindings();
    initViewersControls();
    initExportActions();
    renderAll();
  });

  // --- PRESETS ---
  function initPresetButtons() {
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        applyPreset(btn.dataset.preset);
        document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }

  function applyPreset(key) {
    const p = PRESETS[key];
    if (!p) return;
    state.theme           = p.theme || 'light';
    state.statusBar       = { ...p.statusBar };
    state.stats           = { ...p.stats };
    state.story           = { ...p.story };
    state.tabViewersCount = p.tabViewersCount || '';
    state.viewers         = JSON.parse(JSON.stringify(p.viewers || []));
    applyTheme(state.theme);
    populateInputs();
    renderAll();
    showToast(`Loaded: ${p.name}`);
  }

  function applyTheme(theme) {
    const frame = document.getElementById('iphone-phone-frame');
    if (frame) {
      if (theme === 'dark') {
        frame.classList.add('theme-dark');
      } else {
        frame.classList.remove('theme-dark');
      }
    }
  }

  // --- POPULATE INPUTS ---
  function populateInputs() {
    setVal('select-theme-mode',             state.theme);
    setVal('input-phone-time',              state.statusBar.time);
    setVal('slider-battery',                state.statusBar.battery);
    setVal('select-battery-pct-mode',       state.statusBar.showBatteryNum !== false ? 'show' : 'hide');
    setVal('slider-signal',                 state.statusBar.signal);
    setVal('select-network-mode',           state.statusBar.network || 'wifi');
    setVal('select-silent-mode',            state.statusBar.silent !== false ? 'show' : 'hide');
    setVal('input-story-views-count',       state.story.viewsCount);
    setVal('select-story-pill-visibility',  state.story.showPill !== false ? 'show' : 'hide');
    setVal('input-tab-viewers-count',       state.tabViewersCount);
    setVal('input-stat-views',              state.stats.views);
    setVal('input-stat-interactions',       state.stats.interactions);
    setVal('input-stat-profile',            state.stats.profileActivity);
    setVal('input-donut-followers',         state.stats.followersPct);
    setVal('input-donut-nonfollowers',      state.stats.nonfollowersPct);
    setVal('input-stat-reached',            state.stats.reached);
    setVal('input-stat-likes',              state.stats.likes);
    setVal('input-stat-replies',            state.stats.replies);
  }

  function setVal(id, v) { const el = document.getElementById(id); if (el) el.value = v; }

  // --- FORM BINDINGS ---
  function initFormBindings() {
    const themeSelect = document.getElementById('select-theme-mode');
    if (themeSelect) {
      themeSelect.addEventListener('change', e => {
        state.theme = e.target.value;
        applyTheme(state.theme);
      });
    }

    bind('input-phone-time',   v => { state.statusBar.time = v; renderStatusBar(); });
    bind('slider-battery',     v => { state.statusBar.battery = parseInt(v, 10); renderStatusBar(); });

    const batPctSelect = document.getElementById('select-battery-pct-mode');
    if (batPctSelect) {
      batPctSelect.addEventListener('change', e => {
        state.statusBar.showBatteryNum = e.target.value === 'show';
        renderStatusBar();
      });
    }

    bind('slider-signal',      v => { state.statusBar.signal = parseInt(v, 10); renderStatusBar(); });

    const netSelect = document.getElementById('select-network-mode');
    if (netSelect) {
      netSelect.addEventListener('change', e => {
        state.statusBar.network = e.target.value;
        renderStatusBar();
      });
    }

    const silentSelect = document.getElementById('select-silent-mode');
    if (silentSelect) {
      silentSelect.addEventListener('change', e => {
        state.statusBar.silent = e.target.value === 'show';
        renderStatusBar();
      });
    }

    bind('input-story-views-count', v => {
      state.story.viewsCount = v;
      renderStoryTop();
    });

    const pillVisSelect = document.getElementById('select-story-pill-visibility');
    if (pillVisSelect) {
      pillVisSelect.addEventListener('change', e => {
        state.story.showPill = e.target.value === 'show';
        renderStoryTop();
      });
    }

    bind('input-tab-viewers-count', v => {
      state.tabViewersCount = v;
      renderStoryTop();
      updateUnderlinePosition();
    });

    bind('input-stat-views', v => {
      state.stats.views = v;
      if (document.getElementById('input-story-views-count')) {
        document.getElementById('input-story-views-count').value = v;
        state.story.viewsCount = v;
      }
      if (document.getElementById('input-tab-viewers-count')) {
        document.getElementById('input-tab-viewers-count').value = v;
        state.tabViewersCount = v;
      }
      renderStoryTop();
      renderStats();
      updateUnderlinePosition();
    });

    bind('input-stat-interactions', v => { state.stats.interactions = v; renderStats(); });
    bind('input-stat-profile',      v => { state.stats.profileActivity = v; renderStats(); });

    bind('input-donut-followers', v => {
      state.stats.followersPct = parseFloat(v) || 0;
      state.stats.nonfollowersPct = Math.max(0, +(100 - state.stats.followersPct).toFixed(1));
      setVal('input-donut-nonfollowers', state.stats.nonfollowersPct);
      renderStats();
    });

    bind('input-donut-nonfollowers', v => {
      state.stats.nonfollowersPct = parseFloat(v) || 0;
      state.stats.followersPct = Math.max(0, +(100 - state.stats.nonfollowersPct).toFixed(1));
      setVal('input-donut-followers', state.stats.followersPct);
      renderStats();
    });

    bind('input-stat-reached', v => { state.stats.reached = v; renderStats(); });
    bind('input-stat-likes',   v => { state.stats.likes = v;   renderStats(); });
    bind('input-stat-replies', v => { state.stats.replies = v; renderStats(); });

    // Story image upload
    const upload = document.getElementById('upload-story-bg');
    if (upload) {
      upload.addEventListener('change', e => {
        const f = e.target.files[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = ev => { state.story.image = ev.target.result; renderStoryTop(); };
        reader.readAsDataURL(f);
      });
    }

    // Reset button
    const resetBtn = document.getElementById('btn-reset-defaults');
    if (resetBtn) resetBtn.addEventListener('click', () => applyPreset('standard'));

    // Phone model select (both toolbar + control panel)
    ['select-phone-model', 'select-phone-model-ctrl'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', e => {
        const frame = document.getElementById('iphone-phone-frame');
        if (frame) frame.className = `iphone-frame ${e.target.value}`;
        const otherId = id === 'select-phone-model' ? 'select-phone-model-ctrl' : 'select-phone-model';
        const otherEl = document.getElementById(otherId);
        if (otherEl) otherEl.value = e.target.value;
        setTimeout(updateUnderlinePosition, 50);
      });
    });

    // Frameless toggle
    const frameFlat = document.getElementById('tool-frame-flat');
    if (frameFlat) {
      frameFlat.addEventListener('click', () => {
        const frame = document.getElementById('iphone-phone-frame');
        if (frame) frame.classList.toggle('frameless');
        frameFlat.classList.toggle('active');
      });
    }

    // Radio: stats / viewers
    const radioStats   = document.getElementById('radio-mode-stats');
    const radioViewers = document.getElementById('radio-mode-viewers');
    if (radioStats)   radioStats.addEventListener('change',   () => switchMockupTab('stats'));
    if (radioViewers) radioViewers.addEventListener('change', () => switchMockupTab('viewers'));
  }

  function bind(id, cb) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', e => cb(e.target.value));
  }

  // --- TOOLBAR & TAB SWITCHING ---
  function initToolbarControls() {
    const statsBtn   = document.getElementById('mockup-tab-stats');
    const viewersBtn = document.getElementById('mockup-tab-viewers');
    if (statsBtn)   statsBtn.addEventListener('click',   () => switchMockupTab('stats'));
    if (viewersBtn) viewersBtn.addEventListener('click', () => switchMockupTab('viewers'));
  }

  function switchMockupTab(tab) {
    state.activeTab = tab;
    const sheet        = document.getElementById('ig-bottom-sheet');
    const statsBtn     = document.getElementById('mockup-tab-stats');
    const viewersBtn   = document.getElementById('mockup-tab-viewers');
    const statsPanel   = document.getElementById('ig-panel-stats');
    const viewPanel    = document.getElementById('ig-panel-viewers');
    const radioStats   = document.getElementById('radio-mode-stats');
    const radioViewers = document.getElementById('radio-mode-viewers');

    if (sheet) sheet.setAttribute('data-tab', tab);

    if (tab === 'stats') {
      statsBtn?.classList.add('active');   viewersBtn?.classList.remove('active');
      statsPanel?.classList.add('active'); viewPanel?.classList.remove('active');
      if (radioStats) radioStats.checked = true;
    } else {
      viewersBtn?.classList.add('active'); statsBtn?.classList.remove('active');
      viewPanel?.classList.add('active');  statsPanel?.classList.remove('active');
      if (radioViewers) radioViewers.checked = true;
    }
    updateUnderlinePosition();
  }

  function updateUnderlinePosition() {
    const sheet = document.getElementById('ig-bottom-sheet');
    const underline = document.querySelector('.ig-tab-underline');
    const activeBtn = document.querySelector('.ig-tab-button.active');
    const tabsRow = document.querySelector('.ig-tabs-row');

    if (underline && activeBtn && tabsRow) {
      const rowRect = tabsRow.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();
      const left = btnRect.left - rowRect.left;
      const width = btnRect.width;
      underline.style.left = `${left}px`;
      underline.style.width = `${width}px`;
    }
  }

  // --- CONTROL PANEL TABS ---
  function initTabSwitching() {
    document.querySelectorAll('.ctrl-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.ctrl-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.ctrl-tab-content').forEach(c => {
          c.style.display = c.id === `ctrl-panel-${btn.dataset.tab}` ? 'block' : 'none';
        });
      });
    });
  }

  // --- RENDER ---
  function renderAll() {
    renderStatusBar();
    renderStoryTop();
    renderStats();
    renderViewers();
    setTimeout(updateUnderlinePosition, 40);
  }

  function renderStatusBar() {
    const timeEl = document.getElementById('mockup-time');
    if (timeEl) timeEl.textContent = state.statusBar.time || '11:35';

    const bell = document.getElementById('mockup-silent-bell');
    if (bell) {
      bell.style.display = state.statusBar.silent !== false ? 'block' : 'none';
    }

    const bars = document.querySelectorAll('#mockup-signal-bars .signal-bar');
    bars.forEach((b, i) => {
      b.classList.toggle('inactive', i >= state.statusBar.signal);
    });

    const netText = document.getElementById('mockup-network-text');
    const wifiIcon = document.getElementById('mockup-wifi-icon');
    const net = state.statusBar.network || 'wifi';
    if (net === 'wifi') {
      if (wifiIcon) wifiIcon.style.display = 'block';
      if (netText)  netText.style.display = 'none';
    } else {
      if (wifiIcon) wifiIcon.style.display = 'none';
      if (netText)  {
        netText.style.display = 'block';
        netText.textContent = net;
      }
    }

    const batLevel = document.getElementById('mockup-battery-level');
    const batNum   = document.getElementById('mockup-battery-percent');
    const pct = Math.max(5, Math.min(100, state.statusBar.battery));
    if (batLevel) batLevel.style.width = pct + '%';
    if (batNum) {
      batNum.textContent = pct;
      batNum.style.display = state.statusBar.showBatteryNum !== false ? 'inline' : 'none';
    }

    // Battery styling
    if (batLevel) {
      batLevel.style.background = pct <= 50 ? '#34c759' : '#1a1a1a';
    }
    const pillEl = batLevel ? batLevel.closest('.battery-pill') : null;
    if (pillEl) {
      pillEl.style.borderColor = pct <= 50 ? '#34c759' : '#555';
    }
    const nubEl = pillEl ? pillEl.querySelector('.battery-nub') : null;
    if (nubEl) nubEl.style.background = pct <= 50 ? '#34c759' : '#555';
  }

  function renderStoryTop() {
    const card = document.getElementById('mockup-story-card');
    if (card) card.style.backgroundImage = `url("${state.story.image}")`;

    const viewsPill = document.getElementById('mockup-story-views-pill');
    const viewsCount = document.getElementById('mockup-story-views-count');
    if (viewsPill && viewsCount) {
      viewsCount.textContent = formatNumber(state.story.viewsCount || state.stats.views);
      viewsPill.style.display = state.story.showPill !== false ? 'flex' : 'none';
    }

    const tabViewersCount = document.getElementById('mockup-tab-viewers-count');
    if (tabViewersCount) {
      tabViewersCount.textContent = state.tabViewersCount ? formatNumber(state.tabViewersCount) : '';
    }
  }

  function renderStats() {
    setText('stat-val-views',              formatNumber(state.stats.views));
    setText('stat-val-interactions',       formatNumber(state.stats.interactions));
    setText('stat-val-profile',            formatNumber(state.stats.profileActivity));
    setText('stat-val-reached',            formatNumber(state.stats.reached));
    setText('stat-val-interactions-total', formatNumber(state.stats.interactions));
    setText('stat-val-likes',              formatNumber(state.stats.likes));
    setText('stat-val-replies',            state.stats.replies);
    setText('stat-val-shares',             state.stats.shares || '--');
    renderDonut();
  }

  function renderDonut() {
    // Center value
    setText('stat-donut-center-val', formatNumber(state.stats.views));

    const fPct  = Math.max(0, Math.min(100, state.stats.followersPct)) / 100;
    const nfPct = Math.max(0, Math.min(100, state.stats.nonfollowersPct)) / 100;

    setText('stat-donut-followers-pct',    state.stats.followersPct + '%');
    setText('stat-donut-nonfollowers-pct', state.stats.nonfollowersPct + '%');

    const cFol = document.getElementById('donut-circle-followers');
    const cNon = document.getElementById('donut-circle-nonfollowers');
    if (!cFol || !cNon) return;

    const r = 78;
    const C = 2 * Math.PI * r; // ~490.09
    const gap = 10; // gap between arcs (matches rounded caps)

    let fLen  = fPct  * C;
    let nfLen = nfPct * C;

    if (fPct >= nfPct) {
      if (fPct > 0 && fLen < 20) fLen = 20;
      if (nfPct > 0 && nfLen < 14) nfLen = 14;

      cFol.style.transform = 'rotate(-90deg)';
      cFol.style.transformOrigin = '100px 100px';
      cFol.style.strokeDasharray  = `${fLen} ${C}`;
      cFol.style.strokeDashoffset = `${-(gap / 2)}`;

      cNon.style.transform = 'rotate(-90deg)';
      cNon.style.transformOrigin = '100px 100px';
      cNon.style.strokeDasharray  = `${nfLen} ${C}`;
      cNon.style.strokeDashoffset = `${-(fLen + gap * 1.5)}`;
    } else {
      if (nfPct > 0 && nfLen < 20) nfLen = 20;
      if (fPct > 0 && fLen < 14) fLen = 14;

      cFol.style.transform = 'rotate(-90deg)';
      cFol.style.transformOrigin = '100px 100px';
      cFol.style.strokeDasharray  = `${fLen} ${C}`;
      cFol.style.strokeDashoffset = `${-(gap / 2)}`;

      cNon.style.transform = 'rotate(-90deg)';
      cNon.style.transformOrigin = '100px 100px';
      cNon.style.strokeDasharray  = `${nfLen} ${C}`;
      cNon.style.strokeDashoffset = `${-(fLen + gap * 1.5)}`;
    }

    if (nfPct === 0) cNon.style.strokeDasharray = `0 ${C}`;
    if (fPct === 0)  cFol.style.strokeDasharray = `0 ${C}`;
  }

  function renderViewers() {
    const list = document.getElementById('mockup-viewers-list');
    if (!list) return;
    list.innerHTML = '';

    state.viewers.forEach(v => {
      const li = document.createElement('li');
      li.className = 'viewer-li-item';

      let ringClass = 'ring-none';
      if (v.ring === 'gradient')      ringClass = 'ring-gradient';
      if (v.ring === 'close_friends') ringClass = 'ring-close-friends';

      const reaction = v.reaction
        ? `<div class="viewer-reaction-bubble">${v.reaction}</div>` : '';
      const verified = v.verified
        ? `<img src="assets/verified.png" width="13" height="13" alt="Verified" class="ig-verified-icon" onerror="this.outerHTML='<svg class=\'ig-verified-icon\' viewBox=\'0 0 40 40\'><path fill=\'#0095f6\' d=\'M19.998 3.094L14.638 0l-5.9 3.094-6.447.859-.859 6.447L0 14.638l3.094 5.36L0 25.362l.859 6.447 6.447.859 5.36 3.094 5.36-3.094 6.447-.859.859-6.447L40 25.362l-3.094-5.36L40 14.638l-.859-6.447-6.447-.859-5.36-3.094-5.36 3.094z\'/><polygon fill=\'#fff\' points=\'17.272 26.559 10.973 20.26 13.518 17.715 17.272 21.469 26.482 12.259 29.027 14.804\'/></svg>'">` : '';

      li.innerHTML = `
        <div class="viewer-li-left">
          <div class="viewer-avatar-wrapper">
            <div class="viewer-avatar-ring ${ringClass}">
              <div class="viewer-avatar-img" style="background-image:url('${v.avatar}')"></div>
            </div>
            ${reaction}
          </div>
          <div class="viewer-names-box">
            <div class="viewer-username-line">
              <span class="viewer-user-text">${v.username}</span>
              ${verified}
            </div>
            <span class="viewer-fullname-text">${v.name || ''}</span>
          </div>
        </div>
        <button class="viewer-dots-btn" type="button" aria-label="Options">
          <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="1.5"/><circle cx="6" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/></svg>
        </button>`;
      list.appendChild(li);
    });

    renderViewersEditor();
  }

  function renderViewersEditor() {
    const cont = document.getElementById('viewers-edit-list');
    if (!cont) return;
    cont.innerHTML = '';

    state.viewers.forEach((v, idx) => {
      const row = document.createElement('div');
      row.className = 'viewer-edit-card';
      row.innerHTML = `
        <label class="viewer-edit-avatar" style="background-image:url('${v.avatar}')">
          <input type="file" accept="image/*" class="viewer-avatar-file-input" data-idx="${idx}">
        </label>
        <input type="text" class="form-input" style="padding:5px 8px;font-size:12px;" value="${v.username}" data-idx="${idx}" data-field="username">
        <select class="form-select" style="padding:5px;font-size:11px;" data-idx="${idx}" data-field="reaction">
          <option value="" ${!v.reaction ? 'selected' : ''}>None</option>
          <option value="❤️" ${v.reaction==='❤️' ? 'selected' : ''}>❤️</option>
          <option value="🔥" ${v.reaction==='🔥' ? 'selected' : ''}>🔥</option>
          <option value="😍" ${v.reaction==='😍' ? 'selected' : ''}>😍</option>
          <option value="👏" ${v.reaction==='👏' ? 'selected' : ''}>👏</option>
        </select>
        <label style="font-size:11px;display:flex;align-items:center;gap:3px;cursor:pointer;">
          <input type="checkbox" data-idx="${idx}" data-field="verified" ${v.verified ? 'checked' : ''}> ✓
        </label>
        <button class="btn-delete-viewer" type="button" data-idx="${idx}" aria-label="Delete">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
        </button>`;
      cont.appendChild(row);
    });

    cont.querySelectorAll('input[data-field="username"]').forEach(el =>
      el.addEventListener('input', e => { state.viewers[e.target.dataset.idx].username = e.target.value; renderViewers(); }));
    cont.querySelectorAll('select[data-field="reaction"]').forEach(el =>
      el.addEventListener('change', e => { state.viewers[e.target.dataset.idx].reaction = e.target.value; renderViewers(); }));
    cont.querySelectorAll('input[data-field="verified"]').forEach(el =>
      el.addEventListener('change', e => { state.viewers[e.target.dataset.idx].verified = e.target.checked; renderViewers(); }));
    cont.querySelectorAll('.btn-delete-viewer').forEach(el =>
      el.addEventListener('click', e => { state.viewers.splice(e.currentTarget.dataset.idx, 1); renderViewers(); }));
    cont.querySelectorAll('.viewer-avatar-file-input').forEach(el =>
      el.addEventListener('change', e => {
        const f = e.target.files[0]; if (!f) return;
        const r = new FileReader();
        r.onload = ev => { state.viewers[e.target.dataset.idx].avatar = ev.target.result; renderViewers(); };
        r.readAsDataURL(f);
      }));
  }

  // --- VIEWERS CONTROLS ---
  function initViewersControls() {
    const addBtn = document.getElementById('btn-add-viewer');
    if (addBtn) addBtn.addEventListener('click', () => {
      state.viewers.unshift({ id: `v_${Date.now()}`, username: 'new_user', name: 'New User',
        verified: false, reaction: '', ring: 'none', avatar: DEFAULT_AVATARS[0] });
      renderViewers();
    });

    const genBtn = document.getElementById('btn-generate-random-viewers');
    if (genBtn) genBtn.addEventListener('click', () => {
      state.viewers = Array.from({ length: 10 }, (_, i) => {
        const t = RANDOM_USERNAMES[i % RANDOM_USERNAMES.length];
        return { id: `v_${Date.now()}_${i}`, username: t.username, name: t.name,
          verified: t.verified, reaction: t.reaction, ring: t.ring,
          avatar: DEFAULT_AVATARS[i % DEFAULT_AVATARS.length] };
      });
      renderViewers();
    });
  }

  // --- EXPORT ---
  function initExportActions() {
    const dlBtn   = document.getElementById('btn-download-image');
    const copyBtn = document.getElementById('btn-copy-clipboard');
    if (dlBtn)   dlBtn.addEventListener('click',   () => exportMockup(false));
    if (copyBtn) copyBtn.addEventListener('click',  () => exportMockup(true));
  }

  function exportMockup(copy) {
    const frame = document.getElementById('iphone-phone-frame');
    if (!frame) return;
    const pw = document.getElementById('export-progress-wrap');
    const pf = document.getElementById('export-progress-fill');
    if (pw) pw.style.display = 'block';
    if (pf) pf.style.width = '40%';

    html2canvas(frame, { scale: 3, useCORS: true, allowTaint: true, backgroundColor: null })
      .then(canvas => {
        if (pf) pf.style.width = '100%';
        setTimeout(() => { if (pw) pw.style.display = 'none'; if (pf) pf.style.width = '0'; }, 400);

        if (copy) {
          canvas.toBlob(blob => {
            if (navigator.clipboard?.write) {
              navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
                .then(() => showToast('Copied to clipboard! 📋'))
                .catch(() => dlCanvas(canvas));
            } else { dlCanvas(canvas); }
          });
        } else { dlCanvas(canvas); }
      });
  }

  function dlCanvas(canvas) {
    const a = document.createElement('a');
    a.download = `ig-story-views-${Date.now()}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
    showToast('Downloaded! 🎉');
  }

  // --- UTILS ---
  function setText(id, v) { const el = document.getElementById(id); if (el) el.textContent = v; }

  function formatNumber(num) {
    if (num === null || num === undefined) return '--';
    const n = Number(num);
    if (isNaN(n)) return String(num);
    return n.toLocaleString('en-US');
  }

  function showToast(msg) {
    document.querySelectorAll('.custom-toast').forEach(t => t.remove());
    const t = document.createElement('div');
    t.className = 'custom-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 2500);
  }

})();
